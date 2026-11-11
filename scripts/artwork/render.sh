#!/usr/bin/env bash
# Re-render site artwork to transparent PNGs with headless Chrome/Chromium.
#   CHROME="/path/to/chrome" scripts/artwork/render.sh
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$DIR/../.."
CHROME="${CHROME:-google-chrome}"
shot() { "$CHROME" --headless=new --disable-gpu --hide-scrollbars --default-background-color=00000000 --virtual-time-budget=1000 "$@" 2>/dev/null; }

# product images -> public/img/products/<id>.png (1287x900)
for id in premium-pro-voice premium-with-voice premium-without-voice bike-premium excavator-device \
          truck-tracking live-video-tracking easy-obd engine-lock-relay panic-sos-button; do
  shot --force-device-scale-factor=1.5 --window-size=858,600 \
       --screenshot="$ROOT/public/img/products/$id.png" "file://$DIR/product.html?id=$id"
done

# app showcase -> public/img/app/app-showcase.png (cropped to 1580x1700)
shot --force-device-scale-factor=2 --window-size=960,960 \
     --screenshot="$ROOT/public/img/app/app-showcase.png" "file://$DIR/app-showcase.html"
command -v sips >/dev/null && sips -c 1700 1580 --cropOffset 70 90 "$ROOT/public/img/app/app-showcase.png" >/dev/null
echo "done"
