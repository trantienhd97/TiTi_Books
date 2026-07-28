#!/usr/bin/env bash
set -euo pipefail

# Sync Supa/docs →
#   1) mkdocs-site/docs              (local MkDocs)
#   2) docs-manager/public/supa-docs (GitHub Pages / docs-manager)
# Also generates:
#   - index.md (from README.md) for MkDocs
#   - manifest.json for docs-manager folder navigation

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REPO_ROOT="$(cd "$ROOT_DIR/.." && pwd)"
SRC="$ROOT_DIR/docs"
MKDOCS_DEST="$ROOT_DIR/mkdocs-site/docs"
PAGES_DEST="$REPO_ROOT/docs-manager/public/supa-docs"
MANIFEST="$PAGES_DEST/manifest.json"

if [[ ! -d "$SRC" ]]; then
  echo "ERROR: docs source not found: $SRC" >&2
  exit 1
fi

echo "==> Syncing docs from $SRC"
mkdir -p "$MKDOCS_DEST" "$PAGES_DEST"

echo "  → $MKDOCS_DEST"
rsync -av --delete --exclude '.DS_Store' "$SRC/" "$MKDOCS_DEST/"

echo "  → $PAGES_DEST"
rsync -av --delete --exclude '.DS_Store' "$SRC/" "$PAGES_DEST/"

# MkDocs expects index.md (Material section pages). Copy from README.md.
echo "==> Preparing MkDocs index.md files"
if [[ -f "$MKDOCS_DEST/README.md" ]]; then
  cp "$MKDOCS_DEST/README.md" "$MKDOCS_DEST/index.md"
fi
find "$MKDOCS_DEST" -mindepth 1 -type d -print0 | while IFS= read -r -d '' dir; do
  if [[ -f "$dir/README.md" ]]; then
    cp "$dir/README.md" "$dir/index.md"
  fi
done

# Manifest for docs-manager: auto-discover folders + md files.
# Display names are taken from docs/README.md table when available.
echo "==> Generating docs-manager manifest.json"
export SRC PAGES_DEST MANIFEST
python3 <<'PY'
import json
import os
import re
from pathlib import Path

src = Path(os.environ["SRC"])
pages_dest = Path(os.environ["PAGES_DEST"])
manifest_path = Path(os.environ["MANIFEST"])

name_map: dict[str, str] = {}
readme = src / "README.md"
if readme.exists():
    # | [`folder`](folder/README.md) | Display name | ...
    pattern = re.compile(
        r"\|\s*\[`([^`]+)`\]\([^)]+\)\s*\|\s*([^|]+)\|",
        re.MULTILINE,
    )
    for match in pattern.finditer(readme.read_text(encoding="utf-8")):
        folder_id = match.group(1).strip()
        display = match.group(2).strip()
        # Keep short label before parenthetical note when present
        display = re.split(r"\s*\(", display, maxsplit=1)[0].strip()
        if folder_id and display:
            name_map[folder_id] = display

folders = []
for entry in sorted(pages_dest.iterdir(), key=lambda p: p.name.lower()):
    if not entry.is_dir() or entry.name.startswith("."):
        continue
    files = sorted(
        str(p.relative_to(pages_dest)).replace("\\", "/")
        for p in entry.rglob("*.md")
        if p.is_file()
    )
    if not files:
        continue
    # Prefer README.md first
    files.sort(key=lambda f: (0 if f.endswith("/README.md") or f == "README.md" else 1, f.lower()))
    folders.append(
        {
            "id": entry.name,
            "name": name_map.get(entry.name, entry.name.replace("-", " ").title()),
            "files": files,
        }
    )

payload = {
    "generated_from": "Supa/docs",
    "folders": folders,
}
manifest_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"  wrote {manifest_path} ({len(folders)} folders)")
PY

echo "==> Done."
echo "    MkDocs:  cd Supa/mkdocs-site && mkdocs serve"
echo "    Pages:   docs are in docs-manager/public/supa-docs (push master to deploy)"
