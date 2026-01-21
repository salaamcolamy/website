# CLAUDE.md - Salaam Cola Codebase Guide

## Project Overview

Salaam Cola Malaysia is a modern Next.js 15 e-commerce website featuring glassmorphism design, multi-language support (EN/MS/AR), and Shopify headless commerce integration. The site showcases premium halal cola products with smooth animations, responsive design, and a cohesive red brand identity.

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x (strict mode) |
| UI Library | React | 19.x |
| Styling | Tailwind CSS | 3.4 |
| Animation | Framer Motion | 11.x |
| Icons | Lucide React | 0.468 |
| i18n | next-intl | 3.20 |
| E-commerce | Shopify Storefront API | 2024-01 |
| Smooth Scroll | Lenis | 1.1 |

## Commands

```bash
npm run dev      # Development server with Turbopack (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (metadata)
│   ├── globals.css               # Global styles + glassmorphism
│   └── [locale]/                 # i18n dynamic segment
│       ├── layout.tsx            # Locale layout (RTL/LTR, fonts)
│       ├── page.tsx              # Homepage (7 sections)
│       ├── about/                # About page
│       ├── contact/              # Contact form + FAQ
│       ├── join-us/              # Partnership/careers
│       ├── programs/             # Mission & programs
│       ├── checkout/             # Cart checkout
│       ├── order-confirmation/   # Post-purchase
│       ├── order-status/         # Order tracking
│       └── shop/
│           ├── page.tsx          # Product catalog
│           └── [handle]/         # Dynamic product pages
│
├── components/
│   ├── ui/                       # Glass design system
│   │   ├── GlassButton.tsx       # Variants: primary, secondary, ghost, outline
│   │   ├── GlassCard.tsx         # Blur effects, glow, hover states
│   │   └── GlassInput.tsx        # Form input with labels
│   ├── layout/                   # Shell components
│   │   ├── Header.tsx            # Nav with dropdowns, mobile menu
│   │   ├── Footer.tsx            # Links + social icons
│   │   ├── SplashScreen.tsx      # Initial loading animation
│   │   ├── PageTransition.tsx    # Route animations
│   │   ├── SmoothScroll.tsx      # Lenis wrapper
│   │   └── LanguageSwitcher.tsx  # Locale selector
│   ├── sections/                 # Homepage sections (15 components)
│   ├── shop/                     # ProductCard, CartDrawer
│   ├── forms/                    # FileUpload
│   └── icons/                    # SocialIcons (Threads, TikTok, X, YouTube)
│
├── lib/
│   ├── animations.ts             # Framer Motion variants
│   ├── utils.ts                  # cn(), formatPrice()
│   └── shopify/
│       ├── client.ts             # GraphQL fetch wrapper
│       ├── types.ts              # Shopify & app types
│       └── queries/
│           ├── products.ts       # Product fetching
│           └── cart.ts           # Cart operations
│
├── context/
│   └── CartContext.tsx           # Cart state (useReducer + localStorage)
│
├── hooks/
│   └── useScrollAnimation.ts     # Scroll-triggered animations
│
├── i18n/
│   ├── config.ts                 # Locale definitions
│   ├── routing.ts                # next-intl routing
│   └── request.ts                # Server-side i18n
│
└── messages/                     # Translation JSON files
    ├── en.json
    ├── ms.json
    └── ar.json

public/
├── images/
│   ├── products/                 # WebP product images
│   ├── hero/                     # Hero section images
│   ├── retailers/                # SVG + PNG retailer logos
│   └── change/                   # Content images
├── fonts/
│   └── quora.otf                 # Custom brand font
├── Header-Logo-White-New.svg     # Brand logo
└── favico.svg                    # Favicon
```

## Architecture Patterns

### Component Patterns
- **Functional components** with hooks throughout
- **'use client'** directive for interactive components
- **Server Components** for pages with metadata generation
- **forwardRef** on UI components for DOM access
- **Composition pattern**: Sections compose GlassCard, GlassButton

### State Management
- **CartContext** (single context): useReducer for cart operations
- **localStorage**: Cart persistence (`salaamcola-cart-id`, `salaamcola-demo-cart`)
- **Component state**: useState for UI toggles, forms

### Data Flow
```
User Interaction
       ↓
CartContext (useReducer)
       ↓
   ┌───┴───┐
Shopify API  OR  localStorage (demo mode)
```

## Styling System

### Glassmorphism Design
The project uses a custom glassmorphism design system:

```css
/* Key glass utilities in globals.css */
.glass          /* Semi-transparent with blur */
.glass-dark     /* Darker variant */
.glass-card     /* Card with glass effect */
.glass-button   /* Button with shimmer */
.glow-red       /* Red glow effect */
```

### Brand Colors (Tailwind)
```
salaam-red-500: #c21316  (primary)
salaam-red-600: #a81012  (hover)
salaam-red-700: #8c0d0f  (active)
```

