const nodemailer = require('nodemailer');

// ── Transporter (Gmail SMTP with App Password) ──────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // your Gmail address
    pass: process.env.EMAIL_PASS,   // 16-char App Password (not your real password)
  },
});

/**
 * Send notification email to the portfolio owner.
 * Called every time someone submits the contact form.
 */
async function sendContactNotification({ name, email, message, id }) {
  const receivedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Portfolio Message</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;background:#0d0d1a;color:#e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d1a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#13132a;border-radius:16px;overflow:hidden;border:1px solid rgba(139,92,246,0.2);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.7);">Portfolio Message</p>
              <h1 style="margin:8px 0 0;font-size:26px;font-weight:800;color:#ffffff;">
                📬 New Contact Received
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">

              <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.6;">
                Hey <strong style="color:#ffffff;">Athikesavan</strong>, someone just reached out through your portfolio!
              </p>

              <!-- Sender info -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#1a1a2e;border-radius:12px;border:1px solid rgba(139,92,246,0.15);overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid rgba(139,92,246,0.1);">
                    <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#64748b;">From</p>
                    <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#ffffff;">${name}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid rgba(139,92,246,0.1);">
                    <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Email</p>
                    <p style="margin:4px 0 0;font-size:15px;color:#a78bfa;">${email}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Received</p>
                    <p style="margin:4px 0 0;font-size:14px;color:#94a3b8;">${receivedAt}</p>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Message</p>
              <div style="background:#1a1a2e;border-left:3px solid #8b5cf6;border-radius:0 12px 12px 0;padding:20px;margin-bottom:28px;">
                <p style="margin:0;font-size:15px;color:#e2e8f0;line-height:1.8;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
              </div>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px;background:linear-gradient(135deg,#6366f1,#8b5cf6);">
                    <a href="mailto:${email}?subject=Re: Your message through my portfolio"
                       style="display:inline-block;padding:12px 28px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
                      ↩ Reply to ${name}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(139,92,246,0.1);text-align:center;">
              <p style="margin:0;font-size:12px;color:#475569;">
                Message #${id} · Sent from your portfolio contact form
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const info = await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    replyTo: email,
    subject: `📬 New message from ${name} — Portfolio`,
    text: `New contact from ${name} (${email}):\n\n${message}\n\nReceived: ${receivedAt}`,
    html,
  });

  return info;
}

module.exports = { sendContactNotification };
