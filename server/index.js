require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const mongoose  = require('mongoose');
const { body, validationResult } = require('express-validator');

const Contact = require('./models/Contact');
const { sendContactNotification } = require('./services/mailer');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:4173,https://aathi-s-portfolio.netlify.app')
    .split(',').map(s => s.trim()),
  methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// ── MongoDB Connection ──────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅  MongoDB connected:', mongoose.connection.host))
  .catch((err) => {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ── Validation Rules ────────────────────────────────────────
const contactValidation = [
  body('name')
    .trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('email')
    .trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  body('message')
    .trim().notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be 10–2000 characters'),
];

// ─────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────

// GET /api/health
app.get('/api/health', (_req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ status: 'ok', db: dbStatus, time: new Date().toISOString() });
});

// ── POST /api/contact ─ Submit a new message ─────────────────
app.post('/api/contact', contactValidation, async (req, res) => {
  // 1. Validate
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  const { name, email, message } = req.body;
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;

  try {
    // 2. Save to MongoDB
    const contact = await Contact.create({ name, email, message, ipAddress });

    // 3. Send notification email (non-blocking – errors are logged, not thrown)
    sendContactNotification({
      name,
      email,
      message,
      id: contact._id.toString().slice(-6).toUpperCase(),
    }).then(() => console.log(`📧  Email sent for contact ${contact._id}`))
      .catch((err) => console.error('⚠️  Email send failed (message still saved):', err.message));

    return res.status(201).json({
      success: true,
      message: "Your message has been received! I'll get back to you soon.",
      id: contact._id,
    });
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ── GET /api/contacts ─ List all (admin) ─────────────────────
app.get('/api/contacts', async (_req, res) => {
  try {
    const [contacts, total, unread] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }).lean(),
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false }),
    ]);
    return res.json({ success: true, stats: { total, unread }, data: contacts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ── GET /api/contacts/:id ─ Single contact (marks read) ──────
app.get('/api/contacts/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    ).lean();
    if (!contact) return res.status(404).json({ success: false, message: 'Not found.' });
    return res.json({ success: true, data: contact });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid ID.' });
  }
});

// ── DELETE /api/contacts/:id ──────────────────────────────────
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Not found.' });
    return res.json({ success: true, message: 'Contact deleted.' });
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid ID.' });
  }
});

// ── PATCH /api/contacts/:id/read ─────────────────────────────
app.patch('/api/contacts/:id/read', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    ).lean();
    if (!contact) return res.status(404).json({ success: false, message: 'Not found.' });
    return res.json({ success: true, data: contact });
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid ID.' });
  }
});

// 404 catch-all
app.use((_req, res) => res.status(404).json({ success: false, message: 'Endpoint not found.' }));

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  Server running on http://localhost:${PORT}`);
  console.log(`   POST   /api/contact`);
  console.log(`   GET    /api/contacts`);
  console.log(`   GET    /api/contacts/:id`);
  console.log(`   PATCH  /api/contacts/:id/read`);
  console.log(`   DELETE /api/contacts/:id`);
  console.log(`   GET    /api/health\n`);
});
