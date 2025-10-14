# Deployment Checklist

Quick checklist for deploying with CDN support.

## Initial Setup (One-time)

### AWS Infrastructure

- [ ] Install AWS CLI: `brew install awscli`
- [ ] Create IAM user `cdn-uploader` with S3 + CloudFront permissions
- [ ] Configure AWS profile: `aws configure --profile cdn-uploader`
- [ ] Create S3 bucket: `portfolio26-keypad-backgrounds`
- [ ] Create CloudFront distribution with OAC
- [ ] Save `DIST_ID` and `CF_DOMAIN` to `.env.local`

**See:** [cdn-setup.md](./cdn-setup.md) or [cdn-quickstart.md](./cdn-quickstart.md)

### Local Development

- [ ] Run `npm install`
- [ ] Generate backgrounds: `npm run generate:backgrounds`
- [ ] Verify manifest: `cat public/keypad-backgrounds/manifest.json | head`
- [ ] Test dev server: `npm run dev`

---

## Before First Production Deploy

### 1. Upload Backgrounds to S3

```bash
# Upload all backgrounds (~470MB)
npm run cdn:sync

# Upload manifest (updated more frequently)
npm run cdn:sync:manifest

# Verify upload
aws s3 ls s3://portfolio26-keypad-backgrounds/keypad-backgrounds/sharp/ --profile cdn-uploader | head
```

### 2. Configure Heroku

```bash
# Set CDN URL (replace with your CloudFront domain)
heroku config:set VITE_CDN_BASE_URL="https://[YOUR_CF_DOMAIN]/keypad-backgrounds"

# Verify
heroku config:get VITE_CDN_BASE_URL
```

### 3. Deploy

```bash
git push heroku dev2:main
```

### 4. Verify in Production

1. Open app in browser
2. Open DevTools → Network tab
3. Trigger keypad background (enter digits)
4. Check PNG request URL - should be CloudFront domain
5. Check response headers - should have `cache-control: public,max-age=31536000,immutable`

**Debug in console:**

```javascript
window.__keypadBackgroundLoader.getStats();
// Should show cache hits/misses
```

---

## Regular Updates (When Changing Backgrounds)

### 1. Update Background Generation

If you change:

- Colors in `COLORS` array
- Digit size/spacing
- Image dimensions
- Any visual styling

Then:

```bash
# Regenerate all with new hashes
npm run generate:backgrounds:force

# Upload to S3 (only new files uploaded)
npm run cdn:sync
npm run cdn:sync:manifest

# Deploy (no code changes needed!)
git push heroku dev2:main
```

**No invalidation needed!** New hashes = new filenames = automatic cache refresh.

### 2. Code-only Updates

If you only change Vue/JS code (not backgrounds):

```bash
# Just deploy
git push heroku dev2:main
```

---

## Troubleshooting

### "Manifest not found" warning in dev

**Problem:** `Failed to load manifest, using fallback naming`

**Solution:**

```bash
# Generate backgrounds locally
npm run generate:backgrounds

# Verify manifest exists
ls -lh public/keypad-backgrounds/manifest.json
```

### "Failed to load image" in production

**Problem:** 404 on CloudFront URLs

**Solutions:**

1. **Check CDN env var:**

   ```bash
   heroku config:get VITE_CDN_BASE_URL
   # Should return: https://xxx.cloudfront.net/keypad-backgrounds
   ```

2. **Verify S3 upload:**

   ```bash
   aws s3 ls s3://portfolio26-keypad-backgrounds/keypad-backgrounds/sharp/ --profile cdn-uploader | wc -l
   # Should show ~11,110 files
   ```

3. **Check CloudFront distribution status:**

   ```bash
   aws cloudfront get-distribution --id [DIST_ID] --query 'Distribution.Status'
   # Should return: "Deployed"
   ```

