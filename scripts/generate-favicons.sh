#!/bin/bash

# Script to generate favicon PNG files from SVG
# Requires: librsvg (install via: brew install librsvg)

cd "$(dirname "$0")/../public"

echo "Generating favicon PNG files..."

# Check if rsvg-convert is available
if ! command -v rsvg-convert &> /dev/null; then
    echo "Error: rsvg-convert not found. Install it with: brew install librsvg"
    exit 1
fi

# Generate light theme favicons (for light backgrounds)
echo "Generating light theme icons..."
rsvg-convert -w 16 -h 16 favicon-light.svg > favicon-16x16.png
rsvg-convert -w 32 -h 32 favicon-light.svg > favicon-32x32.png
rsvg-convert -w 180 -h 180 favicon-light.svg > apple-touch-icon.png
rsvg-convert -w 192 -h 192 favicon-light.svg > android-chrome-192x192.png
rsvg-convert -w 512 -h 512 favicon-light.svg > android-chrome-512x512.png

# Generate OG image (1200x630 for social media)
echo "Generating OG image..."
rsvg-convert -w 1200 -h 630 -b "#FFFFFF" --keep-aspect-ratio favicon-light.svg > og-image.png

# Generate favicon.ico (optional, using ImageMagick if available)
if command -v convert &> /dev/null; then
    echo "Generating favicon.ico..."
    convert favicon-16x16.png favicon-32x32.png favicon.ico
else
    echo "Warning: ImageMagick not found. Skipping favicon.ico generation."
    echo "Install with: brew install imagemagick"
fi

echo "Done! Generated favicon files."
