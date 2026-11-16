# Expense Tracker — Android release workspace

This branch prepares the existing HTML/CSS/JavaScript app for a local Android build using Capacitor 8. The existing web app is copied unchanged into `www/index.html`, apart from a small, optional Welcome-screen advertisement slot.

## Build prerequisites
- Node.js 22 or newer
- Android Studio 2025.2.1 or newer
- Android SDK (API 24+)

## First Android project setup
```bash
npm install
npm run copy:web
npm run android:init
npm run android:sync
npm run android:open
```

Build and test an APK from Android Studio. A Play Store release must be signed and uploaded as an Android App Bundle (AAB).

## Welcome banner controls
Edit `ads-config.js`:
- `enabled`: on/off
- `placement`: currently `welcome`
- `title`, `message`, `destinationUrl`
- `campaignStartsAt`, `campaignEndsAt`: optional ISO date/time strings

The banner is off by default, small, dismissible, and does not block app use. Changing this config requires rebuilding/redeploying the app in this first version.

## Subscription implementation status
The agreed commercial plan is ₹99/year with a 3-month introductory free trial, subject to Google Play eligibility and trial offer configuration. The native Google Play Billing purchase flow, server-side purchase verification, premium entitlement enforcement, restore purchases, and subscription disclosures are **not yet implemented**. Do not publish or accept payments until those are completed and tested. Client-side flags alone are not secure for paid entitlements.

Suggested premium entitlement scope for the next implementation stage: advanced reports/analytics, advanced exports, and premium data-management tools. Keep core expense entry and basic history free. Premium subscribers should see no ad banners.

## Data and privacy checks before release
- Confirm localStorage persistence in Android WebView.
- Test export/restore and explain that uninstalling or changing devices can remove locally stored data unless the user exports/backups it.
- Bundle or verify all external CDN libraries for offline behavior.
- Add a privacy policy and complete Play Console data-safety disclosures based on actual app behavior.
- The Play Console account and publishing steps must be handled by an eligible adult account holder if the developer is under 18.
