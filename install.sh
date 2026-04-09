#!/bin/bash

# install.sh — copies skills to ~/.claude/commands/
# Run from the claude-docs repo root
#
# SAFE: only copies files that exist in ./skills/
# Does NOT delete or modify any other files in ~/.claude/commands/

SKILLS_DIR="$(dirname "$0")/skills"
COMMANDS_DIR="$HOME/.claude/commands"

mkdir -p "$COMMANDS_DIR"
mkdir -p "$COMMANDS_DIR/internal"

echo "Installing Claude Code skills to $COMMANDS_DIR..."
echo ""

# User-facing skills
for skill in "$SKILLS_DIR"/*.md; do
  [ -f "$skill" ] || continue
  filename=$(basename "$skill")
  cp "$skill" "$COMMANDS_DIR/$filename"
  echo "  ✓ /$(basename "$filename" .md)"
done

# Internal helper skills (namespaced as /internal:name)
echo ""
echo "  Internal:"
for skill in "$SKILLS_DIR/internal"/*.md; do
  [ -f "$skill" ] || continue
  filename=$(basename "$skill")
  cp "$skill" "$COMMANDS_DIR/internal/$filename"
  echo "  ✓ /internal:$(basename "$filename" .md)"
done

echo ""
echo "Done. Restart Claude Code for changes to take effect."
