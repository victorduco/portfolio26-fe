# Portfolio 2026 - Frontend

Vue 3 portfolio with advanced glass morphism effects and interactive keypad backgrounds.

## Features

- 🎨 Advanced glass morphism effects
- ⌨️ Interactive keypad with dynamic backgrounds (11,110 pre-rendered combinations)
- 🚀 CDN-optimized asset delivery via CloudFront
- 📱 Fully responsive design
- ⚡ Optimized performance with content-hashed assets

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Generate keypad backgrounds (first time only)
npm run generate:backgrounds

# Start dev server
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Keypad Backgrounds

Keypad backgrounds are pre-generated PNG images with content hashes for infinite caching.

### Local Development

```bash
# Generate all backgrounds (~11,110 files)
npm run generate:backgrounds

# Force regenerate
npm run generate:backgrounds:force

# Generate only single digits (for testing)
npm run generate:backgrounds:single
```

Files are saved to `public/keypad-backgrounds/sharp/` and ignored by git.

### CDN Setup (Production)

For production, backgrounds are served from CloudFront CDN:

1. **One-time setup:** Run automated script: `npm run cdn:setup`
   - Or follow manual guides: [docs/cdn-setup.md](./docs/cdn-setup.md) or [docs/cdn-quickstart.md](./docs/cdn-quickstart.md)
2. **Upload backgrounds:** `npm run cdn:sync && npm run cdn:sync:manifest`
3. **Configure Heroku:** `heroku config:set VITE_CDN_BASE_URL=https://[CF_DOMAIN]/keypad-backgrounds`

See [docs/cdn-setup.md](./docs/cdn-setup.md) for complete documentation.

## Environment Variables

Create `.env` file (gitignored):

```bash
# CDN URL (leave empty for local files in dev)
VITE_CDN_BASE_URL=

# Backend API (optional)
VITE_API_URL=http://localhost:3000
```

Example production config:

```bash
VITE_CDN_BASE_URL=https://d1234567890abc.cloudfront.net/keypad-backgrounds
VITE_API_URL=https://api.example.com
```

## Project Structure

```
portfolio26-fe/
├── src/
│   ├── components/       # Vue components
│   │   ├── keypad/      # Keypad component with background system
│   │   └── glass-effect/ # Glass morphism effects
│   ├── utils/           # Utilities
│   │   └── keypadBackgroundLoader.js  # CDN-aware background loader
│   ├── pages/           # Page components
│   └── router/          # Vue Router config
├── public/
│   └── keypad-backgrounds/  # Pre-generated backgrounds (gitignored)
│       ├── sharp/          # PNG images with content hashes
│       └── manifest.json   # Code -> filename mapping
├── scripts/
│   └── generate-fast-optimized.js  # Background generation script
└── docs/                # Documentation
    ├── cdn-setup.md     # Full CDN setup guide
    └── cdn-quickstart.md # Quick start guide
```

## Scripts

### Development

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backgrounds

- `npm run generate:backgrounds` - Generate all backgrounds
- `npm run generate:backgrounds:force` - Force regenerate all
- `npm run generate:backgrounds:single` - Generate single digits only

### CDN

- `npm run cdn:setup` - Automated AWS infrastructure setup
- `npm run cdn:check` - Verify CDN setup
- `npm run cdn:sync` - Upload backgrounds to S3
- `npm run cdn:sync:manifest` - Upload manifest to S3
- `npm run cdn:sync:images` - Upload images to S3
- `npm run cdn:sync:videos` - Upload videos to S3
- `npm run cdn:sync:fonts` - Upload fonts to S3
- `npm run cdn:sync:media` - Upload all media (images, videos, fonts)
- `npm run cdn:sync:all` - Upload everything (backgrounds, media, manifests)

### Testing

- `npm run test:e2e` - Run E2E tests
- `npm run screenshots` - Generate visual screenshots

## Tech Stack

- **Framework:** Vue 3 (Composition API)
- **Build Tool:** Vite
- **Routing:** Vue Router
- **Animations:** motion-v
- **Image Processing:** sharp
- **CDN:** AWS CloudFront + S3
- **Testing:** Playwright

## Performance

- **Background Load (first):** ~20-50ms (CDN) or <1ms (cached)
- **Background Load (repeat):** <1ms (browser cache)
- **Total backgrounds:** 11,110 images (~470MB)
- **Cache strategy:** Content-hashed filenames + immutable cache headers
- **No invalidations needed:** New content = new filename = automatic refresh

## Deployment

### Heroku

```bash
# Set environment variables
heroku config:set VITE_CDN_BASE_URL=https://[CF_DOMAIN]/keypad-backgrounds

# Deploy
git push heroku main
```

### Other Platforms

1. Build: `npm run build`
2. Deploy `dist/` folder to static host
3. Set `VITE_CDN_BASE_URL` environment variable

## Documentation

- [CDN Setup Guide](./docs/cdn-setup.md) - Complete AWS setup
- [Quick Start Guide](./docs/cdn-quickstart.md) - Fast setup
- [Keypad Backgrounds](./docs/KEYPAD_BACKGROUNDS.md) - Background system details
- [Production Setup](./docs/production-setup.md) - Production deployment

## License

Private project - All rights reserved
