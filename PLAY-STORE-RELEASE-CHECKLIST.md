# Google Play release readiness — Expense Tracker

This document is the engineering hand-off for the adult account holder and release maintainer. It is not a claim that the app is already approved or ready for public production.

## Current Android packaging

- Application ID: `com.beinginnovator.expensetracker` (keep this stable after first Play release).
- App name: `Expense Tracker`.
- Packaging: Capacitor 8.6.2.
- Android build: GitHub Actions generates the native Android project, runs Capacitor sync, then builds a debug APK and an **unsigned release AAB validation artifact**.
- Target SDK: Capacitor 8.x maps to Android API 36. The Android workflow now explicitly checks for target SDK 36 before building.
- Signing: not configured in GitHub Actions. Do not add signing passwords or keystore files to the repository or chat. Use Play App Signing and a securely stored upload key under the adult account holder's control.

## Subscription plan — proposed, not activated

- Product ID: `premium_annual`
- Base plan ID: `annual-auto`
- Type: auto-renewing annual subscription
- Proposed India price: ₹99 per year
- Proposed offer ID: `trial-3-months`
- Proposed offer: three-month free trial for eligible users
- Benefits: advanced reports/analytics, advanced export/data-management features, and removal of in-app advertising.

The adult Play Console account holder must create the subscription, base plan, regional price and offer in Play Console. The app must fetch the localized price and eligible offer from Google Play at runtime; do not hardcode ₹99 as the actual checkout amount or promise trial eligibility. The purchase screen must clearly state the trial duration, the exact post-trial renewal price and frequency, automatic renewal, and how to cancel. A clearly visible way to continue using the free app must remain available.

## Billing architecture required before paid Premium is enabled

1. Integrate Google Play Billing Library (current official documentation checked 2026-11-16; version 9.1.0 release notes available).
2. Query product details and eligible offers from Google Play; launch the Play purchase flow.
3. Handle purchase updates, pending purchases, acknowledgement, restore/re-query purchases and subscription management.
4. Send the purchase token to a Cloudflare Worker over HTTPS.
5. The Worker authenticates to Google Play Developer API using a service account secret stored only as a Cloudflare secret; call `purchases.subscriptionsv2.get` and validate package name, product ID, subscription state and expiry before granting entitlement.
6. Use Google Play Real-time Developer Notifications (RTDN) to keep entitlements current for renewal, cancellation, grace period, pause, hold, expiry and refund/revoke events.
7. The app must fail closed for Premium if the backend cannot verify entitlement; basic local expense tracking must remain available.
8. Never place service-account JSON, private keys, Play API credentials or purchase tokens in public JSON, the web bundle, GitHub source, logs or client-side flags.

**Not implemented yet:** native billing, the Cloudflare verification Worker, RTDN, real entitlement enforcement, restore purchases and Play Console product setup. Do not expose a working Buy/Subscribe button or charge users until all these components have been implemented and tested by the adult account holder.

## Privacy and data-safety review required

The app currently uses browser localStorage for expense records and loads several third-party libraries from public CDNs (including chart, spreadsheet and PDF libraries). Feedback opens the user's email app with a pre-filled message. These facts must be reflected accurately in the privacy policy and Play Console Data Safety answers. Audit all dependencies, network calls, analytics, ads and feedback flows before making any absolute claim such as "no data is collected". Do not send expense records to Cloudflare as part of remote configuration.

## Release checklist

- [ ] Test all pages and dialogs on short and tall Android screens, including feedback, settings, upload, reports and transaction forms.
- [ ] Verify localStorage survives app restart and test export/backup before uninstall/device migration.
- [ ] Test chart, PDF and spreadsheet features with network on and offline.
- [ ] Confirm app ID and app signing identity before first Play release.
- [ ] Verify API 36 build output and inspect the final AAB manifest.
- [ ] Add versionCode/versionName release management; increase versionCode on every Play submission.
- [ ] Complete privacy policy, Data Safety, ads declaration, content rating, app access and store listing.
- [ ] Implement and test Play Billing + secure server verification + RTDN before Premium sales.
- [ ] Create a signed AAB using a protected upload key and Play App Signing.
- [ ] Run internal testing, then any closed-testing requirement shown in the account's Play Console.
- [ ] Adult account holder submits production release and handles policy declarations.

## Current known limitations

- GitHub Actions debug APK is for device testing only.
- The AAB generated by the workflow is unsigned and is only a build-validation artifact.
- A successful CI build is not a substitute for physical-device QA, Play Console checks or policy approval.
- Cloudflare remote configuration is restricted to non-executable public settings; it must not be used to download executable code or bypass Play Store app updates.
