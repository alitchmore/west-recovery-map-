#!/usr/bin/env bash
set -euo pipefail

#############################################
# CONFIG – using your actual repos
#############################################

# URL of the Lovable-generated frontend repo
LOVABLE_REPO_URL="https://github.com/alitchmore/west-recovery-hub.git"

# Which branch to pull from in the Lovable repo
LOVABLE_BRANCH="main"

# Local temp folder (inside this repo) where we clone/pull Lovable
TEMP_DIR=".lovable-frontend-tmp"

# Destination folder in this repo
DEST_DIR="frontend"

#############################################
# SCRIPT – probably no need to edit below
#############################################

echo "==> Syncing frontend from Lovable repo"
echo "    Source: $LOVABLE_REPO_URL ($LOVABLE_BRANCH)"
echo "    Temp:   $TEMP_DIR"
echo "    Dest:   $DEST_DIR"
echo

# Ensure temp dir exists and has the repo
if [ ! -d "$TEMP_DIR/.git" ]; then
  echo "==> Cloning Lovable repo into $TEMP_DIR..."
  rm -rf "$TEMP_DIR"
  git clone "$LOVABLE_REPO_URL" "$TEMP_DIR"
else
  echo "==> Updating existing clone in $TEMP_DIR..."
  git -C "$TEMP_DIR" fetch origin
fi

# Checkout desired branch
echo "==> Checking out branch $LOVABLE_BRANCH..."
git -C "$TEMP_DIR" checkout "$LOVABLE_BRANCH"
git -C "$TEMP_DIR" pull origin "$LOVABLE_BRANCH"

# Ensure destination dir exists
mkdir -p "$DEST_DIR"

echo "==> Copying files into $DEST_DIR (via rsync)..."

# Use rsync to mirror files, excluding git + build artifacts
rsync -av --delete \
  --exclude=".git" \
  --exclude="node_modules" \
  --exclude="dist" \
  --exclude=".env" \
  "$TEMP_DIR"/ "$DEST_DIR"/

echo
echo "==> Done. Frontend code synced into $DEST_DIR."
echo "==> Next steps:"
echo "    - Review changes: git status"
echo '    - Commit: git commit -am "chore: sync frontend from Lovable"'
