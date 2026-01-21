# Salaam Cola Website - Image Requirements

This document lists all images needed for the Salaam Cola Malaysia website. Currently using Unsplash placeholders that should be replaced with actual brand assets.

---

## 1. Hero Section (Red Background)

| Image | File Name | Dimensions | Description |
|-------|-----------|------------|-------------|
| Hero Can | `hero-can.png` | 600x800px | Main floating can with transparent background |

**Specifications:**
- PNG with transparent background for floating effect
- High resolution for retina displays
- Product should have dramatic lighting/shadows
- Single can image, tilted slightly for dynamic look

---

## 2. Product Lineup Section (4 Products)

Product images for the "Refreshing Can Lineup" grid. Recommended size: **600x400px** (landscape for pack shots).

| Product | File Name | Description |
|---------|-----------|-------------|
| Mister Cola Original 24-Pack | `product-original-pack.jpg` | 24-can pack box/tray shot |
| Mister Cola Zero 24-Pack | `product-zero-pack.jpg` | 24-can pack box/tray shot |
| Mister Lemonade 24-Pack | `product-lemonade-pack.jpg` | 24-can pack box/tray shot |
| Variety Pack 24-Can | `product-variety-pack.jpg` | Mixed variety pack shot |

**Specifications:**
- Format: JPG
- Resolution: 600x400px minimum (4:3 ratio)
- Background: Clean studio background or lifestyle setting
- Style: Show the full pack/box clearly

---

## 3. Single Can Product Images

For product detail pages and floating product displays throughout the site.

| Product | File Name | Description |
|---------|-----------|-------------|
| Mister Cola Classic Can | `can-classic.png` | Single can, transparent background |
| Mister Cola Zero Can | `can-zero.png` | Single can, transparent background |
| Mister Lemonade Can | `can-lemonade.png` | Single can, transparent background |

**Specifications:**
- Format: PNG with transparent background
- Resolution: 400x500px minimum
- Style: Clean product shot for floating animations

---

## 4. Customer Reviews Section

| Image | File Name | Dimensions | Description |
|-------|-----------|------------|-------------|
| Customer Avatar 1 | `avatar-1.jpg` | 100x100px | Customer photo (or use initials) |
| Customer Avatar 2 | `avatar-2.jpg` | 100x100px | Customer photo |
| Customer Avatar 3 | `avatar-3.jpg` | 100x100px | Customer photo |

**Specifications:**
- Format: JPG
- Resolution: 100x100px (square, will be cropped to circle)
- Style: Friendly, professional headshots
- Note: Can use stock photos or real customer photos with permission

---

## 5. Taste Is Everything Section

| Image | File Name | Dimensions | Description |
|-------|-----------|------------|-------------|
| Cola Splash | `taste-splash.jpg` | 1200x800px | Cola splash/pour action shot |
| Floating Product | `taste-product.png` | 400x500px | Single can with transparent bg |

**Specifications:**
- Splash image: Dark/moody background, dramatic cola splash
- Product: PNG with transparency for floating effect

---

## 6. Change Starts Small Section

| Image | File Name | Dimensions | Description |
|-------|-----------|------------|-------------|
| Background Splash | `change-bg.jpg` | 800x600px | Cola/ice splash background |
| Featured Can | `change-can.png` | 500x600px | Single can, transparent bg |

**Specifications:**
- Background: Dark, dramatic cola/ice imagery
- Product: Clean cut-out for glass card display

---

## 7. Trade Enquiries Section

| Image | File Name | Dimensions | Description |
|-------|-----------|------------|-------------|
| Product Display | `trade-products.jpg` | 600x600px | Multiple cans/packs arranged |

**Specifications:**
- Format: JPG
- Style: Professional product arrangement showing range

---

## 8. Newsletter Section

| Image | File Name | Dimensions | Description |
|-------|-----------|------------|-------------|
| Newsletter Can | `newsletter-can.png` | 400x500px | Single can, transparent bg |

**Specifications:**
- PNG with transparent background
- Used in the red newsletter section

---

## 9. Favicon & Meta Images

| Image | File Name | Dimensions | Usage |
|-------|-----------|------------|-------|
| Favicon | `favicon.ico` | 32x32px | Browser tab icon |
| Apple Touch Icon | `apple-touch-icon.png` | 180x180px | iOS home screen |
| OG Image | `og-image.jpg` | 1200x630px | Social media sharing |

---

## 10. About Page

| Image | File Name | Dimensions | Description |
|-------|-----------|------------|-------------|
| Team/Brand Photo | `about-hero.jpg` | 1920x600px | Brand story banner |
| Founder Photo | `about-founder.jpg` | 400x400px | Founder/team portrait |

---

## 11. Contact Page

| Image | File Name | Dimensions | Description |
|-------|-----------|------------|-------------|
| Office/Location | `contact-bg.jpg` | 1920x600px | Office or location photo |

---

## File Organization

Place all images in the following structure:

```
public/
├── images/
│   ├── products/
│   │   ├── hero-can.png
│   │   ├── can-classic.png
│   │   ├── can-zero.png
│   │   ├── can-lemonade.png
│   │   ├── product-original-pack.jpg
│   │   ├── product-zero-pack.jpg
│   │   ├── product-lemonade-pack.jpg
│   │   └── product-variety-pack.jpg
│   ├── sections/
│   │   ├── taste-splash.jpg
│   │   ├── taste-product.png
│   │   ├── change-bg.jpg
│   │   ├── change-can.png
│   │   ├── trade-products.jpg
│   │   └── newsletter-can.png
│   ├── avatars/
│   │   ├── avatar-1.jpg
│   │   ├── avatar-2.jpg
│   │   └── avatar-3.jpg
│   ├── pages/
│   │   ├── about-hero.jpg
│   │   ├── about-founder.jpg
│   │   └── contact-bg.jpg
│   └── logo/
│       └── salaam-cola-logo.png
├── favicon.ico
├── apple-touch-icon.png
└── og-image.jpg
```

---

## Image Optimization Tips

1. **Compress all images** before upload using tools like:
   - TinyPNG (https://tinypng.com)
   - Squoosh (https://squoosh.app)

2. **Use WebP format** for better compression (Next.js auto-converts)

3. **Provide 2x resolution** for retina displays when possible

4. **Keep file sizes under:**
   - Product PNG images: < 300KB each
   - Pack/lifestyle JPG images: < 200KB each
   - Background images: < 400KB
   - Avatars: < 50KB each

---

## Summary Checklist

### Priority 1 (Homepage - Must Have)
- [ ] 1 Hero can image (PNG, transparent)
- [ ] 4 Product pack images (JPG)
- [ ] 3 Single can images (PNG, transparent)
- [ ] 3 Customer avatar images
- [ ] 1 Taste splash background
- [ ] 1 Change section background
- [ ] 1 Trade section product display

### Priority 2 (Other Pages)
- [ ] About page hero image
- [ ] About page founder photo
- [ ] Contact page background

### Priority 3 (Meta/Branding)
- [ ] Favicon (32x32)
- [ ] Apple touch icon (180x180)
- [ ] OG image for social sharing (1200x630)
- [ ] Logo (if not already have)

**Total: ~20 images to prepare**

---

## Notes

- All product images currently use Unsplash placeholders
- Replace URLs in component files once real images are ready
- Consider hiring a product photographer for professional can shots
- Splash/action shots can be sourced from stock if needed
