<<<<<<< HEAD
# Veena College Website — React + PHP/MySQL

A modular college website starter with a React/Vite public site and a PHP/MySQL admin panel. Intended for deployment on Hostinger shared hosting with PHP and MySQL support.

## Included

- Responsive public website: Home, About, Programmes, Admissions, Campus Life, News & Notices, Contact
- React Router navigation
- Modular reusable components and CSS
- Admin login with PHP sessions and password hashing
- Create, edit, publish/unpublish and delete articles/notices
- Draft vs published status
- Public website fetches published content from the PHP API
- MySQL schema and one-time admin creation page
- Hostinger deployment instructions

## Important content note

This is a working starter/template, not an official Veena College website yet. The programme cards, address, phone, email, history and some introductory copy are placeholders. Replace them with college-approved facts, logo, images, course details and policies before launch. Do not publish unverified accreditation, affiliation, admission dates or fee information.

## Requirements

- Node.js 20 or later on your development computer
- Hostinger plan with PHP 8.1+ and MySQL/MariaDB
- HTTPS enabled on your domain
- MySQL database and database user created in hPanel

## Run locally

1. Install Node.js LTS.
2. Extract this project and open a terminal in the project directory.
3. Run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL printed by Vite.
5. The public pages render without the backend; admin publishing requires PHP and MySQL to be configured.

Build the React website:

```bash
npm run build
```

The compiled website is created in `dist/`.

## Hostinger deployment

### A. Create the database

1. Sign in to Hostinger hPanel.
2. Open Databases → Management (wording may vary).
3. Create a MySQL database and database user. Save the database name, username and password.
4. Open phpMyAdmin for that database.
5. Import `database/schema.sql`.

### B. Configure the PHP API

1. Copy `api/config.example.php` to `api/config.php`.
2. Put the exact Hostinger database host, database name, username and password into `api/config.php`.
3. Never upload or publish real database credentials in a public repository.
4. Keep PHP files on the server; the API path should be `/api/index.php`.

### C. Build and upload

1. On your computer run `npm install` and `npm run build`.
2. Upload the **contents of `dist/`** to the domain's `public_html/` directory.
3. Upload the project's `api/` directory into `public_html/api/`.
4. Upload the `database/` directory only if you want to retain the schema reference on the server; it is not required at runtime. Prefer removing SQL setup files from public hosting after importing.
5. Copy `public/.htaccess` to `public_html/.htaccess`. If your hosting already has rewrite rules, merge carefully rather than overwriting unrelated rules.
6. Enable HTTPS in hPanel and force HTTPS for the domain.
7. Visit `https://your-domain.example/api/index.php?route=content` to check that the API responds. Before the database is configured it will return a setup message.

### D. Create the first admin

1. Upload `api/setup-admin.php`.
2. Visit `https://your-domain.example/api/setup-admin.php` over HTTPS.
3. Create a unique username and a strong password of at least 12 characters.
4. **Immediately delete `public_html/api/setup-admin.php`** using Hostinger File Manager.
5. Sign in at `https://your-domain.example/admin`.

The setup page refuses to create another admin once one already exists. Delete it after first use regardless.

### E. Check publishing

1. Sign in at `/admin`.
2. Create a notice or article and set status to Published.
3. Check `/news` and the homepage. Drafts should not appear publicly.
4. Test the site on mobile, tablet and desktop.
5. Confirm the site has valid contact details, approved privacy text, working downloads and the correct college logo.

## Project structure

```text
veena-college-website/
├── api/
│   ├── config.example.php
│   ├── index.php
│   ├── setup-admin.php
│   └── .htaccess
├── database/
│   └── schema.sql
├── public/
│   └── .htaccess
├── src/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── api.js
│   ├── data.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## How to add another static page

1. Create a component in `src/pages/`.
2. Add a route in `src/App.jsx`.
3. Add a navigation link in `src/components/Header.jsx` if required.
4. Add the page's CSS to `src/styles/global.css` or a separate imported stylesheet.
5. Run `npm run build` and upload the updated `dist/` contents.

## Admin functionality

- **Article:** longer news story with summary and body.
- **Notification:** admission notice, exam update, circular or announcement.
- **Draft:** saved in the database but hidden from the public API.
- **Published:** returned by the public API and displayed on the News page.
- **Attachment URL:** optional link to a PDF or other file already uploaded to a trusted location.

This starter uses attachment URLs rather than file uploads. Upload PDFs through Hostinger File Manager or another approved document store, then paste the public URL into the admin panel.

## Production hardening checklist

Before launch:
- Keep HTTPS enabled and use strong, unique admin passwords.
- Remove `api/setup-admin.php` and any publicly accessible SQL setup files.
- Keep PHP, hosting software and dependencies updated.
- Restrict hosting account access with MFA if available.
- Back up database and website files regularly.
- Consider rate limiting and login-attempt controls for the admin login.
- Add CSRF protection if you later expose the API cross-origin or expand the admin features.
- Validate attachment URLs and use only trusted HTTPS links.
- Add privacy, accessibility, cookie and grievance policies as appropriate.
- Test restore from a backup.
- For a higher-security production launch, ask a developer to perform a security review.

## Design references

The information architecture takes inspiration from the common college-site patterns visible in Jai Hind College and Mithibai College: clear admission/examination notices, programme information, circulars, news and important links. The visual design and code here are newly written and do not copy their source code or branding.
=======
# veena-colleage
Repository created at user's request: Veena Colleage (veena-colleage).
>>>>>>> 60f659823226a0a84763ad6f5835ff569741b4e3
