#!/bin/bash

# Function to increment version
increment_version() {
    local version=$1
    local release_type=$2

    IFS='.' read -ra version_parts <<< "$version"
    major=${version_parts[0]}
    minor=${version_parts[1]}
    patch=${version_parts[2]}

    case $release_type in
        major)
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        minor)
            minor=$((minor + 1))
            patch=0
            ;;
        patch)
            patch=$((patch + 1))
            ;;
        *)
            echo "Invalid release type. Use 'major', 'minor', or 'patch'."
            exit 1
            ;;
    esac

    echo "${major}.${minor}.${patch}"
}

# Check if release type is provided
if [ $# -eq 0 ]; then
    echo "Please specify release type: major, minor, or patch"
    exit 1
fi

RELEASE_TYPE=$1

# Get current version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")

# Increment version
NEW_VERSION=$(increment_version $CURRENT_VERSION $RELEASE_TYPE)

# Update version in package.json
npm version $NEW_VERSION --no-git-tag-version

# Function to update module.json
update_module_json() {
    local file=$1
    TEMP_FILE=$(mktemp)
    sed -e "s|\"version\": \"[^\"]*\"|\"version\": \"$NEW_VERSION\"|" \
        -e "s|\"download\": \"[^\"]*\"|\"download\": \"https://github.com/Tackyshot/foundry_webrtc_dice/releases/download/v$NEW_VERSION/dice-webrtc-module.zip\"|" \
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
gh release create v$NEW_VERSION \
  --title "Dice WebRTC Module v$NEW_VERSION" \
  --notes "Release notes for version $NEW_VERSION" \
  dice-webrtc-module.zip \
  module.json

echo "Release v$NEW_VERSION created and all module.json files updated!"