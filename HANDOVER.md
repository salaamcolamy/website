# Salaam Cola Website - Handover Document

## Project Overview

A modern e-commerce website for Salaam Cola Malaysia built with Next.js 15, featuring glassmorphism 2025 UI/UX design, multi-language support, and Shopify integration.

**Live Branch:** `feature/home-landing-page`
**Main Branch:** `main` (initial commit only)

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.5.7 | React framework with App Router |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling with custom glassmorphism theme |
| Framer Motion | 11.x | Animations (scroll, parallax, transitions) |
| next-intl | 3.x | Internationalization (EN, MS, AR + RTL) |
| Lenis | 1.x | Smooth scrolling |
| Lucide React | 0.468.x | Icons |
| Shopify Storefront API | - | E-commerce (headless) |

---

## Project Structure

```
salaamcola/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── layout.tsx        # Locale layout (RTL/LTR)
│   │   │   ├── shop/
│   │   │   │   ├── page.tsx      # Shop catalog
│   │   │   │   └── [handle]/     # Product detail
│   │   │   ├── about/page.tsx
│   │   │   └── contact/page.tsx
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                   # Reusable glass components
│   │   │   ├── GlassCard.tsx
│   │   │   ├── GlassButton.tsx
│   │   │   └── GlassInput.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   ├── SmoothScroll.tsx
│   │   │   └── PageTransition.tsx
│   │   ├── sections/             # Homepage sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── CustomerReviews.tsx
│   │   │   ├── ProductLineup.tsx
│   │   │   ├── TasteIsEverything.tsx
│   │   │   ├── ChangeStartsSmall.tsx
│   │   │   ├── TradeEnquiries.tsx
│   │   │   └── Newsletter.tsx
│   │   └── shop/
│   │       ├── ProductCard.tsx
│   │       └── CartDrawer.tsx
│   ├── lib/
│   │   ├── animations.ts         # Framer Motion variants
│   │   ├── utils.ts              # cn() utility
│   │   └── shopify/
│   │       ├── client.ts         # Shopify API client
│   │       ├── types.ts
│   │       └── queries/
│   │           ├── products.ts   # Product queries + mock data
│   │           └── cart.ts       # Cart mutations
│   ├── context/
│   │   └── CartContext.tsx       # Global cart state
│   ├── i18n/
│   │   ├── config.ts
│   │   ├── request.ts
│   │   └── routing.ts
│   └── messages/
│       ├── en.json
│       ├── ms.json
│       └── ar.json
├── tailwind.config.ts            # Custom glass theme
├── next.config.ts                # i18n + image domains
├── middleware.ts                 # Locale routing
├── IMAGE_REQUIREMENTS.md         # Image checklist
└── HANDOVER.md                   # This file
```

---

## Current Status

### Completed
- [x] Project setup with Next.js 15 + TypeScript
- [x] Glassmorphism design system (GlassCard, GlassButton, GlassInput)
- [x] Multi-language support (EN, MS, AR with RTL)
- [x] Homepage with all sections matching mockup
- [x] Shop page with product grid
- [x] Product detail page
- [x] About page
- [x] Contact page with form
- [x] Cart drawer (slide-out panel)
- [x] Smooth scroll + page transitions
- [x] Responsive design
- [x] Shopify integration with mock data fallback

### Pending / TODO
- [ ] Replace Unsplash placeholder images with real product images
- [ ] Connect real Shopify store (add env variables)
- [ ] Implement actual newsletter subscription
- [ ] Add SEO meta tags and OG images
- [ ] Add favicon and apple touch icon
- [ ] Privacy Policy page
- [ ] Terms of Service page
- [ ] 404 page styling
- [ ] Performance optimization (lazy loading, image optimization)
- [ ] Analytics integration (GA4, etc.)
- [ ] Deploy to Vercel/production

---

## How to Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Access at: `http://localhost:3000/en` (or `/ms`, `/ar`)

---

## Shopify Integration

