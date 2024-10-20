#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")"

# Remove any existing zip file
rm -f dice-webrtc-module.zip

# Create the zip file directly from the dist directory
cd dist
zip -r ../dice-webrtc-module.zip ./*

# Move back to the project root
cd ..

echo "Package created: dice-webrtc-module.zip"