# Favicon and Meta Tags Setup

This project includes comprehensive favicon and meta tag configuration for optimal display across all devices and platforms.

## Generated Files

### Favicons
- `favicon-light.svg` - Light theme favicon (black diamond on transparent)
- `favicon-dark.svg` - Dark theme favicon (white diamond on transparent)
- `favicon-16x16.png` - 16x16 PNG favicon
- `favicon-32x32.png` - 32x32 PNG favicon
- `apple-touch-icon.png` - 180x180 PNG for iOS devices
- `safari-pinned-tab.svg` - Monochrome SVG for Safari pinned tabs
- `android-chrome-192x192.png` - 192x192 PNG for Android
- `android-chrome-512x512.png` - 512x512 PNG for Android

### Social Media
- `og-image.png` - 1200x630 Open Graph image for social media sharing
- `og-image.svg` - Source SVG for OG image

### Technical Files
- `site.webmanifest` - PWA manifest file
- `robots.txt` - Search engine crawler instructions (only home page indexed)
- `sitemap.xml` - Site structure for search engines

## Regenerating Favicons

If you need to regenerate the favicon files from SVG sources:

```bash
# Install dependencies (macOS)
brew install librsvg imagemagick

# Run the generation script
./scripts/generate-favicons.sh
```

## Meta Tags

The following meta tags are configured in `index.html`:

- **Primary**: title, description, author
- **Theme Color**: Adaptive for light/dark mode
- **Favicons**: Multiple sizes and formats
- **Open Graph**: Facebook, LinkedIn, Telegram
- **Twitter Card**: Twitter-specific meta tags
- **PWA**: Web app manifest

## Dynamic Meta Tags

Meta tags are dynamically updated on route changes via `src/composables/useMeta.js`:

```javascript
import { useMeta } from '@/composables/useMeta';

// In your component
useMeta('home'); // Updates title, description, OG tags
```

## SEO Configuration

### robots.txt
Only the home page is indexed. All other pages are disallowed:
```
User-agent: *
Allow: /$
Disallow: /
```

### sitemap.xml
Contains only the home page URL for search engines.

## Theme Color

The site supports adaptive theme colors:
- **Dark mode**: `#000000` (black)
- **Light mode**: `#FFFFFF` (white)

This affects the mobile browser's address bar color.

## Design

The favicon features a rounded diamond shape (rotated 45° square with rounded corners):
- **Light theme**: Black diamond on transparent background
- **Dark theme**: White diamond on transparent background

This matches the overall design language of the portfolio.
