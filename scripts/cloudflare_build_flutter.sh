#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(pwd)"
FLUTTER_DIR="/tmp/flutter"
RELEASES_JSON="/tmp/flutter-releases.json"

echo "Resolving latest stable Flutter SDK..."
curl -fsSL https://storage.googleapis.com/flutter_infra_release/releases/releases_linux.json -o "$RELEASES_JSON"
FLUTTER_ARCHIVE="$(python3 -c 'import json; d=json.load(open("/tmp/flutter-releases.json")); print(next(r["archive"] for r in d["releases"] if r.get("channel")=="stable" and r.get("archive","").endswith(".tar.xz")))')"
echo "Downloading Flutter SDK archive: $FLUTTER_ARCHIVE"
curl -fL --retry 3 "https://storage.googleapis.com/flutter_infra_release/releases/$FLUTTER_ARCHIVE" -o /tmp/flutter-sdk.tar.xz
tar -xf /tmp/flutter-sdk.tar.xz -C /tmp
export PATH="$FLUTTER_DIR/bin:$PATH"
flutter --version
flutter config --no-analytics
cd "$ROOT_DIR/flutter"
flutter pub get
flutter build web --release
echo "Flutter web output: $ROOT_DIR/flutter/build/web"
