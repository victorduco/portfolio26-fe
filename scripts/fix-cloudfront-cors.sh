#!/bin/bash
# Fix CloudFront CORS configuration

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Fixing CloudFront CORS Configuration ===${NC}\n"

# Get CloudFront distribution ID from .env.local
if [ ! -f .env.local ]; then
  echo -e "${RED}Error: .env.local not found${NC}"
  exit 1
fi

CF_DOMAIN=$(grep VITE_CDN_BASE_URL .env.local | cut -d'=' -f2 | cut -d'/' -f3)
echo -e "CloudFront Domain: ${YELLOW}$CF_DOMAIN${NC}"

# AWS Profile (from cdn-setup.md)
AWS_PROFILE="cdn-uploader"

# Get distribution ID
echo -e "\nFinding distribution ID..."
DIST_ID=$(aws cloudfront list-distributions \
  --profile "$AWS_PROFILE" \
  --query "DistributionList.Items[?DomainName=='$CF_DOMAIN'].Id" \
  --output text)

if [ -z "$DIST_ID" ]; then
  echo -e "${RED}Error: Distribution not found${NC}"
  exit 1
fi

echo -e "Distribution ID: ${YELLOW}$DIST_ID${NC}"

# Step 1: Create CORS Response Headers Policy
echo -e "\n${GREEN}Step 1: Creating CORS Response Headers Policy${NC}"

POLICY_NAME="keypad-backgrounds-cors-policy"

# Check if policy already exists
EXISTING_POLICY_ID=$(aws cloudfront list-response-headers-policies \
  --profile "$AWS_PROFILE" \
  --query "ResponseHeadersPolicyList.Items[?ResponseHeadersPolicy.ResponseHeadersPolicyConfig.Name=='$POLICY_NAME'].ResponseHeadersPolicy.Id" \
  --output text 2>/dev/null || echo "")

if [ -n "$EXISTING_POLICY_ID" ]; then
  echo -e "${YELLOW}Policy already exists with ID: $EXISTING_POLICY_ID${NC}"
  POLICY_ID="$EXISTING_POLICY_ID"
else
  # Create new policy
  cat > /tmp/cors-policy.json <<EOF
{
  "Name": "$POLICY_NAME",
  "Comment": "CORS policy for keypad backgrounds",
  "CorsConfig": {
    "AccessControlAllowOrigins": {
      "Quantity": 1,
      "Items": ["*"]
    },
    "AccessControlAllowHeaders": {
      "Quantity": 1,
      "Items": ["*"]
    },
    "AccessControlAllowMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"]
    },
    "AccessControlMaxAgeSec": 3000,
    "OriginOverride": true,
    "AccessControlAllowCredentials": false
  }
}
EOF

  POLICY_ID=$(aws cloudfront create-response-headers-policy \
    --profile "$AWS_PROFILE" \
    --response-headers-policy-config file:///tmp/cors-policy.json \
    --query 'ResponseHeadersPolicy.Id' \
    --output text)

  echo -e "${GREEN}Created policy with ID: $POLICY_ID${NC}"
  rm /tmp/cors-policy.json
fi

# Step 2: Get current distribution config
echo -e "\n${GREEN}Step 2: Getting current distribution config${NC}"

aws cloudfront get-distribution-config \
  --profile "$AWS_PROFILE" \
  --id "$DIST_ID" \
  > /tmp/dist-config-full.json

ETAG=$(jq -r '.ETag' /tmp/dist-config-full.json)
echo -e "Current ETag: ${YELLOW}$ETAG${NC}"

# Extract just the config
jq '.DistributionConfig' /tmp/dist-config-full.json > /tmp/dist-config.json

# Step 3: Update config with Response Headers Policy
echo -e "\n${GREEN}Step 3: Adding Response Headers Policy to distribution${NC}"

# Add ResponseHeadersPolicyId to DefaultCacheBehavior
jq ".DefaultCacheBehavior.ResponseHeadersPolicyId = \"$POLICY_ID\"" \
  /tmp/dist-config.json > /tmp/dist-config-updated.json

# Step 4: Update the distribution
echo -e "\n${GREEN}Step 4: Updating CloudFront distribution${NC}"

aws cloudfront update-distribution \
  --profile "$AWS_PROFILE" \
  --id "$DIST_ID" \
  --if-match "$ETAG" \
  --distribution-config file:///tmp/dist-config-updated.json \
  > /dev/null

echo -e "${GREEN}✓ Distribution updated successfully${NC}"

# Cleanup
rm -f /tmp/dist-config-full.json /tmp/dist-config.json /tmp/dist-config-updated.json

echo -e "\n${GREEN}=== CORS Fix Complete ===${NC}"
echo -e "\n${YELLOW}Note: CloudFront changes can take 5-15 minutes to propagate globally${NC}"
echo -e "${YELLOW}Test with: curl -I -H 'Origin: https://www.victorduco.com' https://$CF_DOMAIN/keypad-backgrounds/sharp/1.png${NC}"
echo -e "\nYou should see: ${GREEN}access-control-allow-origin: *${NC}"