4. **Test CDN directly:**

   ```bash
   # Get a filename from manifest
   curl "https://[CF_DOMAIN]/keypad-backgrounds/manifest.json" | jq '.["1234"]'

   # Test that file
   curl -I "https://[CF_DOMAIN]/keypad-backgrounds/sharp/[filename]"
   # Should return 200 OK
   ```

### Backgrounds not updating after regeneration

**Problem:** Old backgrounds still show after `npm run generate:backgrounds:force`

**Cause:** Browser cache (shouldn't happen with content hashes, but just in case)

**Solution:**

```bash
# Clear local browser cache
# Or hard refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

# Verify new hashes in manifest
cat public/keypad-backgrounds/manifest.json | grep '"1234"'
# Hash should be different from before
```

### Build fails with "manifest not found"

**Problem:** Production build can't find manifest

**Solution:**

```bash
# Ensure manifest is committed
git add public/keypad-backgrounds/manifest.json
git commit -m "Update manifest"

# Verify it's in git
git ls-files public/keypad-backgrounds/
# Should show: manifest.json and .gitkeep
```

---

## Performance Monitoring

### Check S3 Costs

```bash
# In AWS Console → S3 → Bucket → Metrics
# Or use CLI:
aws s3api list-objects-v2 --bucket portfolio26-keypad-backgrounds --query 'sum(Contents[].Size)' --output text
# Should show ~470,000,000 bytes (470MB)
```

### Check CloudFront Metrics

```bash
# In AWS Console → CloudFront → Distribution → Monitoring
# Check:
# - Requests (should be low with good caching)
# - Data transfer (should decrease over time as browsers cache)
# - Cache hit rate (should be >90% after initial load)
```

### Browser Performance

**Dev console debug:**

```javascript
// Cache statistics
window.__keypadBackgroundLoader.getStats()

// Expected output:
{
  cacheHits: 45,
  cacheMisses: 10,
  networkLoads: 10,
  failures: 0,
  hitRate: "81.8%"
}
```

---

## Rollback Plan

### If CDN has issues

**Option 1: Disable CDN (fallback to Heroku static files)**

```bash
# Unset CDN URL
heroku config:unset VITE_CDN_BASE_URL

# This will use local files from dist/
# NOTE: Backgrounds must be generated before build!
```

**Option 2: Revert to previous S3 version**

```bash
# If versioning enabled (recommended)
aws s3api list-object-versions --bucket portfolio26-keypad-backgrounds --prefix keypad-backgrounds/

# Restore specific version
aws s3api copy-object --bucket portfolio26-keypad-backgrounds --copy-source portfolio26-keypad-backgrounds/keypad-backgrounds/manifest.json?versionId=[VERSION_ID] --key keypad-backgrounds/manifest.json
```

---

## Security Notes

- ✅ S3 bucket is **private** (not publicly accessible)
- ✅ Access only via CloudFront with **OAC** (Origin Access Control)
- ✅ IAM user has **minimal permissions** (S3 upload only)
- ✅ CloudFront uses **HTTPS only** (redirect-to-https)
- ✅ No sensitive data in backgrounds (just PNG images)

**AWS Credentials Security:**

```bash
# Never commit AWS keys!
# Check .gitignore includes:
.env
.env.local
.env.production

# Rotate keys if compromised:
# 1. Create new access key in IAM
# 2. Update local profile: aws configure --profile cdn-uploader
# 3. Test: npm run cdn:sync
# 4. Delete old key in IAM console
```

---

## Summary Workflow

**Initial setup (once):**

1. Setup AWS (15 min)
2. Generate backgrounds (5-10 min)
3. Upload to S3 (5-10 min)
4. Configure Heroku (1 min)
5. Deploy (2 min)

**Regular deploys:**

- Code only: `git push heroku dev2:main` (2 min)
- With backgrounds: `npm run generate:backgrounds:force && npm run cdn:sync && npm run cdn:sync:manifest && git push heroku dev2:main` (10 min)

**Monthly costs:** ~$2-6 (S3 + CloudFront)

**Performance:** <1ms cache hits, ~20-50ms first load, infinite browser cache
