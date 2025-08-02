#!/bin/bash

echo "🎵 Preparing The Vault V1 for Release..."

# Create release directory
mkdir -p release

# Copy the DMG file
cp "target/release/bundle/dmg/The Vault_2.0.0_aarch64.dmg" "release/The_Vault_V1.dmg"

# Create release notes
cat > release/RELEASE_NOTES.md << EOF
# The Vault V1 - Initial Release

## What is The Vault?

The Vault is a revolutionary music player that transforms YouTube into your personal, ad-free music library. Built as a native desktop application, it lets you curate, organize, and play your favorite tracks without interruptions, tracking, or advertisements.

## Features in V1

✅ **Working Features:**
- Add videos by YouTube URL
- Organize by categories (Hip Hop, Rock, Electronic, etc.)
- Private mode for sensitive content
- Save/Load collections
- 40+ visual themes
- Native desktop app (one-click launch)

📝 **Known Limitations:**
- Auto-player popup only works in browser mode
- Delete functionality only works in browser mode
- Workaround: Use browser mode for full features

## Installation

1. Download \`The_Vault_V1.dmg\`
2. Open the DMG file
3. Drag The Vault to Applications
4. Double-click to launch!

## System Requirements

- macOS 10.13 or later
- Apple Silicon (M1/M2) or Intel Mac

## Coming in V2

- Full desktop app functionality
- Music visualizer
- Playlist management
- Offline caching
- And more!

---

**Note**: This is a private release. Please do not distribute publicly.
EOF

echo "✅ Release files prepared in ./release/"
echo ""
echo "Files ready for GitHub release:"
echo "- release/The_Vault_V1.dmg"
echo "- release/RELEASE_NOTES.md"
echo ""
echo "To create the release:"
echo "1. Go to https://github.com/jguida941/vault-player/releases/new"
echo "2. Tag: v1.0.0"
echo "3. Title: The Vault V1 - Initial Release"
echo "4. Attach: The_Vault_V1.dmg"
echo "5. Copy release notes from RELEASE_NOTES.md"
echo "6. Check 'This is a pre-release'"
echo "7. Create release!"