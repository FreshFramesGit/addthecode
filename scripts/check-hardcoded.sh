#!/usr/bin/env bash
# Check for hardcoded content strings in section components.
# Quoted strings that are NOT CSS classes, ARIA labels, HTML attributes, or technical values are violations.
#
# Usage: bash scripts/check-hardcoded.sh

set -euo pipefail

SECTIONS_DIR="astro-app/src/components/sections"
VIOLATIONS=0

echo "Scanning $SECTIONS_DIR for hardcoded content..."
echo ""

# Find quoted strings that look like hardcoded user-visible content
# Exclude: CSS classes, HTML attributes, technical values, import paths, component names
while IFS= read -r match; do
  # Skip common technical patterns
  if echo "$match" | grep -qE '(class=|href=|type=|style=|import |from "|\.astro|\.ts|mailto:|tel:|#|data-|aria-|role=|id=|name=|content=|property=|rel=|src=|alt=|width=|height=|loading=|decoding=|fetchpriority=|sizes=|srcset=)'; then
    continue
  fi
  echo "  VIOLATION: $match"
  VIOLATIONS=$((VIOLATIONS + 1))
done < <(grep -rn '"[A-Z][a-z].*"' "$SECTIONS_DIR" 2>/dev/null || true)

echo ""
if [ "$VIOLATIONS" -eq 0 ]; then
  echo "No hardcoded content violations found."
else
  echo "Found $VIOLATIONS potential hardcoded content violation(s)."
  echo "Review each match — only flag strings that should come from Sanity props."
fi

exit "$VIOLATIONS"
