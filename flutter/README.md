# My Wallet Flutter

A separate, native Flutter implementation of the My Wallet Expense Tracker. The original web app and its deployment are not modified.

## Included in this Flutter starter
- Native Material 3 UI with warm wallet/brown styling
- Dashboard totals, monthly spending, budget progress and category cards
- Add, edit and delete expenses with title, category, amount, date and notes
- Expense history and search
- Split an expense equally or by custom percentages, with validation that allocations total 100%
- Statement preview, copy/share text, CSV export and PDF export/print
- Savings goals and reminder records
- Light/dark theme preference
- Local persistence with SharedPreferences
- Optional Firebase Authentication wiring for email/password and phone OTP
- Free plan selection; no payment details or billing SDK

## Run locally
1. Install Flutter stable and Android Studio.
2. From this folder run `flutter pub get`.
3. For local-only use, run `flutter run`. Expense data stays on the device.
4. To enable real account login, configure Firebase for Android:
   - Create a Firebase project and add your Android application ID.
   - Run `dart pub global activate flutterfire_cli`.
   - Run `flutterfire configure` from this directory. This generates `lib/firebase_options.dart`.
   - Enable Email/Password and Phone providers in Firebase Authentication.
   - Add the generated Android `google-services.json` as instructed by FlutterFire.
   - Enable Firestore if you want to add cloud backup/sync in the next stage.
5. Build an APK with `flutter build apk --release`.

## Authentication notes
- Firebase login is optional until a Firebase project is connected. Without Firebase configuration, the app runs in local-only mode.
- Email login uses email + password. Phone login uses Firebase SMS OTP.
- The Free plan is selected automatically after successful account creation. No payment or card is collected.
- Never commit Firebase service-account credentials or private API keys.

## Current implementation boundaries
This is the initial Flutter port foundation, not a claim that an APK has already been built or deployed. Validate Android package ID, Firebase project settings, app icon, privacy policy and data-safety disclosures before publishing.
