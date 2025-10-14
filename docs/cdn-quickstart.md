# CDN Quick Start Guide

Fast setup guide for keypad backgrounds CDN. See [cdn-setup.md](./cdn-setup.md) for full documentation.

## Prerequisites

- AWS CLI v2 installed
- AWS account with admin access
- `jq` installed (for parsing JSON): `brew install jq`

## Quick Setup (15 minutes)

### Option A: Automated Setup (Recommended)

Use the automated setup script:

```bash
# Run the setup script
./scripts/setup-aws-cdn.sh

# The script will:
# 1. Check prerequisites
# 2. Create S3 bucket
# 3. Configure CORS and security
# 4. Create CloudFront distribution with OAC
# 5. Update bucket policy
# 6. Save configuration to .env.local
```

### Option B: Manual Setup

### 1. Configure AWS CLI

```bash
# Install AWS CLI (macOS)
brew install awscli

# Configure profile
aws configure --profile cdn-uploader
# Enter your Access Key ID and Secret Access Key
```

### 2. Run Setup Script

```bash
# Set variables
export REGION=us-east-1
export BUCKET=portfolio26-keypad-backgrounds

# Create bucket
aws s3api create-bucket --bucket "$BUCKET" --region "$REGION" --profile cdn-uploader

# Block public access
aws s3api put-public-access-block \
  --bucket "$BUCKET" \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true \
  --profile cdn-uploader

# Configure CORS
aws s3api put-bucket-cors --bucket "$BUCKET" --cors-configuration '{
  "CORSRules": [{
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }]
}' --profile cdn-uploader
```

### 3. Create CloudFront Distribution

```bash
# Create OAC
OAC_ID=$(aws cloudfront create-origin-access-control --origin-access-control-config '{
  "Name": "s3-oac-'$BUCKET'",
  "Description": "OAC for keypad backgrounds",
  "SigningProtocol": "sigv4",
  "SigningBehavior": "always",
  "OriginAccessControlOriginType": "s3"
}' --query 'OriginAccessControl.Id' --output text)

# Create distribution config
cat > /tmp/cf-config.json <<EOF
{
  "CallerReference": "keypad-$(date +%s)",
  "Comment": "Keypad backgrounds CDN",
  "Enabled": true,
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "s3-origin",
      "DomainName": "$BUCKET.s3.$REGION.amazonaws.com",
      "S3OriginConfig": {"OriginAccessIdentity": ""},
      "OriginAccessControlId": "$OAC_ID"
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "s3-origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {"Quantity": 2, "Items": ["GET", "HEAD"], "CachedMethods": {"Quantity": 2, "Items": ["GET", "HEAD"]}},
    "Compress": true,
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
    "TrustedSigners": {"Enabled": false, "Quantity": 0}
  },
  "PriceClass": "PriceClass_100"
}
EOF

# Create distribution
DIST_ID=$(aws cloudfront create-distribution --distribution-config file:///tmp/cf-config.json --query 'Distribution.Id' --output text)
CF_DOMAIN=$(aws cloudfront get-distribution --id "$DIST_ID" --query 'Distribution.DomainName' --output text)

echo "✅ CloudFront Distribution created!"
echo "Distribution ID: $DIST_ID"
echo "Domain: $CF_DOMAIN"
```

### 4. Update S3 Bucket Policy

```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)

cat > /tmp/bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AllowCloudFrontOAC",
    "Effect": "Allow",
    "Principal": {"Service": "cloudfront.amazonaws.com"},
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

aws s3api put-bucket-policy --bucket "$BUCKET" --policy file:///tmp/bucket-policy.json
rm /tmp/cf-config.json /tmp/bucket-policy.json

echo "✅ Bucket policy updated!"
```

### 5. Save Configuration

```bash
# Add to your notes or .env.local (gitignored)
echo "DIST_ID=$DIST_ID" >> .env.local
echo "CF_DOMAIN=$CF_DOMAIN" >> .env.local
echo "VITE_CDN_BASE_URL=https://$CF_DOMAIN/keypad-backgrounds" >> .env.local

cat .env.local
```

## Daily Usage

### Generate and Upload Backgrounds

```bash
# 1. Generate backgrounds locally
npm run generate:backgrounds

# 2. Upload to S3
npm run cdn:sync
npm run cdn:sync:manifest

# That's it! No invalidations needed.
```

### Configure Heroku

```bash
# Set CDN URL on Heroku
heroku config:set VITE_CDN_BASE_URL="https://$CF_DOMAIN/keypad-backgrounds"
```

## Verify Setup

```bash
# Check S3 files
aws s3 ls s3://$BUCKET/keypad-backgrounds/ --recursive --profile cdn-uploader | head

# Check CloudFront status (wait ~15 min for deployment)
aws cloudfront get-distribution --id $DIST_ID --query 'Distribution.Status'

# Test CDN (replace with actual filename from manifest)
curl -I "https://$CF_DOMAIN/keypad-backgrounds/manifest.json"
```

## Troubleshooting

**"Distribution still deploying"**

- Wait 10-15 minutes after creation
- Check status: `aws cloudfront get-distribution --id $DIST_ID --query 'Distribution.Status'`

**"Access Denied" on S3**

- Verify bucket policy is applied
- Check OAC is attached to distribution

**Files not syncing**

- Verify AWS profile: `aws configure list --profile cdn-uploader`
- Check bucket name in `package.json` scripts

## Next Steps

- ✅ Generate backgrounds: `npm run generate:backgrounds`
- ✅ Upload to CDN: `npm run cdn:sync && npm run cdn:sync:manifest`
- ✅ Set Heroku env: `heroku config:set VITE_CDN_BASE_URL=...`
- ✅ Deploy and test!

See [cdn-setup.md](./cdn-setup.md) for complete documentation.
