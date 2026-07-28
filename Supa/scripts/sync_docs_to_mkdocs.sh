#!/usr/bin/env bash
set -euo pipefail

# Sync docs from Supa root `docs/` into mkdocs-site/docs/
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT_DIR/docs"
DEST="$ROOT_DIR/mkdocs-site/docs"

echo "Syncing docs from $SRC to $DEST"
mkdir -p "$DEST"
rsync -av --delete "$SRC/" "$DEST/"
echo "Done."
