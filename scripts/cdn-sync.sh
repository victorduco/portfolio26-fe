#!/bin/bash
set -e

# CDN Sync Script - Uploads all media types to S3/CloudFront
# Usage: ./scripts/cdn-sync.sh

PROFILE="cdn-uploader"
BUCKET="s3://portfolio26-keypad-backgrounds"
CACHE_IMMUTABLE="public,max-age=31536000,immutable"
CACHE_SHORT="public,max-age=3600"

echo "🚀 Starting full CDN sync..."
echo ""

# 1. Keypad backgrounds
echo "📱 Syncing keypad backgrounds..."
aws s3 sync ./public/keypad-backgrounds "$BUCKET/keypad-backgrounds" \
  --profile "$PROFILE" \
  --delete \
  --content-type image/png \
  --cache-control "$CACHE_IMMUTABLE" \
  --exclude '.glyphs/*' \
  --exclude '.gitkeep'

# 2. Keypad backgrounds manifest
echo "📋 Syncing keypad backgrounds manifest..."
aws s3 cp ./public/keypad-backgrounds/manifest.json "$BUCKET/keypad-backgrounds/manifest.json" \
  --profile "$PROFILE" \
  --content-type application/json \
  --cache-control "$CACHE_SHORT"

# 3. Images
echo "🖼️  Syncing images..."
aws s3 sync ./public/images "$BUCKET/images" \
  --profile "$PROFILE" \
  --delete \
  --cache-control "$CACHE_IMMUTABLE" \
  --exclude '.compressed-images.json'

# 4. Videos
echo "🎥 Syncing videos..."
aws s3 sync ./public/videos "$BUCKET/videos" \
  --profile "$PROFILE" \
  --delete \
  --cache-control "$CACHE_IMMUTABLE"

# 5. Fonts
echo "🔤 Syncing fonts..."
aws s3 sync ./public/fonts "$BUCKET/fonts" \
  --profile "$PROFILE" \
  --delete \
  --cache-control "$CACHE_IMMUTABLE" \
  --exclude '.gitkeep'

# 6. Documents
echo "📄 Syncing documents..."
aws s3 sync ./public/documents "$BUCKET/documents" \
  --profile "$PROFILE" \
  --delete \
  --content-type application/pdf \
  --cache-control "$CACHE_IMMUTABLE" \
  --exclude '.gitkeep'

# 7. Media manifest
echo "📦 Syncing media manifest..."
aws s3 cp ./public/media-manifest.json "$BUCKET/media-manifest.json" \
  --profile "$PROFILE" \
  --content-type application/json \
  --cache-control "$CACHE_SHORT"

echo ""
echo "✅ Full CDN sync completed!"
