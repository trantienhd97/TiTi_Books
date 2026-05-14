# Supa MkDocs site

This folder contains a MkDocs Material site for Supa documentation.

Quick start (one-time setup):

```bash
# from this folder
cd /Users/tientv/Development/tientv/TiTiBooks/Supa/mkdocs-site
# create virtualenv (recommended)
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# sync docs from parent Supa folder (see ../scripts/sync_docs_to_mkdocs.sh)
../scripts/sync_docs_to_mkdocs.sh

# serve locally
mkdocs serve
```

Build for production:

```bash
mkdocs build   # outputs static site to mkdocs-site/site/
```

Deploy: connect to Netlify/Vercel or use GitHub Actions workflow in `.github/workflows/deploy-mkdocs.yml`.
