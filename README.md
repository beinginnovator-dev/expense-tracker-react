# My Wallet — React Expense Tracker

A React + Vite rebuild of the uploaded E-Wallet app. The original HTML and swipe-navigation script are retained under `public/` as migration references.

## Run locally

1. Install Node.js 18 or newer.
2. Run `npm install`.
3. Run `npm run dev`.
4. Run `npm run build` for a production build in `dist/`.

## Cloudflare Pages

- Framework preset: Vite
- Production branch: main
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

## Features in this migration

- Wallet dashboard and spending summaries
- Add, edit, delete and search expenses
- Date and month filtering
- Local persistence
- Category management and monthly budget
- Savings cards and reminders
- Transaction analytics and category breakdown
- CSV import and CSV/TXT export; browser print-to-PDF
- Profile, theme and privacy display controls

## Migration notes

This is a React migration of the main expense-tracking workflows, not yet a one-to-one port of every legacy feature. Advanced PDF/Excel statement parsing, the full BI insight engine, detailed report-generator options, onboarding, feedback submission, and some legacy interactions remain to be migrated and tested. The original app is retained as `public/legacy-reference.html`.
