# CDN Setup for Keypad Backgrounds

Complete guide for setting up S3 + CloudFront CDN for keypad background images.

## Overview

- **Storage:** AWS S3 bucket
- **CDN:** CloudFront distribution with Origin Access Control (OAC)
- **Caching:** Content-hashed filenames for infinite cache (no invalidations needed)
- **Size:** ~470MB for 11,110 PNG images
- **Region:** us-east-1

---

## One-time Setup (Infrastructure)

### 1. Install AWS CLI v2

```bash
# macOS
brew install awscli

# Verify installation
aws --version
```

### 2. Create IAM User for CI/CD

1. **Create IAM User** in AWS Console:

   - Username: `cdn-uploader`
   - Access type: Programmatic access (Access Key)

2. **Create and attach custom policies:**

**S3 Policy** (replace `YOUR_BUCKET` with actual bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::portfolio26-keypad-backgrounds"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:PutObjectAcl", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::portfolio26-keypad-backgrounds/*"
    }
  ]
}
```

**CloudFront Policy** (optional, only if you need invalidations):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation",
        "cloudfront:ListDistributions"
      ],
      "Resource": "*"
    }
  ]
}
```

3. **Configure AWS CLI profile:**

```bash
aws configure --profile cdn-uploader
# AWS Access Key ID: [paste from IAM console]
# AWS Secret Access Key: [paste from IAM console]
# Default region name: us-east-1
# Default output format: json
```

### 3. Create S3 Bucket

```bash
REGION=us-east-1
BUCKET=portfolio26-keypad-backgrounds

# Create bucket
aws s3api create-bucket \
  --bucket "$BUCKET" \
  --region "$REGION" \
  --profile cdn-uploader

# Enable versioning (optional, for backup)
aws s3api put-bucket-versioning \
  --bucket "$BUCKET" \
  --versioning-configuration Status=Enabled \
  --profile cdn-uploader

# Block public access (we'll serve via CloudFront only)
aws s3api put-public-access-block \
  --bucket "$BUCKET" \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true \
  --profile cdn-uploader
```

### 4. Configure CORS

```bash
aws s3api put-bucket-cors \
  --bucket "$BUCKET" \
  --cors-configuration '{
    "CORSRules": [{
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }]
  }' \
  --profile cdn-uploader
```

### 5. Create CloudFront Distribution with OAC

**Step 5.1: Create Origin Access Control**

```bash
OAC_ID=$(aws cloudfront create-origin-access-control \
  --origin-access-control-config '{
    "Name": "s3-oac-'$BUCKET'",
    "Description": "OAC for keypad backgrounds bucket",
    "SigningProtocol": "sigv4",
    "SigningBehavior": "always",
    "OriginAccessControlOriginType": "s3"
  }' \
  --query 'OriginAccessControl.Id' \
  --output text)

echo "OAC ID: $OAC_ID"
```

**Step 5.2: Create CloudFront Distribution**

```bash
ORIGIN_DOMAIN="$BUCKET.s3.$REGION.amazonaws.com"

# Create distribution config file
cat > cloudfront-config.json <<EOF
{
  "CallerReference": "keypad-bg-$(date +%s)",
  "Comment": "CDN for keypad backgrounds",
  "Enabled": true,
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "s3-origin",
      "DomainName": "$ORIGIN_DOMAIN",
      "S3OriginConfig": {
        "OriginAccessIdentity": ""
      },
      "OriginAccessControlId": "$OAC_ID"
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "s3-origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "Compress": true,
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    }
  },
  "PriceClass": "PriceClass_100"
}
EOF

# Create distribution
DIST_ID=$(aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json \
  --query 'Distribution.Id' \
  --output text)

echo "Distribution ID: $DIST_ID"

# Get CloudFront domain
CF_DOMAIN=$(aws cloudfront get-distribution \
  --id "$DIST_ID" \
  --query 'Distribution.DomainName' \
  --output text)

echo "CloudFront Domain: $CF_DOMAIN"

# Save these for later
echo "DIST_ID=$DIST_ID" >> .env.local
echo "CF_DOMAIN=$CF_DOMAIN" >> .env.local
```

**Step 5.3: Update S3 Bucket Policy for OAC**

```bash
# Get AWS Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)

# Create bucket policy
cat > bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AllowCloudFrontOAC",
    "Effect": "Allow",
    "Principal": {
      "Service": "cloudfront.amazonaws.com"
    },
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::$BUCKET/*",
    "Condition": {
      "StringEquals": {
        "AWS:SourceArn": "arn:aws:cloudfront::$ACCOUNT_ID:distribution/$DIST_ID"
      }
    }
  }]
}
EOF

# Apply bucket policy
aws s3api put-bucket-policy \
  --bucket "$BUCKET" \
  --policy file://bucket-policy.json

# Clean up temp files
rm cloudfront-config.json bucket-policy.json
```

---

## Daily Workflow (Updating Backgrounds)

### 1. Generate Backgrounds Locally

```bash
# Generate all 11,110 backgrounds with content hashes
npm run generate:backgrounds

# Or force regenerate all
npm run generate:backgrounds:force
```

This creates:

- `public/keypad-backgrounds/sharp/*.png` (11,110 files with content hashes)
- `public/keypad-backgrounds/manifest.json` (code -> filename mapping)

### 2. Upload to S3

```bash
# Sync all backgrounds (only uploads new/changed files)
npm run cdn:sync

# Upload manifest separately (shorter cache time)
npm run cdn:sync:manifest
```

**What happens:**

- PNG files: Cache-Control: `public,max-age=31536000,immutable` (1 year)
- Manifest: Cache-Control: `public,max-age=3600` (1 hour)
- Only changed files are uploaded (content hash comparison)
- Old files are deleted (`--delete` flag)

**No invalidation needed!** Content-hashed filenames = new files = automatic cache refresh.

---

## Project Configuration

### 1. Environment Variables

Create `.env` (gitignored) for production:

```bash
# Production CDN URL
VITE_CDN_BASE_URL=https://[YOUR_CF_DOMAIN]/keypad-backgrounds
```

Example:

```
VITE_CDN_BASE_URL=https://d1234567890abc.cloudfront.net/keypad-backgrounds
```

**For development:** Leave empty or don't set it - local files will be used.

### 2. Heroku Configuration

```bash
# Set CDN URL on Heroku
heroku config:set VITE_CDN_BASE_URL="https://$CF_DOMAIN/keypad-backgrounds"

# Verify
heroku config:get VITE_CDN_BASE_URL
```

---

## How It Works

### Code Flow

1. **Generation Script** (`scripts/generate-fast-optimized.js`):

   - Generates PNG with content hash: `1234.a1b2c3d4.png`
   - Creates manifest: `{"1234": "1234.a1b2c3d4.png"}`

2. **Loader** (`src/utils/keypadBackgroundLoader.js`):

   - Loads manifest on app start
   - Builds URLs: `${CDN_BASE_URL}/sharp/${manifest[code]}`
   - Fallback to local files in dev mode

3. **Component** (`src/components/keypad/Keypad.vue`):
   - Calls `getBackgroundPath(digits)` to get URL
   - Sets as CSS custom property
   - Browser caches forever (immutable + content hash)

### Dev vs Production

| Mode            | URL Pattern                                                           | Source                 |
| --------------- | --------------------------------------------------------------------- | ---------------------- |
| Dev             | `/keypad-backgrounds/sharp/1234.abc123.png`                           | Local `public/` folder |
| Prod (no CDN)   | `/keypad-backgrounds/sharp/1234.abc123.png`                           | Heroku static files    |
| Prod (with CDN) | `https://xxx.cloudfront.net/keypad-backgrounds/sharp/1234.abc123.png` | CloudFront → S3        |

---

## Monitoring & Troubleshooting

### Check S3 Contents

```bash
# List all files
aws s3 ls s3://portfolio26-keypad-backgrounds/keypad-backgrounds/ --recursive --profile cdn-uploader

# Count files
aws s3 ls s3://portfolio26-keypad-backgrounds/keypad-backgrounds/sharp/ --recursive --profile cdn-uploader | wc -l

# Check manifest
aws s3 cp s3://portfolio26-keypad-backgrounds/keypad-backgrounds/manifest.json - --profile cdn-uploader | head
```

### Check CloudFront Status

```bash
# Get distribution status
aws cloudfront get-distribution --id $DIST_ID --query 'Distribution.Status'

# List all distributions
aws cloudfront list-distributions --query 'DistributionList.Items[*].[Id,DomainName,Comment]' --output table
```

### Test CDN URL

```bash
# Test image load
curl -I "https://$CF_DOMAIN/keypad-backgrounds/sharp/1234.abc123.png"

# Should return:
# HTTP/2 200
# cache-control: public,max-age=31536000,immutable
# content-type: image/png
```

### Debug in Browser

```javascript
// In browser console (dev mode only)
window.__keypadBackgroundLoader.getStats();
// Shows cache hits, misses, failures

window.__keypadBackgroundLoader.imageCache;
// Shows cached paths
```

---

## Cost Estimation

**S3 Storage:**

- Size: ~470 MB
- Cost: ~$0.01/month (us-east-1 standard)

**CloudFront:**

- PriceClass_100 (North America, Europe)
- Data Transfer: ~$0.085/GB
- Requests: $0.0075 per 10,000 requests
- Estimated: $1-5/month for 1000 daily users

**Total: ~$2-6/month**

---

## Advanced: Optional Invalidations

If you ever need to invalidate (shouldn't be needed with content hashes):

```bash
# Invalidate all backgrounds
aws cloudfront create-invalidation \
  --distribution-id $DIST_ID \
  --paths "/keypad-backgrounds/*" \
  --profile cdn-uploader

# Invalidate only manifest
aws cloudfront create-invalidation \
  --distribution-id $DIST_ID \
  --paths "/keypad-backgrounds/manifest.json" \
  --profile cdn-uploader
```

---

## Cleanup (if needed)

```bash
# Delete CloudFront distribution (must disable first)
aws cloudfront get-distribution-config --id $DIST_ID > dist-config.json
# Edit dist-config.json: set Enabled=false
aws cloudfront update-distribution --id $DIST_ID --if-match [ETag] --distribution-config file://dist-config.json
aws cloudfront delete-distribution --id $DIST_ID --if-match [ETag]

# Empty and delete S3 bucket
aws s3 rm s3://$BUCKET --recursive --profile cdn-uploader
aws s3api delete-bucket --bucket $BUCKET --profile cdn-uploader
```

---

## Summary

✅ **Setup once:** S3 bucket + CloudFront + IAM user  
✅ **Daily workflow:** `npm run generate:backgrounds` → `npm run cdn:sync`  
✅ **No invalidations needed** (content-hashed filenames)  
✅ **Infinite cache** (max-age=1 year + immutable)  
✅ **Dev mode:** Uses local files automatically  
✅ **Cost:** ~$2-6/month

**Next steps:**

1. Run setup commands above
2. Save `DIST_ID` and `CF_DOMAIN`
3. Set `VITE_CDN_BASE_URL` on Heroku
4. Test with `npm run generate:backgrounds` + `npm run cdn:sync`
