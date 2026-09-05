const nodemailer = require('nodemailer');

function clean(value, max = 500) {
  return String(value || '').trim().slice(0, max);
}

function escapeHtml(value) {
  return clean(value, 2000)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

  // Honeypot field. Bots often fill this; real visitors never see it.
  if (clean(body.website, 100)) {
    return res.status(200).json({ ok: true });
  }

  const businessName = clean(body.businessName, 120);
  const name = clean(body.name, 100);
  const phone = clean(body.phone, 40);
  const email = clean(body.email, 160);
  const industry = clean(body.industry, 100);
  const message = clean(body.message, 1500);

  if (!businessName || !name || !phone || !email || !isEmail(email)) {
    return res.status(400).json({ message: 'Please complete the required contact fields with a valid email address.' });
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.ionos.com';
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const contactTo = process.env.CONTACT_TO || smtpUser;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;

  if (!smtpUser || !smtpPass || !contactTo || !smtpFrom) {
    return res.status(503).json({ message: 'The contact form is not configured yet. Please try again later.' });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass }
  });

  const subject = `SteadyBell website lead: ${businessName}`;
  const text = [
    'New SteadyBell call-flow review request',
    '',
    `Business: ${businessName}`,
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Industry: ${industry || 'Not selected'}`,
    '',
    'Missed-call workflow / notes:',
    message || 'No additional notes provided.'
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:680px;color:#182326;line-height:1.5">
      <h2 style="margin-bottom:6px">New SteadyBell call-flow review request</h2>
      <p style="margin-top:0;color:#657176">Submitted from steadybellservices.com</p>
      <table cellpadding="7" cellspacing="0" style="border-collapse:collapse;width:100%">
        <tr><td style="color:#657176;width:150px">Business</td><td><strong>${escapeHtml(businessName)}</strong></td></tr>
        <tr><td style="color:#657176">Name</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="color:#657176">Phone</td><td>${escapeHtml(phone)}</td></tr>
        <tr><td style="color:#657176">Email</td><td>${escapeHtml(email)}</td></tr>
        <tr><td style="color:#657176">Industry</td><td>${escapeHtml(industry || 'Not selected')}</td></tr>
      </table>
      <h3 style="margin-bottom:5px">Missed-call workflow / notes</h3>
      <div style="background:#f3f5f2;border-radius:10px;padding:14px">${escapeHtml(message || 'No additional notes provided.').replaceAll('\n','<br>')}</div>
    </div>`;

  try {
    await transporter.sendMail({
      from: `SteadyBell Website <${smtpFrom}>`,
      to: contactTo,
      replyTo: email,
      subject,
      text,
      html
    });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('SteadyBell contact form error:', error);
    return res.status(500).json({ message: 'We could not send your request right now. Please try again in a moment.' });
  }
};
