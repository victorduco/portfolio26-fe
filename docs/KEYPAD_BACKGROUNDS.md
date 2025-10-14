# Keypad Background Generation System

This document describes the pregenerated keypad background system, which significantly improves performance by loading pre-rendered images instead of dynamically generating them at runtime.

## Overview

### Problem
The original implementation used `html-to-image` (toPng) to dynamically generate background images on every digit change. This operation took ~50-200ms per generation, causing noticeable lag during interactions.

### Solution
Pre-generate all 10,000 possible keypad combinations (0000-9999) as PNG images during build time, then load them on demand with aggressive caching.

### Performance Improvement
- **Dynamic (toPng):** ~50-200ms per background generation
- **Pregenerated first load:** ~20-50ms (network)
- **Pregenerated cached load:** <1ms (instant)
- **With prefetching:** <1ms (instant, loaded in advance)

## Architecture

### Components

1. **Generation Script** (`scripts/generate-keypad-backgrounds.js`)
   - Generates all 10,000 combinations using Puppeteer
   - Applies CSS filters (blur, saturation, brightness, contrast)
   - Optimizes images with sharp (avg 47KB per file)
   - Total size: ~470MB for 10,000 images

2. **Loader Utility** (`src/utils/keypadBackgroundLoader.js`)
   - Handles loading and caching of pregenerated images
   - Implements memory cache for instant repeat loads
   - Provides prefetching for next possible digit combinations
   - Tracks statistics (cache hits, misses, failures)

3. **Component Integration** (`src/components/glass-effect/GeBackground.vue`)
   - Detects mode from environment variable
   - Routes to pregenerated or dynamic generation
   - Falls back to toPng if image load fails
   - Maintains all existing profiling infrastructure

## Usage

### Generating Backgrounds

```bash
# Generate all 10,000 backgrounds (takes ~30-60 minutes)
npm run generate:backgrounds

# Force regenerate all (even if they exist)
npm run generate:backgrounds:force

# Generate first 100 only (for testing)
npm run generate:backgrounds:test
```

### Configuration

Set the environment variable in `.env`:

```bash
# Enable pregenerated mode (production)
VITE_USE_PREGENERATED_BACKGROUNDS=true

# Disable pregenerated mode (development/testing)
VITE_USE_PREGENERATED_BACKGROUNDS=false
```

### Development Workflow

**Option 1: Use dynamic generation (no setup required)**
```bash
# .env
VITE_USE_PREGENERATED_BACKGROUNDS=false

npm run dev
```

**Option 2: Use pregenerated backgrounds (faster, requires generation)**
```bash
# Generate backgrounds first (one-time setup)
npm run generate:backgrounds

# .env
VITE_USE_PREGENERATED_BACKGROUNDS=true

npm run dev
```

### Production Deployment

1. Generate backgrounds before building:
```bash
npm run generate:backgrounds
```

2. Ensure `.env` has pregenerated mode enabled:
```bash
VITE_USE_PREGENERATED_BACKGROUNDS=true
```

3. Build and deploy:
```bash
npm run build
```

## File Structure

```
portfolio26-fe/
├── scripts/
│   └── generate-keypad-backgrounds.js    # Generation script
├── src/
│   ├── utils/
│   │   └── keypadBackgroundLoader.js     # Loader utility
│   └── components/
│       └── glass-effect/
│           └── GeBackground.vue           # Component with dual mode
└── public/
    └── keypad-backgrounds/                # Generated images (gitignored)
        ├── 0000.png
        ├── 0001.png
        ├── ...
        └── 9999.png
```

## Caching Strategy

### Memory Cache
- Images are cached in a `Map` after first load
- Cache persists for the entire session
- Provides instant access on repeat loads

### Prefetching
- After each digit entry, prefetch next 10 possible combinations
- Example: After entering "12", prefetch "120" through "129"
- Uses `requestIdleCallback` to avoid blocking UI

### HTTP Caching
- Dev server: Cache-Control set to 1 year
- Production: Configure CDN/server for long-term caching
- Use service worker for offline support (future enhancement)

