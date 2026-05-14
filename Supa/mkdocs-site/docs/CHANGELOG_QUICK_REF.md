# Quick Reference: Changelog Generation

## 🚀 Quick Start

### Generate All Missing Release Notes
```bash
./scripts/generate-release-notes.sh
```

### Ask AI to Generate Changelog
```
"generate changelog"
"update release notes"
```

## 📁 Files Created

| File                                     | Purpose                |
| ---------------------------------------- | ---------------------- |
| `.cursor/commands/generate-changelog.md` | AI workflow guide      |
| `scripts/generate-release-notes.sh`      | Automated script       |
| `docs/RELEASE_NOTES_GUIDE.md`            | Complete documentation |
| `docs/CHANGELOG_SUMMARY.md`              | System overview        |

## 🎯 Common Tasks

### Create New Release
```bash
# 1. Tag the release
git tag v1.24.0+1240007
git push origin v1.24.0+1240007

# 2. Generate notes
./scripts/generate-release-notes.sh

# 3. Commit
git add releases/ RELEASE_NOTES.md
git commit -m "docs: Add release notes for v1.24.0+1240007"
```

### Backfill Missing Releases
```bash
./scripts/generate-release-notes.sh
git add releases/
git commit -m "docs: Backfill missing release notes"
```

### Check What's Missing
```bash
comm -23 \
  <(git tag --list --sort=v:refname) \
  <(ls -1 releases/ | sed 's/\.md$//' | sort -V)
```

## 📋 Format

### File Naming
```
v<version>+<build>.md
Example: v1.24.0+1240006.md
```

### File Content
```markdown
# Release Notes - v1.24.0+1240006

- feat: Add new feature description
- fix: Fix bug description
- chore: Update dependencies
```

## 🔧 Manual Commands

### Get All Tags
```bash
git tag --list --sort=-v:refname
```

### Get Commits Between Tags
```bash
git log v1.23.0..v1.24.0 \
  --pretty=format:"- %s" \
  --reverse
```

### Find Previous Tag
```bash
git describe --abbrev=0 --tags v1.24.0+1240006^
```

## ✅ What the Script Does

1. ✅ Fetches all git tags
2. ✅ Finds undocumented versions
3. ✅ Generates release notes for each
4. ✅ Updates RELEASE_NOTES.md
5. ✅ Creates backups
6. ✅ Shows summary

## 📚 Documentation

- **Full Guide**: `docs/RELEASE_NOTES_GUIDE.md`
- **Summary**: `docs/CHANGELOG_SUMMARY.md`
- **AI Workflow**: `.cursor/commands/generate-changelog.md`

## 💡 Tips

- Always tag releases before generating notes
- Review generated files before committing
- Use conventional commits (feat:, fix:, chore:)
- Run script after each release
- Don't edit generated files manually

## 🎉 That's It!

You're ready to automate your changelog generation!