### Fonts
- **Geist Sans**: Default body text
- **Noto Sans Arabic**: RTL support (weights: 400-700)
- **Quora**: Custom font for headings

### Animation Variants (lib/animations.ts)
```typescript
fadeInUp, fadeInDown, fadeInLeft, fadeInRight
scaleIn, scaleInBounce
staggerContainer, staggerContainerFast
buttonHover, buttonTap, cardHover
floatAnimation, glassReveal
```

## Routing

### URL Pattern
`/[locale]/[path]` - Locale always required

### Pages
| Route | Purpose |
|-------|---------|
| `/en` | Homepage with hero + 7 sections |
| `/en/shop` | Product catalog (grid/list view) |
| `/en/shop/[handle]` | Product detail (original, zero-sugar, keffiyeh) |
| `/en/about` | Company story, values, timeline |
| `/en/contact` | Form, FAQ, store locator |
| `/en/join-us` | Partnership & careers |
| `/en/programs` | Mission & community programs |
| `/en/checkout` | Cart review & payment |
| `/en/order-confirmation` | Post-purchase confirmation |
| `/en/order-status` | Order tracking |

## Shopify Integration

### Configuration
```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
```

### Demo Mode
When Shopify is not configured, the app falls back to:
- 3 hardcoded demo products
- localStorage-based cart
- Simulated checkout flow

### Key Functions
```typescript
// lib/shopify/queries/products.ts
getProducts()      // Fetch all products
getProduct(handle) // Single product
getBestSellers()   // Featured products

// lib/shopify/queries/cart.ts
createCart()       // New cart
addToCart()        // Add item
updateCartLine()   // Update quantity
removeFromCart()   // Remove item
```

## Internationalization

### Supported Locales
- `en` (English) - **Currently active**
- `ms` (Malay) - Configured but disabled
- `ar` (Arabic) - Configured with RTL support

### Usage
```typescript
// Client components
const t = useTranslations('namespace')
t('key')

// Server components
const t = await getTranslations({ locale, namespace: 'shop' })
```

### Message Namespaces
`navigation`, `hero`, `products`, `shop`, `mission`, `footer`

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/app/[locale]/layout.tsx` | Main layout with providers, fonts, RTL |
| `src/context/CartContext.tsx` | Cart state management |
| `src/lib/animations.ts` | All Framer Motion variants |
| `src/lib/utils.ts` | cn() helper, formatPrice() |
| `src/components/ui/*.tsx` | Glass design system components |
| `tailwind.config.ts` | Brand colors, custom utilities |
| `next.config.ts` | Remote image patterns, i18n plugin |
| `middleware.ts` | Locale routing middleware |

## Common Patterns

### Adding a New Section
```typescript
'use client'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { GlassCard } from '@/components/ui/GlassCard'

export function NewSection() {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="section-padding container-padding"
    >
      <motion.div variants={fadeInUp}>
        <GlassCard>Content</GlassCard>
      </motion.div>
    </motion.section>
  )
}
```

### Using Cart
```typescript
import { useCart } from '@/context/CartContext'

function Component() {
  const { cart, addItem, removeItem, isOpen, toggleCart } = useCart()
  // ...
}
```

### Responsive Design
```typescript
// Mobile-first approach
className="text-sm md:text-base lg:text-lg"
className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
className="hidden md:flex"
className="px-4 md:px-6 lg:px-8"
```

## Image Handling

### Local Images
Use WebP format in `/public/images/` with Next.js Image:
```typescript
import Image from 'next/image'
<Image src="/images/products/1111.webp" alt="Product" fill className="object-cover" />
```

### Remote Images (Allowed Domains)
- `cdn.shopify.com`
- `*.myshopify.com`
- `images.unsplash.com`
- `picsum.photos`
- `upload.wikimedia.org`

## Performance Notes

- **Turbopack** enabled for fast dev builds
- **Priority loading** on hero/splash images
- **Lazy loading** on secondary images
- **Smooth scroll** via Lenis (duration: 1s)
- **ISR** with Shopify cache tags for product data
- **prefers-reduced-motion** respected in animations

## Git Workflow

- **Main branch**: `main`
- **Current branch**: `feature/client-amendments`
- PR workflow: Feature branches merged to main

## Known Quirks

1. **Locale detection disabled**: Hardcoded to English in middleware
2. **Demo mode active**: Shopify not configured, uses mock products
3. **Build warnings ignored**: `eslint.ignoreDuringBuilds: true` in next.config
4. **Untracked file**: `ChangeStartsSmall 2.tsx` is a duplicate (can be deleted)

## Development Tips

1. Use `cn()` from `lib/utils.ts` to merge Tailwind classes
2. Animation variants are centralized in `lib/animations.ts` - reuse them
3. Check `isShopifyConfigured()` before assuming real product data
4. Glass components accept className for customization
5. All interactive components need `'use client'` directive
6. Use `section-padding` and `container-padding` utility classes for consistent spacing
