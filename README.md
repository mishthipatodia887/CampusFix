# Complaint Management System

A responsive web app where customers file complaints and track their progress, and staff review, assign and resolve them. Built with plain HTML, CSS and JavaScript. No server or build step: everything runs in the browser and data is saved in `localStorage`.

## Features
**Customers**
- File a complaint with validation and an optional photo (resized in the browser)
- Get a unique reference number such as `CMP-48213`
- Track status with a progress line and the full update history

**Staff** (login: `admin@example.com` / `admin123`)
- Dashboard with totals, resolution rate, overdue count and a complaints-by-category chart
- Search and filter by status and category
- Assign a complaint to a team member, change its status, and message the customer
- Internal notes that customers never see
- "Email customer" button, CSV export of all complaints, delete complaints
- Overdue rule: High priority open over 3 days, others over 7

**General:** light and dark mode, mobile friendly, keyboard accessible forms and dialogs.

## Project structure
```
complaint-management-system/
├── index.html        # page shell
├── css/style.css     # styles (CSS variables, grid, dark mode)
├── js/app.js         # all logic: views, storage, forms, dashboard
└── assets/favicon.svg
```

## Run it
Open `index.html` in any modern browser. No installation needed.

## Deploy free with GitHub Pages
1. Create a new repository on GitHub and upload the contents of this folder.
2. Go to **Settings, Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
3. After a minute your site is live at `https://<your-username>.github.io/<repository-name>/`.

## How it works
- Complaints are stored as JSON under one `localStorage` key and loaded on start. Sample data is created on first visit.
- The page is rendered by small view functions (`viewFile`, `viewTrack`, `viewStaff`) and switched by a small `go()` function that also keeps the URL hash in sync.
- Staff actions (status, assignment, notes) append to each complaint's history, which the tracking page shows to the customer. Internal notes are kept separate.

## Limitations
Data stays in one browser and the staff login is a front-end demo, not real security. A production version would need a backend API, a database and proper authentication.
