# CDN Setup - Complete Summary

**Status:** ✅ Code ready, AWS setup required

---

## What Was Done

### 1. Code Changes ✅

**Generation Script** (`scripts/generate-fast-optimized.js`):

- ✅ Added content hashing to filenames: `1234.a1b2c3d4.png`
- ✅ Generates manifest.json with code→filename mapping
- ✅ Creates 11,110 PNG files with unique hashes

**Background Loader** (`src/utils/keypadBackgroundLoader.js`):

- ✅ CDN support via `VITE_CDN_BASE_URL` env variable
- ✅ Automatic manifest loading
- ✅ Fallback to local files in dev mode
- ✅ Sync and async APIs

**Keypad Component** (`src/components/keypad/Keypad.vue`):

- ✅ Uses `getBackgroundPath()` for CDN-aware URLs
- ✅ Preloads manifest on mount

**Configuration**:

- ✅ `.env.example` - Template for CDN URL
- ✅ `.gitignore` - Excludes PNG files, includes manifest
- ✅ `vite.config.js` - Validates manifest presence
- ✅ `package.json` - CDN sync scripts

**Documentation**:

- ✅ `docs/cdn-setup.md` - Full AWS setup guide
- ✅ `docs/cdn-quickstart.md` - 15-min quick start
- ✅ `docs/deployment-checklist.md` - Step-by-step deployment
- ✅ `README.md` - Updated with CDN info

**Tools**:

- ✅ `scripts/check-cdn-setup.js` - Verification script
- ✅ `npm run cdn:check` - Run verification

---

## What You Need to Do

### One-Time AWS Setup (15 minutes)

Follow **one** of these guides:

- **Quick:** `docs/cdn-quickstart.md` (copy-paste commands)
- **Detailed:** `docs/cdn-setup.md` (explanations included)

**Result:** You'll get:

- S3 bucket: `portfolio26-keypad-backgrounds`
- CloudFront distribution ID
- CloudFront domain: `dXXXXXXXXXX.cloudfront.net`

### Daily Workflow

```bash
# 1. Verify setup
npm run cdn:check

# 2. Generate backgrounds (if not done yet)
npm run generate:backgrounds

# 3. Upload to S3
npm run cdn:sync
npm run cdn:sync:manifest

# 4. Configure Heroku
heroku config:set VITE_CDN_BASE_URL="https://[YOUR_CF_DOMAIN]/keypad-backgrounds"

# 5. Deploy
git push heroku dev2:main
```

---

## Quick Commands Reference

### Local Development

```bash
npm install                      # Install dependencies
npm run generate:backgrounds     # Generate all backgrounds
npm run dev                      # Start dev server
npm run cdn:check                # Verify setup
```

### Production Deployment

```bash
npm run generate:backgrounds:force  # Regenerate with new hashes
npm run cdn:sync                    # Upload backgrounds to S3
npm run cdn:sync:manifest           # Upload manifest
heroku config:set VITE_CDN_BASE_URL="https://xxx.cloudfront.net/keypad-backgrounds"
git push heroku dev2:main
```

### Verification

```bash
# Check what's in S3
aws s3 ls s3://portfolio26-keypad-backgrounds/keypad-backgrounds/sharp/ --profile cdn-uploader | head

# Check CloudFront status
aws cloudfront get-distribution --id [DIST_ID] --query 'Distribution.Status'

# Test CDN URL
curl -I "https://[CF_DOMAIN]/keypad-backgrounds/manifest.json"

# Local setup check
npm run cdn:check
```

---

## Environment Variables

### Development (.env or .env.local)

```bash
# Leave empty to use local files
VITE_CDN_BASE_URL=
```

### Production (Heroku)

```bash
# Set to CloudFront URL
VITE_CDN_BASE_URL=https://dXXXXXXXXXX.cloudfront.net/keypad-backgrounds
```

---

## File Structure

