# My Wallet — React Expense Tracker

React + Vite expense tracker project.

## Project structure

- `index.html` — Vite HTML entry
- `src/main.jsx` — React bootstrap
- `src/App.jsx` — Expense tracker application
- `src/styles.css` — Responsive application styles
- `public/legacy-swipe-navigation.js` — Legacy navigation helper retained as a reference

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Vite writes the production output to `dist/`.

## Cloudflare Pages

- Framework preset: Vite
- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

The React implementation includes expense entry/edit/delete, category totals, search and month filtering, savings goals, reminders, CSV import/export, text reports, print-to-PDF, local persistence, theme and profile settings.

The original legacy HTML file remains in the supplied ZIP and has not been copied into this repository snapshot.

Deployment target: Cloudflare Pages project `expense-tracker-react`.