## Profiling

Both modes maintain identical profiling output format:

**Pregenerated mode:**
```
⏱️ Keypad [Pregenerated]: Click→Bg 2.1ms | BgGen 1.8ms (imgLoad 1.5 [cached]) | CSS 0.2ms | Filter 45.3ms (...) | Total 47.6ms
```

**Dynamic mode:**
```
⏱️ Keypad [Dynamic]: Click→Bg 5.3ms | BgGen 156.4ms (dom 0.2 + styles 0.1 + delay 0.0 + fonts 0.3 + toPng 155.8) | CSS 0.3ms | Filter 42.8ms (...) | Total 204.8ms
```

## Fallback Behavior

If pregenerated image fails to load:
1. Error is logged to console
2. Component automatically falls back to dynamic generation (toPng)
3. User experience is maintained without breaking

## Statistics & Debugging

Access loader statistics in development:

```javascript
// In browser console
window.__keypadBackgroundLoader.getStats()
// Returns:
// {
//   cacheHits: 15,
//   cacheMisses: 4,
//   networkLoads: 4,
//   failures: 0,
//   cacheSize: 4,
//   hitRate: "78.9%"
// }

// Clear cache (for testing)
window.__keypadBackgroundLoader.clearCache()
```

## Optimization Notes

### Image Optimization
- Size: 2000×2000px @1x pixel ratio
- Format: PNG with palette-based compression
- Quality: 80% with compression level 9
- Average size: ~47KB per image
- Filters applied during generation (not runtime):
  - blur(5) equivalent to CSS blur(10px)
  - saturation: 0.9 (90%)
  - brightness: 0.9 (90%)
  - contrast: 1.0

### Bundle Size
- html-to-image is still needed for fallback
- Tree-shaking should remove it in production if not used
- Consider lazy loading html-to-image if needed

## Trade-offs

### Advantages
- ✅ 95%+ faster for cached loads (<1ms vs ~100ms)
- ✅ Consistent performance (no variance in generation time)
- ✅ Prefetching enables instant transitions
- ✅ Reduced CPU/GPU usage during interactions

### Disadvantages
- ❌ Requires ~470MB storage (10,000 × 47KB)
- ❌ Generation takes 30-60 minutes (one-time)
- ❌ Not suitable for git repository (must regenerate per environment)
- ❌ Initial network load (but cached after first use)

## Future Enhancements

1. **WebP Support**
   - Generate WebP versions (~30-40KB each)
   - Fallback to PNG for unsupported browsers
   - Reduce total size by ~30%

2. **Service Worker**
   - Cache images for offline use
   - Pre-cache first 100 combinations on app load
   - Background sync for remaining images

3. **Lazy Generation**
   - Generate on-demand during first visit
   - Store in IndexedDB for persistence
   - Eliminates build-time generation requirement

4. **CDN Integration**
   - Host images on CDN for faster global access
   - Reduce server load
   - Improve cache hit rates

## Troubleshooting

### Issue: Images not loading
**Solution:** Ensure backgrounds are generated and environment variable is set correctly
```bash
npm run generate:backgrounds
# Check .env has VITE_USE_PREGENERATED_BACKGROUNDS=true
```

### Issue: Build fails with "backgrounds not found"
**Solution:** Run generation before building
```bash
npm run generate:backgrounds && npm run build
```

### Issue: Slow generation speed
**Solution:** Generation is CPU-intensive, expected behavior
- Average: 5-10 images/sec
- Total time: 30-60 minutes for 10,000 images
- Run overnight or use `--count` flag for smaller batches

### Issue: Large file sizes
**Solution:** Files are already optimized
- Average 47KB per file is expected
- Total ~470MB is expected for 10,000 files
- Consider WebP format for further reduction (future)

## References

- [html-to-image documentation](https://github.com/bubkoo/html-to-image)
- [Sharp image processing](https://sharp.pixelplumbing.com/)
- [Puppeteer documentation](https://pptr.dev/)
