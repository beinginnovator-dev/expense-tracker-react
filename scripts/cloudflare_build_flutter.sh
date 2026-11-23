#!/usr/bin/env bash
set -Eeuo pipefail
trap 'code=$?; echo "ERROR: Flutter Pages build failed at line ${LINENO} (exit ${code}): ${BASH_COMMAND}"; exit "$code"' ERR
set -x

ROOT_DIR="$(pwd)"
FLUTTER_DIR="/tmp/flutter"
RELEASES_JSON="/tmp/flutter-releases.json"

echo "Building My Wallet Flutter for Cloudflare Pages..."
echo "Checking build tools..."
command -v curl
command -v tar
command -v node

echo "Fetching Flutter stable release metadata..."
curl -fsSL --retry 3 https://storage.googleapis.com/flutter_infra_release/releases/releases_linux.json -o "$RELEASES_JSON"

FLUTTER_ARCHIVE="$(node -e 'const d=require(process.argv[1]); const r=d.releases.find(x=>x.channel==="stable" && /linux-x64\/flutter_linux_.*\.tar\.xz$/.test(x.archive||"")); if(!r) process.exit(2); process.stdout.write(r.archive);' "$RELEASES_JSON")"
if [[ -z "$FLUTTER_ARCHIVE" ]]; then
  echo "ERROR: Could not find the latest stable Linux x64 Flutter SDK archive."
  exit 1
fi

echo "Downloading Flutter SDK: $FLUTTER_ARCHIVE"
curl -fL --retry 3 --retry-delay 2 "https://storage.googleapis.com/flutter_infra_release/releases/$FLUTTER_ARCHIVE" -o /tmp/flutter-sdk.tar.xz
echo "Extracting Flutter SDK..."
tar -xf /tmp/flutter-sdk.tar.xz -C /tmp

export PATH="$FLUTTER_DIR/bin:$PATH"
flutter --version
flutter config --no-analytics --enable-web
flutter precache --web
cd "$ROOT_DIR/flutter"
flutter pub get
flutter build web --release --no-wasm-dry-run
test -f build/web/index.html
echo "SUCCESS: Flutter web output created at $ROOT_DIR/flutter/build/web"