```
portfolio26-fe/
├── public/
│   └── keypad-backgrounds/
│       ├── .gitkeep                 ✅ Committed (keeps dir in git)
│       ├── manifest.json            ✅ Committed (placeholder/updated)
│       └── sharp/                   ❌ Ignored (too large, ~470MB)
│           └── *.png                   Generated locally, served from CDN
│
├── scripts/
│   ├── generate-fast-optimized.js  # Generates backgrounds with hashes
│   └── check-cdn-setup.js          # Verifies setup
│
├── docs/
│   ├── cdn-setup.md                # Full AWS guide
│   ├── cdn-quickstart.md           # Quick setup
│   └── deployment-checklist.md     # Deployment steps
│
└── .env.example                     # Environment template
```

---

## How It Works

### Dev Mode (no CDN)

1. User enters digits: `1234`
2. `getBackgroundPath([1, 2, 3, 4])` called
3. Loads manifest: `/keypad-backgrounds/manifest.json`
4. Returns: `/keypad-backgrounds/sharp/1234.a1b2c3d4.png`
5. Browser loads from local Vite dev server

### Production (with CDN)

1. User enters digits: `1234`
2. `getBackgroundPath([1, 2, 3, 4])` called
3. Manifest cached in memory
4. Returns: `https://xxx.cloudfront.net/keypad-backgrounds/sharp/1234.a1b2c3d4.png`
5. Browser loads from CloudFront → S3
6. Cached forever (immutable + content hash)

### On Background Update

1. Change code → generate → new hash
2. `1234.a1b2c3d4.png` → `1234.f9e8d7c6.png`
3. Upload to S3 → both files exist
4. Deploy → app uses new filename
5. No invalidation needed! (new filename = new cache)

---

## Troubleshooting

**Problem:** `npm run cdn:check` shows warnings

**Solution:**

```bash
# Generate backgrounds
npm run generate:backgrounds

# Check again
npm run cdn:check
```

---

**Problem:** "Failed to load manifest" in browser

**Solution:**

```bash
# Ensure manifest exists
ls -lh public/keypad-backgrounds/manifest.json

# If not, generate backgrounds
npm run generate:backgrounds
```

---

**Problem:** 404 on CloudFront URLs in production

**Solutions:**

1. Check Heroku config: `heroku config:get VITE_CDN_BASE_URL`
2. Verify S3 upload: `aws s3 ls s3://portfolio26-keypad-backgrounds/keypad-backgrounds/sharp/ --profile cdn-uploader | wc -l` (should show ~11,110)
3. Check CloudFront status: `aws cloudfront get-distribution --id [DIST_ID] --query 'Distribution.Status'` (should be "Deployed")
4. Test CDN directly: `curl -I "https://[CF_DOMAIN]/keypad-backgrounds/manifest.json"`

---

**Problem:** AWS CLI not installed

**Solution:**

```bash
# macOS
brew install awscli

# Verify
aws --version

# Configure
aws configure --profile cdn-uploader
```

---

## Cost Breakdown

- **S3 Storage:** ~$0.01/month (470MB)
- **CloudFront Transfer:** ~$0.50-5/month (depends on traffic)
- **CloudFront Requests:** ~$0.01-0.50/month
- **Total:** ~$2-6/month

With good caching (which we have!), costs decrease over time.

---

## Performance

- **First load:** ~20-50ms (CDN network latency)
- **Cached load:** <1ms (browser cache)
- **Cache duration:** Infinite (max-age=31536000 + immutable)
- **Cache hit rate:** >90% (after initial page loads)

---

## Next Steps

1. **Now:** Run `npm run cdn:check` to verify local setup
2. **Next:** Follow `docs/cdn-quickstart.md` to setup AWS (15 min)
3. **Then:** Generate and upload backgrounds
4. **Finally:** Deploy to Heroku

---

## Support Files

- 📖 Full guide: `docs/cdn-setup.md`
- ⚡ Quick start: `docs/cdn-quickstart.md`
- ✅ Checklist: `docs/deployment-checklist.md`
- 🔍 Verify: `npm run cdn:check`

---

**Status:** Ready for AWS setup! 🚀
