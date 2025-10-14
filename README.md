# Portfolio 2026 - Frontend

A Vue 3 + Vite application featuring an interactive keypad with glass effect and optimized background generation.

## Features

- **Interactive Keypad**: 4-digit code entry system with animated backgrounds
- **Glass Effect**: Liquid glass visual effects with displacement maps
- **Pregenerated Backgrounds**: Optimized performance with pre-rendered images
- **Responsive Design**: Works on desktop and mobile devices
- **Performance Profiling**: Built-in timing measurements for optimization

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Keypad Background System

This project uses a dual-mode background system:

### Development Mode (Dynamic)
No setup required. Backgrounds are generated on-the-fly using `html-to-image`.

```bash
npm run dev
```

### Production Mode (Pregenerated - Recommended)
Generate backgrounds once for ~95% faster performance:

```bash
# Generate all 10,000 backgrounds (one-time, ~30-60 minutes)
npm run generate:backgrounds

# Set environment variable
# .env
VITE_USE_PREGENERATED_BACKGROUNDS=true

# Start dev server or build
npm run dev
# or
npm run build
```

**Performance comparison:**
- Dynamic: ~50-200ms per background
- Pregenerated (first load): ~20-50ms
- Pregenerated (cached): <1ms

For detailed documentation, see [docs/KEYPAD_BACKGROUNDS.md](docs/KEYPAD_BACKGROUNDS.md)

## Available Scripts

```bash
# Development
npm run dev                          # Start dev server

# Build
npm run build                        # Build for production
npm run preview                      # Preview production build

# Background Generation
npm run generate:backgrounds         # Generate all 10,000 backgrounds
npm run generate:backgrounds:force   # Force regenerate all
npm run generate:backgrounds:test    # Generate first 100 (testing)

# Testing
npm run test:e2e                     # Run E2E tests
npm run test:perf                    # Run performance tests

# Documentation
npm run docs:dev                     # Start VitePress docs server
npm run docs:build                   # Build documentation
```

## Environment Variables

Create a `.env` file (see `.env.example`):

```bash
# API URL for backend
VITE_API_URL=http://localhost:3000

# Background generation mode
VITE_USE_PREGENERATED_BACKGROUNDS=false  # Dev: false, Prod: true
```

## Project Structure

```
portfolio26-fe/
├── src/
│   ├── components/          # Vue components
│   │   ├── keypad/         # Keypad components
│   │   └── glass-effect/   # Glass effect components
│   ├── utils/              # Utility functions
│   └── pages/              # Page components
├── scripts/                # Build and generation scripts
├── public/                 # Static assets
│   └── keypad-backgrounds/ # Generated backgrounds (gitignored)
└── docs/                   # Documentation
```

## Technologies

- **Vue 3**: Progressive JavaScript framework
- **Vite**: Fast build tool and dev server
- **Puppeteer**: Headless browser for image generation
- **Sharp**: High-performance image processing
- **Motion**: Animation library
- **Playwright**: E2E testing

## Learn More

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Keypad Backgrounds System](docs/KEYPAD_BACKGROUNDS.md)
