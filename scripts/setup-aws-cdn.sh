#!/bin/bash

# AWS CDN Setup Script for Keypad Backgrounds
# 
# This script automates the setup of S3 + CloudFront infrastructure
# Based on: docs/cdn-quickstart.md

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REGION=${AWS_REGION:-us-east-1}
BUCKET=${AWS_BUCKET:-portfolio26-keypad-backgrounds}
PROFILE=${AWS_PROFILE:-cdn-uploader}

# Print functions
info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

success() {
  echo -e "${GREEN}✅ $1${NC}"
}

warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
  echo -e "${RED}❌ $1${NC}"
  exit 1
}

step() {
  echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Banner
echo -e "${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════╗
║   AWS CDN Setup for Keypad Backgrounds   ║
║        S3 + CloudFront + OAC              ║
╚═══════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Step 0: Check prerequisites
step "Step 0: Checking Prerequisites"

info "Checking AWS CLI..."
if ! command -v aws &> /dev/null; then
  error "AWS CLI not found. Install with: brew install awscli"
fi
AWS_VERSION=$(aws --version 2>&1 | awk '{print $1}')
success "AWS CLI installed: $AWS_VERSION"

info "Checking AWS profile: $PROFILE"
if ! aws configure list --profile "$PROFILE" &> /dev/null; then
  warning "Profile '$PROFILE' not configured"
  echo ""
  echo "Please configure AWS credentials:"
  echo "  aws configure --profile $PROFILE"
  echo ""
  read -p "Press Enter after configuring AWS profile..."
fi

# Test AWS credentials
if ! aws sts get-caller-identity --profile "$PROFILE" &> /dev/null; then
  error "Invalid AWS credentials for profile '$PROFILE'"
fi

ACCOUNT_ID=$(aws sts get-caller-identity --profile "$PROFILE" --query 'Account' --output text)
success "AWS credentials valid (Account: $ACCOUNT_ID)"

echo ""
info "Configuration:"
echo "  Region: $REGION"
echo "  Bucket: $BUCKET"
echo "  Profile: $PROFILE"
echo ""

read -p "Continue with setup? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  warning "Setup cancelled"
  exit 0
fi

# Step 1: Create S3 Bucket
step "Step 1: Creating S3 Bucket"

info "Checking if bucket exists..."
if aws s3 ls "s3://$BUCKET" --profile "$PROFILE" &> /dev/null; then
  warning "Bucket '$BUCKET' already exists, skipping creation"
else
  info "Creating bucket: $BUCKET"
  if [ "$REGION" == "us-east-1" ]; then
    # us-east-1 doesn't need LocationConstraint
    aws s3api create-bucket \
      --bucket "$BUCKET" \
      --region "$REGION" \
      --profile "$PROFILE"
  else
    aws s3api create-bucket \
      --bucket "$BUCKET" \
      --region "$REGION" \
      --create-bucket-configuration LocationConstraint="$REGION" \
      --profile "$PROFILE"
  fi
  success "Bucket created: $BUCKET"
fi

# Step 2: Block public access
step "Step 2: Configuring Bucket Security"

info "Blocking public access..."
aws s3api put-public-access-block \
  --bucket "$BUCKET" \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true \
  --profile "$PROFILE"
success "Public access blocked"

# Step 3: Configure CORS
step "Step 3: Configuring CORS"

info "Setting up CORS policy..."
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
  --profile "$PROFILE"
success "CORS configured"

# Step 4: Create Origin Access Control (OAC)
step "Step 4: Creating CloudFront Origin Access Control"

info "Creating OAC..."
OAC_NAME="s3-oac-$BUCKET"

# Check if OAC already exists
EXISTING_OAC=$(aws cloudfront list-origin-access-controls \
  --query "OriginAccessControlList.Items[?Name=='$OAC_NAME'].Id" \
  --output text 2>/dev/null || echo "")

if [ -n "$EXISTING_OAC" ]; then
  OAC_ID="$EXISTING_OAC"
  warning "OAC already exists, using: $OAC_ID"
else
  OAC_ID=$(aws cloudfront create-origin-access-control \
    --origin-access-control-config '{
      "Name": "'$OAC_NAME'",
      "Description": "OAC for keypad backgrounds bucket",
      "SigningProtocol": "sigv4",
      "SigningBehavior": "always",
      "OriginAccessControlOriginType": "s3"
    }' \
    --query 'OriginAccessControl.Id' \
    --output text)
  success "OAC created: $OAC_ID"
fi

# Step 5: Create CloudFront Distribution
step "Step 5: Creating CloudFront Distribution"

info "Preparing distribution configuration..."
ORIGIN_DOMAIN="$BUCKET.s3.$REGION.amazonaws.com"
CALLER_REF="keypad-bg-$(date +%s)"

cat > /tmp/cf-config.json <<EOF
{
  "CallerReference": "$CALLER_REF",
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

info "Creating CloudFront distribution (this may take a moment)..."
DIST_RESPONSE=$(aws cloudfront create-distribution \
  --distribution-config file:///tmp/cf-config.json \
  --output json)

DIST_ID=$(echo "$DIST_RESPONSE" | jq -r '.Distribution.Id')
CF_DOMAIN=$(echo "$DIST_RESPONSE" | jq -r '.Distribution.DomainName')

rm /tmp/cf-config.json

success "CloudFront distribution created!"
echo "  Distribution ID: $DIST_ID"
echo "  Domain: $CF_DOMAIN"

# Step 6: Update S3 Bucket Policy for OAC
step "Step 6: Updating S3 Bucket Policy"

info "Creating bucket policy for CloudFront access..."
cat > /tmp/bucket-policy.json <<EOF
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

info "Applying bucket policy..."
aws s3api put-bucket-policy \
  --bucket "$BUCKET" \
  --policy file:///tmp/bucket-policy.json \
  --profile "$PROFILE"

rm /tmp/bucket-policy.json
success "Bucket policy updated"

# Step 7: Save configuration
step "Step 7: Saving Configuration"

info "Saving to .env.local..."
cat > .env.local <<EOF
# AWS CDN Configuration
# Generated: $(date)

DIST_ID=$DIST_ID
CF_DOMAIN=$CF_DOMAIN
VITE_CDN_BASE_URL=https://$CF_DOMAIN/keypad-backgrounds

# AWS Configuration
AWS_REGION=$REGION
AWS_BUCKET=$BUCKET
AWS_PROFILE=$PROFILE
AWS_ACCOUNT_ID=$ACCOUNT_ID
EOF

success "Configuration saved to .env.local"

# Summary
step "Setup Complete! 🎉"

echo -e "${GREEN}CloudFront Distribution Details:${NC}"
echo "  Distribution ID: $DIST_ID"
echo "  Domain: $CF_DOMAIN"
echo "  CDN URL: https://$CF_DOMAIN/keypad-backgrounds"
echo ""
echo -e "${GREEN}S3 Bucket:${NC}"
echo "  Name: $BUCKET"
echo "  Region: $REGION"
echo ""
echo -e "${YELLOW}⏱️  CloudFront is deploying (takes ~10-15 minutes)${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "  1. Generate backgrounds:"
echo "     ${GREEN}npm run generate:backgrounds${NC}"
echo ""
echo "  2. Upload to S3:"
echo "     ${GREEN}npm run cdn:sync${NC}"
echo "     ${GREEN}npm run cdn:sync:manifest${NC}"
echo ""
echo "  3. Configure Heroku:"
echo "     ${GREEN}heroku config:set VITE_CDN_BASE_URL=\"https://$CF_DOMAIN/keypad-backgrounds\"${NC}"
echo ""
echo "  4. Deploy:"
echo "     ${GREEN}git push heroku dev2:main${NC}"
echo ""
echo -e "${BLUE}Verify Setup:${NC}"
echo ""
echo "  Check CloudFront status:"
echo "     ${GREEN}aws cloudfront get-distribution --id $DIST_ID --query 'Distribution.Status'${NC}"
echo ""
echo "  Test CDN (after deployment):"
echo "     ${GREEN}curl -I \"https://$CF_DOMAIN/keypad-backgrounds/manifest.json\"${NC}"
echo ""
echo -e "${GREEN}Configuration saved in .env.local${NC}"
echo ""

