#!/bin/sh
# Runs on every container start: prepare the storage volume, seed an empty database, then start the API.
set -e

STORAGE_DIR="${STORAGE_DIR:-/data}"
mkdir -p "$STORAGE_DIR/img" "$STORAGE_DIR/media"
# copy the bundled site pictures without overwriting anything already in the volume
for f in ./storage-img/*; do
  [ -e "$STORAGE_DIR/img/$(basename "$f")" ] || cp -R "$f" "$STORAGE_DIR/img/"
done

# migrations + catalogue + first admin, only when the database is empty (--if-empty never overwrites admin edits)
node dist/seed/seed.js --if-empty

exec node dist/main.js
