# Video Compression in Build Process

This project now includes automatic video compression during the build process to ensure only optimized videos are deployed to production.

## How it works

1. **Automatic Compression**: Videos are automatically compressed before each build
2. **Direct Replacement**: Original videos are replaced with compressed versions
3. **Quality Preservation**: Uses CRF 18 for near-lossless compression
4. **Web Optimization**: Adds `faststart` flag for better web streaming

## Available Scripts

### Build Commands

```bash
# Standard build with video compression
npm run build

# Build without video compression (for development)
npm run build:no-compress
```

### Video Management Commands

```bash
# Compress videos manually
npm run compress:videos
```

## Compression Settings

- **Video Codec**: H.264 (libx264)
- **Preset**: slow (better compression)
- **CRF**: 18 (near-lossless quality)
- **Audio Codec**: AAC
- **Audio Bitrate**: 128 kbps
- **Web Optimization**: faststart flag enabled

## File Structure

```
src/assets/case-videos/
├── case1.mp4          # Compressed video (used in production)
├── case2.mp4          # Compressed video
├── case3.mp4          # Compressed video
└── ...
```

## Requirements

- **FFmpeg**: Must be installed on the system
  - macOS: `brew install ffmpeg`
  - Ubuntu/Debian: `sudo apt install ffmpeg`
  - Windows: Download from https://ffmpeg.org/

## Benefits

1. **Reduced File Sizes**: Typically 60-80% size reduction
2. **Faster Loading**: Optimized for web streaming
3. **Bandwidth Savings**: Lower hosting costs
4. **Better UX**: Faster video loading for users
5. **Automatic Process**: No manual intervention needed

## Troubleshooting

### FFmpeg Not Found

```
❌ FFmpeg not found. Please install FFmpeg to compress videos.
Install with: brew install ffmpeg (on macOS)
```

**Solution**: Install FFmpeg using your package manager

### Compression Fails

If compression fails for a specific video:

1. Check if the video file is corrupted
2. Verify FFmpeg has proper permissions
3. Check available disk space

## Development Workflow

1. **Add New Videos**: Place MP4 files in `src/assets/case-videos/`
2. **Automatic Compression**: Videos are compressed on next build
3. **Direct Replacement**: Original videos are replaced with compressed versions
4. **Production Ready**: Only compressed videos are deployed

## Notes

- Videos are compressed every time the script runs
- Original videos are replaced with compressed versions
- Compression is skipped if FFmpeg is not available
- The process is irreversible (originals are not preserved)
