#!/bin/bash

# Automated Shopify Admin API Setup Helper
# This script helps automate what's possible and guides you through the rest

echo "🚀 Shopify Admin API Auto-Setup"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if .env.local exists
ENV_FILE=".env.local"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}📝 Creating .env.local file...${NC}"
    touch "$ENV_FILE"
    echo "# Shopify Configuration" >> "$ENV_FILE"
    echo "SHOPIFY_STORE_DOMAIN=27ut15-e9.myshopify.com" >> "$ENV_FILE"
    echo "" >> "$ENV_FILE"
    echo "# Storefront API (already configured)" >> "$ENV_FILE"
    if grep -q "SHOPIFY_STOREFRONT_ACCESS_TOKEN=" "$ENV_FILE" 2>/dev/null; then
        echo "# SHOPIFY_STOREFRONT_ACCESS_TOKEN already exists" >> "$ENV_FILE"
    fi
    echo "" >> "$ENV_FILE"
    echo "# Admin API (for email subscriptions)" >> "$ENV_FILE"
    echo "# Add your token here after getting it from Shopify:" >> "$ENV_FILE"
    echo "# SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_your_token_here" >> "$ENV_FILE"
    echo -e "${GREEN}✅ Created .env.local${NC}"
    echo ""
fi

# Check current status
echo "📋 Current Status:"
echo ""

if grep -q "SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_" "$ENV_FILE" 2>/dev/null; then
    TOKEN=$(grep "SHOPIFY_ADMIN_ACCESS_TOKEN=" "$ENV_FILE" | cut -d '=' -f2)
    if [ ! -z "$TOKEN" ] && [ "$TOKEN" != "shpat_your_token_here" ]; then
        echo -e "${GREEN}✅ SHOPIFY_ADMIN_ACCESS_TOKEN is configured${NC}"
        TOKEN_PREVIEW="${TOKEN:0:25}..."
        echo "   Token: $TOKEN_PREVIEW"
        echo ""
        echo "🧪 To test: npm run verify-shopify"
        echo "   Or visit: http://localhost:3000/en/admin/test-shopify"
        exit 0
    fi
fi

echo -e "${YELLOW}⚠️  SHOPIFY_ADMIN_ACCESS_TOKEN not configured yet${NC}"
echo ""

# Open Shopify Admin in browser
echo -e "${BLUE}🌐 Opening Shopify Admin in your browser...${NC}"
echo ""

SHOPIFY_URL="https://27ut15-e9.myshopify.com/admin/settings/apps"

# Try to open in browser (works on macOS, Linux, Windows)
if command -v open > /dev/null; then
    # macOS
    open "$SHOPIFY_URL"
elif command -v xdg-open > /dev/null; then
    # Linux
    xdg-open "$SHOPIFY_URL"
elif command -v start > /dev/null; then
    # Windows
    start "$SHOPIFY_URL"
else
    echo "Please open this URL manually:"
    echo "$SHOPIFY_URL"
fi

echo ""
echo "📖 Follow these steps:"
echo "====================="
echo ""
echo "1. ✅ Browser should open to Shopify Admin"
echo "2. Click 'Develop apps' → 'Create an app'"
echo "3. Name: 'Email Marketing Integration'"
echo "4. Click 'Configure Admin API scopes'"
echo "5. Check: ✅ read_customers"
echo "6. Check: ✅ write_customers"
echo "7. Click 'Save'"
echo "8. Click 'Install app' (top right)"
echo "9. Click 'API credentials' tab"
echo "10. Click 'Reveal token once' under Admin API access token"
echo "11. Copy the token (starts with shpat_)"
echo ""
echo -e "${YELLOW}⏸️  PAUSE HERE - Copy your token${NC}"
echo ""
read -p "Press Enter after you've copied the token..."
echo ""

# Get token from user
echo -e "${BLUE}📝 Paste your Admin API token:${NC}"
echo "(It should start with 'shpat_')"
read -p "Token: " USER_TOKEN

if [ -z "$USER_TOKEN" ]; then
    echo -e "${YELLOW}⚠️  No token entered. You can add it manually later.${NC}"
    echo "Add this line to .env.local:"
    echo "SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_your_token_here"
    exit 1
fi

# Validate token format
if [[ ! "$USER_TOKEN" =~ ^shpat_ ]]; then
    echo -e "${YELLOW}⚠️  Token should start with 'shpat_'. Adding anyway...${NC}"
fi

# Add token to .env.local
echo ""
echo -e "${BLUE}💾 Adding token to .env.local...${NC}"

# Remove old token line if exists
sed -i.bak '/^SHOPIFY_ADMIN_ACCESS_TOKEN=/d' "$ENV_FILE" 2>/dev/null || \
sed -i '/^SHOPIFY_ADMIN_ACCESS_TOKEN=/d' "$ENV_FILE" 2>/dev/null

# Add new token
echo "SHOPIFY_ADMIN_ACCESS_TOKEN=$USER_TOKEN" >> "$ENV_FILE"

# Clean up backup file
rm -f "$ENV_FILE.bak" 2>/dev/null

echo -e "${GREEN}✅ Token added to .env.local${NC}"
echo ""

# Verify
echo "🔍 Verifying setup..."
echo ""

if grep -q "SHOPIFY_ADMIN_ACCESS_TOKEN=$USER_TOKEN" "$ENV_FILE"; then
    echo -e "${GREEN}✅ Setup complete!${NC}"
    echo ""
    echo "📋 Next steps:"
    echo "1. Restart your dev server: npm run dev"
    echo "2. Test connection: npm run verify-shopify"
    echo "3. Or visit: http://localhost:3000/en/admin/test-shopify"
    echo ""
    echo -e "${GREEN}🎉 You're all set!${NC}"
else
    echo -e "${YELLOW}⚠️  Could not verify token was added. Please check .env.local manually.${NC}"
fi
