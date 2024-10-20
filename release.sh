#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")"

# Get the version from package.json
VERSION=$(node -p "require('./package.json').version")
# Update version and download URL in both module.json files
update_module_json() {
    local file=$1
    TEMP_FILE=$(mktemp)
    sed -e "s|\"version\": \"[^\"]*\"|\"version\": \"$VERSION\"|" \
        -e "s|\"download\": \"[^\"]*\"|\"download\": \"https://github.com/Tackyshot/foundry_webrtc_dice/releases/download/v$VERSION/dice-webrtc-module.zip\"|" \
        -e "s|\"manifest\": \"[^\"]*\"|\"manifest\": \"https://github.com/Tackyshot/foundry_webrtc_dice/releases/latest/download/module.json\"|" \
        "$file" > "$TEMP_FILE"
    mv "$TEMP_FILE" "$file"
}

# Update both module.json files
update_module_json "module.json"
update_module_json "dice-webrtc-module/module.json"

# Build the project
npm run build

# Update the dist/module.json if it exists
if [ -f "dist/module.json" ]; then
    update_module_json "dist/module.json"
fi

# Package the dist directory
./package.sh

# Create the GitHub release
gh release create v$VERSION \
  --title "Dice WebRTC Module v$VERSION" \
  --notes "Release notes for version $VERSION" \
  dice-webrtc-module.zip \
  module.json