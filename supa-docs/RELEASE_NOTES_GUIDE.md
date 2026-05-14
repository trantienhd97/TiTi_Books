# Changelog & Release Notes Management

This directory contains tools and workflows for managing release notes and changelogs.

## Overview

The project maintains release notes in two places:
- **`releases/`** - Individual release notes for each version tag
- **`RELEASE_NOTES.md`** - The latest version's release notes (used for current release)

## Tools

### 1. AI Command: `/generate-changelog`

Located at: `.cursor/commands/generate-changelog.md`

This is a workflow guide for AI assistants to generate changelogs from git history.

**Usage:**
Simply ask the AI: "generate changelog" or "update release notes"

**What it does:**
- Reads git tag history
- Identifies undocumented versions
- Generates release notes for each missing version
- Updates RELEASE_NOTES.md with the latest version

### 2. Shell Script: `generate-release-notes.sh`

Located at: `scripts/generate-release-notes.sh`

An automated script that generates release notes for all undocumented git tags.

**Usage:**
```bash
./scripts/generate-release-notes.sh
```

**What it does:**
1. Fetches all git tags
2. Checks which versions are missing release notes
3. Generates release notes for each undocumented version
4. Updates RELEASE_NOTES.md with the latest version
5. Creates backups before overwriting files

**Features:**
- ✅ Automatic detection of undocumented versions
- ✅ Chronological commit ordering
- ✅ Human-readable commit messages
- ✅ Colorful console output
- ✅ Backup creation
- ✅ Summary statistics

### 3. Legacy Script: `update-release-notes.sh`

Located at: `scripts/update-release-notes.sh`

Updates RELEASE_NOTES.md from CHANGELOG.md (legacy approach).

**Usage:**
```bash
./scripts/update-release-notes.sh
```

## Release Notes Format

Each release note file follows this format:

```markdown
# Release Notes - v1.24.0+1240006

- feat: Add reply functionality to messages in chat
- feat: Disable pin button in message replies
- fix: Resolve issue with message timestamps
```

### Format Rules

1. **File naming**: `v<version>+<build>.md` (e.g., `v1.24.0+1240006.md`)
2. **Title**: `# Release Notes - v<version>+<build>`
3. **Commits**: Listed in chronological order (oldest to newest)
4. **Commit format**: `- <commit-message>`
5. **Message style**: Use conventional commits (feat:, fix:, chore:, etc.)

## Workflow

### When Creating a New Release

1. **Tag the release** in git:
   ```bash
   git tag v1.24.0+1240007
   git push origin v1.24.0+1240007
   ```

2. **Generate release notes**:
   ```bash
   ./scripts/generate-release-notes.sh
   ```

3. **Review the generated files**:
   - Check `releases/v1.24.0+1240007.md`
   - Check `RELEASE_NOTES.md`

4. **Commit the changes**:
   ```bash
   git add releases/ RELEASE_NOTES.md
   git commit -m "docs: Add release notes for v1.24.0+1240007"
   ```

### When Backfilling Missing Releases

If you have multiple undocumented tags:

1. **Run the generator**:
   ```bash
   ./scripts/generate-release-notes.sh
   ```

2. **Review all generated files** in `releases/`

3. **Commit all at once**:
   ```bash
   git add releases/
   git commit -m "docs: Backfill missing release notes"
   ```

## Directory Structure

```
.
├── .cursor/
│   └── commands/
│       └── generate-changelog.md    # AI workflow guide
├── releases/                         # Individual release notes
│   ├── v1.24.0+1240000.md
│   ├── v1.24.0+1240001.md
│   └── ...
├── scripts/
│   ├── generate-release-notes.sh    # Automated generator
│   └── update-release-notes.sh      # Legacy updater
├── RELEASE_NOTES.md                 # Latest version only
└── docs/
    └── RELEASE_NOTES_GUIDE.md       # This file
```

## Best Practices

1. **Always tag releases** before generating notes
2. **Run the script** after creating new tags
3. **Review generated content** before committing
4. **Keep commit messages clear** - they become your release notes
5. **Use conventional commits** (feat:, fix:, chore:, etc.)
6. **Don't edit generated files manually** - regenerate if needed

## Troubleshooting

### No tags found
```bash
# Check if tags exist
git tag --list

# Fetch tags from remote
git fetch --tags
```

### Wrong commit range
The script uses `git describe` to find the previous tag. If this fails:
- Ensure tags are properly ordered
- Check tag naming convention
- Manually specify range if needed

### Missing commits
If commits are missing from release notes:
- Check if they're between the correct tags
- Verify the tag was created at the right commit
- Use `git log <prev-tag>..<current-tag>` to verify

## Examples

### Generate all missing release notes
```bash
./scripts/generate-release-notes.sh
```

### Check what would be generated (dry run)
```bash
# List undocumented tags
comm -23 \
  <(git tag --list --sort=v:refname) \
  <(ls -1 releases/ | sed 's/\.md$//' | sort -V)
```

### Generate notes for specific tag range
```bash
# Get commits between two tags
git log v1.23.0+1230000..v1.24.0+1240000 \
  --pretty=format:"- %s" \
  --reverse
```

## Notes

- Backups are created with `.backup` extension
- The latest tag is always used for `RELEASE_NOTES.md`
- Commits are sorted chronologically (oldest to newest)
- Release notes focus on human-readable commit messages
