#!/bin/bash

# Shopify Admin API Setup Helper Script
# This script helps verify and guide you through the setup process

echo "🔧 Shopify Admin API Setup Helper"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local file not found${NC}"
    echo "Creating .env.local file..."
    touch .env.local
    echo "# Shopify Configuration" >> .env.local
    echo "SHOPIFY_STORE_DOMAIN=27ut15-e9.myshopify.com" >> .env.local
    echo "" >> .env.local
    echo -e "${GREEN}✅ Created .env.local file${NC}"
    echo ""
fi

# Check for existing tokens
echo "📋 Checking current configuration..."
echo ""

if grep -q "SHOPIFY_ADMIN_ACCESS_TOKEN=" .env.local 2>/dev/null; then
    TOKEN=$(grep "SHOPIFY_ADMIN_ACCESS_TOKEN=" .env.local | cut -d '=' -f2)
    if [ -z "$TOKEN" ] || [ "$TOKEN" = "" ]; then
        echo -e "${RED}❌ SHOPIFY_ADMIN_ACCESS_TOKEN is empty${NC}"
        echo ""
        echo "Please add your token to .env.local:"
        echo "SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_your_token_here"
    else
        echo -e "${GREEN}✅ SHOPIFY_ADMIN_ACCESS_TOKEN is set${NC}"
        TOKEN_PREVIEW="${TOKEN:0:20}..."
        echo "   Token preview: $TOKEN_PREVIEW"
    fi
else
    echo -e "${RED}❌ SHOPIFY_ADMIN_ACCESS_TOKEN not found${NC}"
    echo ""
fi

echo ""
echo "📖 Setup Instructions:"
echo "======================"
echo ""
echo "1. Go to: https://27ut15-e9.myshopify.com/admin/settings/apps"
echo "2. Click 'Develop apps' → 'Create an app'"
echo "3. Name it: 'Email Marketing Integration'"
echo "4. Configure scopes: read_customers, write_customers"
echo "5. Install the app"
echo "6. Copy the Admin API access token"
echo "7. Add to .env.local: SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_your_token"
echo ""
echo "📚 Full guide: docs/SHOPIFY-ADMIN-API-STEP-BY-STEP.md"
echo ""
echo "🧪 Test connection: npm run verify-shopify"
echo "   Or visit: http://localhost:3000/en/admin/test-shopify"
echo ""
