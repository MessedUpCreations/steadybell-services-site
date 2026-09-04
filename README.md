# SteadyBell Services website

A responsive launch website for **SteadyBell Services** and `steadybellservices.com`, prepared for GitHub + Vercel.

## What is included

- `index.html` — complete one-page business website
- `styles.css` — responsive SteadyBell visual system
- `script.js` — mobile navigation, current year, and AJAX contact-form handling
- `assets/steadybell-logo.svg` — editable vector brand mark
- `assets/favicon.svg` — browser icon
- `api/contact.js` — Vercel serverless contact-form endpoint
- `package.json` — installs Nodemailer for the contact form
- `vercel.json` — clean URLs + basic security headers
- `.env.example` — example email environment variables
- `404.html`, `robots.txt`, `sitemap.xml`

## 1. Put it on GitHub

1. Create a new GitHub repository, for example `steadybell-services-site`.
2. Upload **the contents of this folder** to the repository root. Do not upload only the ZIP file.
3. Commit the files.

## 2. Import the repo into Vercel

1. In Vercel choose **Add New > Project**.
2. Import the new GitHub repository.
3. Framework preset: **Other**.
4. Root directory: repository root (`.`).
5. No custom build command or output directory is required.
6. Deploy.

The public site will work immediately. The contact form needs the email environment variables below before it can send mail.

## 3. Connect the contact form to your IONOS mailbox

Create the mailbox you want to receive leads at (for example `hello@steadybellservices.com`). Then in Vercel open:

**Project > Settings > Environment Variables**

Add:

```text
SMTP_HOST=smtp.ionos.com
SMTP_PORT=587
SMTP_USER=hello@steadybellservices.com
SMTP_PASS=YOUR_IONOS_MAILBOX_PASSWORD
SMTP_FROM=hello@steadybellservices.com
CONTACT_TO=hello@steadybellservices.com
```

Use the real mailbox address/password. Do **not** put the real password into GitHub or `.env.example`.

After adding or changing environment variables, redeploy the project so the serverless function receives them.

If you use a different email provider later, change the SMTP values to that provider's settings.

## 4. Connect steadybellservices.com

After the Vercel deployment is working:

1. Open **Project > Settings > Domains** in Vercel.
2. Add `steadybellservices.com` and `www.steadybellservices.com`.
3. Keep DNS hosted at IONOS if you are using IONOS email.
4. Add only the A/CNAME records Vercel shows for the website.
5. Do not delete IONOS MX/email records.
6. Make `steadybellservices.com` the primary domain and redirect `www` to it if desired.

## Before going live

- Test the site on desktop and mobile.
- Submit the contact form yourself and confirm the lead email arrives.
- Confirm the pricing and launch hours are still correct.
- Review the service agreement before accepting the first paying client.
- If your mailbox is not `hello@steadybellservices.com`, update Vercel environment variables only; the site itself does not publicly hard-code an email address.

## Current site copy assumptions

- Live coverage: Monday–Friday, 8 AM–5 PM Central
- Missed Call Rescue: $99/month, 50 minutes, $2.50/min overage
- Overflow 100: $199/month, 100 minutes, $2.50/min overage
- Overflow 200: $379/month, 200 minutes, $2.25/min overage
- Optional authorized outbound work: $55/hour, billed in 15-minute increments
- Standard $49 onboarding fee currently waived
- Standard plan usage billed in 30-second increments
- Unused minutes do not roll over

Update the copy before launch if any of those policies change.