### Current State
- Using **mock data** (Shopify not connected)
- Mock products defined in `src/lib/shopify/queries/products.ts`
- Cart functionality works with mock data

### To Connect Real Shopify Store

1. Create `.env.local` file:
```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token
```

2. Get Storefront API token from Shopify Admin:
   - Settings > Apps and sales channels > Develop apps
   - Create app > Configure Storefront API scopes
   - Install app > Get Storefront access token

3. The code will automatically use real data when env vars are set (see `isShopifyConfigured()` in `client.ts`)

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/app/[locale]/page.tsx` | Homepage - imports all sections |
| `src/components/sections/*.tsx` | Individual homepage sections |
| `src/lib/shopify/queries/products.ts` | Mock products + Shopify queries |
| `src/messages/*.json` | Translation strings |
| `tailwind.config.ts` | Custom colors, glass effects |
| `IMAGE_REQUIREMENTS.md` | List of images to prepare |

---

## Design System

### Colors (defined in tailwind.config.ts)
```
salaam-red-500: #E53935 (primary brand color)
salaam-red-600: #D32F2F (hover state)
```

### Glass Effects
```css
/* Light glass card */
bg-white/10 backdrop-blur-lg border border-white/20

/* Dark glass card */
bg-black/20 backdrop-blur-lg border border-white/10
```

### Animation Variants (src/lib/animations.ts)
- `fadeInUp` - Elements fade in from below
- `fadeInLeft` / `fadeInRight` - Horizontal reveals
- `staggerContainer` - Parent for staggered children
- `scaleIn` - Scale up on reveal

---

## Images

All images currently use Unsplash placeholders. See `IMAGE_REQUIREMENTS.md` for full list of ~20 images needed.

### Priority Images (Homepage)
1. Hero can (PNG, transparent) - 600x800px
2. Product pack images (4) - 600x400px
3. Single can images (3, PNG) - 400x500px
4. Customer avatars (3) - 100x100px
5. Section backgrounds (taste, change)

### To Replace Images
Update the `src` URLs in these files:
- `src/components/sections/HeroSection.tsx`
- `src/components/sections/ProductLineup.tsx`
- `src/components/sections/CustomerReviews.tsx`
- `src/components/sections/TasteIsEverything.tsx`
- `src/components/sections/ChangeStartsSmall.tsx`
- `src/components/sections/TradeEnquiries.tsx`
- `src/components/sections/Newsletter.tsx`
- `src/lib/shopify/queries/products.ts` (mock products)

---

## Git Workflow

```bash
# Current branch
git branch
# * feature/home-landing-page

# To commit changes
git add -A
git commit -m "Your message"

# To push
git push origin feature/home-landing-page

# To merge to main (when ready)
git checkout main
git merge feature/home-landing-page
git push origin main
```

---

## Common Tasks

### Add a new translation key
1. Add key to `src/messages/en.json`
2. Add translations to `ms.json` and `ar.json`
3. Use in component: `const t = useTranslations('sectionName')`

### Add a new page
1. Create `src/app/[locale]/your-page/page.tsx`
2. Add translations if needed
3. Link using `<Link href="/your-page">`

### Modify homepage section order
Edit `src/app/[locale]/page.tsx` - sections render in import order

### Add new image domain
Update `next.config.ts` > `images.remotePatterns`

---

## Contacts

- **Project:** Salaam Cola Malaysia Website Redesign
- **Design Reference:** `landing.png` in project root
- **Original Mockup:** `salam.png` in project root

---

## Quick Commands for Claude Code

```
# Continue development
"Review the current homepage and suggest improvements"

# Add missing features
"Implement the Privacy Policy page with glassmorphism design"

# Replace images
"Replace all Unsplash placeholder images with the images in /public/images/"

# Connect Shopify
"Connect the real Shopify store using the environment variables"

# Deploy
"Prepare the project for Vercel deployment"
```

---

*Last updated: December 2024*
*Handover prepared by: Claude Code*
