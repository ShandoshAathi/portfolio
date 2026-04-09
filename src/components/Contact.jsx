import { useEffect, useRef, useState } from 'react';

const contactItems = [
  { icon: '✉️', label: 'Email',    value: 'shandosh6381aathi@gmail.com', href: 'mailto:shandosh6381aathi@gmail.com' },
  { icon: '📞', label: 'Phone',    value: '+91 8883806053',              href: 'tel:+918883806053' },
  { icon: '📍', label: 'Location', value: 'Coimbatore, India',           href: null },
  { icon: '💻', label: 'GitHub',   value: 'github.com/ShandoshAathi',   href: 'https://github.com/ShandoshAathi' },
];

const INITIAL_FORM = { name: '', email: '', message: '' };

const Contact = () => {
  const ref  = useRef(null);
  const [form,    setForm]    = useState(INITIAL_FORM);
  const [status,  setStatus]  = useState('idle');   // idle | loading | success | error
  const [apiMsg,  setApiMsg]  = useState('');
  const [errors,  setErrors]  = useState({});

  /* ── Scroll-in animation ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    const els = ref.current?.querySelectorAll('.animate-on-scroll') || [];
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ── Field change ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear per-field error on edit
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrors({});
    setApiMsg('');

    try {
      const API_BASE = import.meta.env.DEV ? '' : 'https://portfolio-backend-q9ha.onrender.com';
      const res  = await fetch(`${API_BASE}/api/contact`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:    form.name.trim(),
          email:   form.email.trim(),
          message: form.message.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setApiMsg(data.message);
        setForm(INITIAL_FORM);
      } else if (res.status === 422 && data.errors) {
        // Server-side validation errors
        const fieldErrors = {};
        data.errors.forEach(({ field, message }) => { fieldErrors[field] = message; });
        setErrors(fieldErrors);
        setStatus('idle');
      } else {
        setStatus('error');
        setApiMsg(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setApiMsg('Cannot reach the server. Make sure the backend is running.');
    }
  };

  /* ── Send another ── */
  const reset = () => { setStatus('idle'); setApiMsg(''); };

  return (
    <section className="section contact" id="contact" ref={ref}>
      <div className="container">
        <div className="contact-header animate-on-scroll">
          <span className="section-label">Get in Touch</span>
          <h2 className="section-title" style={{ marginTop: '0.5rem' }}>Contact Me</h2>
        </div>

        <div className="contact-grid">
          {/* ── Info card ── */}
          <div className="contact-info-card animate-on-scroll">
            <p className="contact-intro">
              Let's build something amazing together. Feel free to reach out!
            </p>
            {contactItems.map(({ icon, label, value, href }) => (
              <div className="contact-item" key={label}>
                <div className="contact-icon">{icon}</div>
                <div>
                  <div className="contact-item-label">{label}</div>
                  {href ? (
                    <a href={href} target="_blank" rel="noreferrer"
                       className="contact-item-value"
                       style={{ textDecoration: 'none', color: 'inherit' }}>
                      {value}
                    </a>
                  ) : (
                    <div className="contact-item-value">{value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── Form card ── */}
          <div className="contact-form-card animate-on-scroll" style={{ transitionDelay: '0.15s' }}>
            {status === 'success' ? (
              /* Success state */
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ color: '#a78bfa', marginBottom: '0.75rem' }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{apiMsg}</p>
                <button onClick={reset} className="btn-send" style={{ width: 'auto', padding: '0.65rem 2rem' }}>
                  Send Another
                </button>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} noValidate>
                {/* Global error banner */}
                {status === 'error' && (
                  <div className="form-error-banner">
                    ⚠️ {apiMsg}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Your Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    className={`form-input ${errors.name ? 'input-error' : ''}`}
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    disabled={status === 'loading'}
                    required
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Your Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    disabled={status === 'loading'}
                    required
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">Project Details</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    className={`form-textarea ${errors.message ? 'input-error' : ''}`}
                    placeholder="Tell me about your project..."
                    value={form.message}
                    onChange={handleChange}
                    disabled={status === 'loading'}
                    required
                  />
                  {errors.message && <span className="field-error">{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  className="btn-send"
                  id="send-message-btn"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span className="spinner" /> Sending…
                    </span>
                  ) : 'Send Message →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
