# Salaam Cola Malaysia — Website Amendments (Dec 2025) — Implementation Spec

## Goal

Apply the following UI/content/UX updates across Homepage, Shop, About Us, Contact, plus 2 new pages: Programs and Join Us.

---

## 0) Global / Sitewide Changes

### 0.1 Website Loader Media

Change loader media to a higher-quality visual similar to the "water splash from t-shirt design".
If possible: keep circular liquid effect but change the liquid color to brown (cola).

**Acceptance Criteria**
- Loader uses new asset (image/video/lottie) with visibly higher quality than current.
- Circular liquid effect is preserved (if feasible) and liquid color appears brown/cola.
- Loader remains optimized (no huge file size; no layout jank).

**Asset Needed**
- New splash image/video (provided by marketing or recreated).

---

### 0.2 Social Icons + Links (standardize)

Add icons and link to Salaam Cola Malaysia accounts:
- Threads
- TikTok
- X (label as X, not Twitter)
- YouTube

**Acceptance Criteria**
- Icons appear in designated sections (homepage + contact page).
- All icons link to the correct Salaam Cola Malaysia profiles (URLs to be provided).

**TODO (need URLs)**
- `THREADS_URL`
- `TIKTOK_URL`
- `X_URL`
- `YOUTUBE_URL`

---

### 0.3 Navigator / Trust Badges Text

Update navigator/badge text to:
- KKM-Approved
- Global Halal Certified

---

## 1) HOMEPAGE Changes

### 1.1 Fix product images mismatch

"Zero Sugar" and "Keffiyeh" photos do not match → replace with correct images.

**Acceptance Criteria**
- Product cards show correct product images on homepage.

---

### 1.2 Discount logic (Homepage)

- Remove discount globally (any sitewide discount display).
- Add discount ONLY for one specified product: 10%.

**Acceptance Criteria**
- No other products show discount.
- Only the specified product shows "10%" discount consistently on homepage (and shop/product pages if applicable).

**TODO (need product ID/handle)**
- `DISCOUNT_PRODUCT_HANDLE`

---

### 1.3 Product click scroll behavior

Currently: clicking a product on homepage jumps user to bottom of the page.
Change so it goes to the top of the product page (or correct product detail section).

**Acceptance Criteria**
- Product click navigates correctly (no unintended anchor to bottom).
- If going to product page: lands at top and product is visible immediately.

---

### 1.4 Homepage "navigator" section copywriting update

Replace the existing copy with:

> In blind taste tests, 98% of participants agreed that Salaam Cola rivals the flavor of the world's leading brands. Crafted to fit perfectly into Malaysia's vibrant food culture and social lifestyle, we are more than just a drink, we are an ethical movement. Join the hype, choose the ethical alternative, and make a difference sip by sip.

---

### 1.5 "Find Salaam Cola" section updates

**Requirements**
- Replace photo(s)
- Change texts
- Add social icons (Threads/TikTok/X/YouTube) with links

---

### 1.6 Change "Support" + Distributor list with logos

Change label/menu item to "Support".

Update distributor list (with logos) to:
1. Eraman
2. VPS Vending
3. Hadramawt
4. Kunafa Bukit Bintang
5. BETAWI
6. Woodfire
7. Ignition Burgers

**Acceptance Criteria**
- Distributor list shows logos (not just plain text).
- Order matches list above (unless you're matching existing layout constraints).

**Assets Needed**
- Logos for each distributor (SVG/PNG).

---

### 1.7 Purpose / "Where Your Sip Goes" copy and CTA

Replace the section copywriting with:

**Paragraph**

> Salaam Cola was founded on the principle of 'Purposeful Consumption.' We connect with the people who think and care deeply about what they consume. Our core value is built on a cycle of kindness, where 10% of profits support global humanitarian causes. We have reshaped a classic favorite into a responsible alternative.

**2 bullets**
1. **Sip with Purpose** — Join the mission for global humanitarian aids
2. **Business** — Distribute Salaam Cola at your premise.

Change the text label to: **Where Your Sip Goes**

Link should go to: Programs/Events new page (see Section 5)

---

### 1.8 Move a section to bottom (before footer)

Move the indicated section (per PDF) to bottom of page before footer.

**Acceptance Criteria**
- Section appears just above footer on homepage.
- Styling remains consistent.

---

### 1.9 Reviews/testimonials language + "verified buyer" to location

- Change testimonials to Malay.
- Replace "verified buyer" with location (example given: "Negeri Sembilan").

**Acceptance Criteria**
- No "verified buyer" text remains; replaced by state/location string.

---

### 1.10 Buttons / CTAs text changes

- Change CTA to "Taste the Impact" → link to Distributor List/Map
- Change CTA to "Shop Now"

---

### 1.11 Replace images + copywriting in sections

"Change photos and copywriting. Replace photo" across homepage sections as indicated in PDF screenshot annotations.

---

### 1.12 "JOIN US" section changes (Homepage)

- Replace that section title to: **JOIN US**
- Change the section content to a TikTok feed embed.

**Acceptance Criteria**
- TikTok feed loads reliably and is responsive.
- If TikTok embed is blocked, show fallback (button linking to TikTok profile).

**TODO**
- `TIKTOK_PROFILE_URL`

---

### 1.13 Header nav: add "Programs" dropdown + "Career"

Add menu item **Programs** with dropdown:
1. **Where Your Sip Goes** → link to new Programs page (events/charity program)
2. **Join Us** → link to new Join Us page (Distributor + Career + contact info)

Also add **Career** link to Join Us page.

---

## 2) SHOP PAGE Changes

### 2.1 Fix product images mismatch

Same issue: "Zero Sugar" & "Keffiyeh" photos mismatch → correct images.

---

### 2.2 Replace shop copywriting (product description block)

Replace with:

> Experience the clean, bold bite of authentic cola. We've layered in hints of earthy herbs and warm spices, finishing with a sharp, zesty citrus twist that keeps every sip fresh. With fine, smooth bubbles that aren't too harsh on the throat, it's a familiar taste, but elevated for a better way to refresh.

---

### 2.3 Add product tabs/sections (from HQ site format)

Below product details add sections:
- Description
- Additional Information
- Review

**Acceptance Criteria**
- Each product page includes these tabs/sections.
- Content can be managed via CMS/admin (preferred) or hardcoded temporarily if no CMS.

---

## 3) ABOUT US Page Changes

### 3.1 Timeline / years

Keep only:
- **2025** — Available in 33 countries
- **2026** — Finally arrives in Malaysia

Remove other years.

---

### 3.2 Replace About Us copywriting with:

> Salaam Cola is leading a new wave in Malaysia. We've combined a premium, craft-style taste with a mission to give back. Founded in the UK, Salaam Cola was born from a simple belief; that what you drink should be as ethical as it is delicious. For the conscious drinker who refuses to settle, we offer a drink that's high in quality and heavy on heart. It's the familiar taste you love, crafted for a world that deserves more.

---

### 3.3 Badges

Show:
- Global Halal Certified
- KKM-Approved
- Certified

---

### 3.4 Change photo

Replace About page main photo as per PDF annotation.

---

## 4) CONTACT Page Changes

### 4.1 Update contact details text

| Field | Value |
|-------|-------|
| Business hours | 9.00am - 5.00pm |
| Email | hello@salaamcolamy.com |
| Company | DUNYA DAMAI SDN BHD (1645635-W) |
| Address | Block B-03-01, No 21, Galeria Hartamas, Jalan 26A/70A Desa Sri Hartamas, 50480 Kuala Lumpur. |

---

### 4.2 Social icons on contact page

Add icons: Threads / TikTok / X / YouTube + link to Salaam Cola Malaysia accounts.

---

### 4.3 Store Locator function (complete it)

"Complete Store Locator function, add the store list to the maps" with locations:
- Eraman (KLIA)
- VPS Vending
- Hadramawt Bukit Bintang
- Kunafa Cripst Bukit Bintang
- BETAWI TTDI
- Woodfire (all)
- Ignition Burgers
- Pedas, Nilai, Seremban, USIM

**Acceptance Criteria**
- Map shows pins for each store.
- Store list is clickable; clicking a store focuses map pin.
- Mobile-friendly (list collapsible, map responsive).

**TODO (need exact addresses/coordinates)**
- For each store: name, address, optional lat/lng.

---

### 4.4 Halal/KKM statement block + store locator link

Add/update to:

> Yes, all of our products are 100% Halal JAKIM certified and KKM-approved.
> You can find our products at our exclusive retail and f&b partners.
> [Click here](#store-locator) (link to store locator)

---

## 5) NEW PAGE: Programs (Where Your Sip Goes)

### 5.1 Page content (use provided copy)

Create new page with sections like:
- WHERE YOUR SIP GOES
- Global Mission
- MALAYSIA: SERVING THE HOME TEAM
- Bullet points (Youth Hangouts / Mosques & Orphanages / Grassroots Giving)
- CTA "Learn More"

**CTA link**
- "Learn More" → https://salaamcola.com/charity/

**Acceptance Criteria**
- Page is reachable from menu: Programs → Where Your Sip Goes.
- Layout matches brand style and is readable on mobile.

---

## 6) NEW PAGE: Join Us (Distributor + Career)

### 6.1 Distribute Salaam Cola section (copy provided)

Implement "Distribute Salaam Cola" section with the provided paragraph.

Add:
- "Talk to Us" CTA button
- Cards/tiles for Retail / Business / Corporate with captions (as per sample)

---

### 6.2 Build Career With Us section (copy provided)

Implement "Build Career With Us" section with provided paragraph.

Add:
- "Send Your CV" CTA button

---

### 6.3 Add attachment upload for documents

Add a file attachment capability for the form (documents / CV).

**Acceptance Criteria**
- Users can attach files (PDF/DOC/DOCX/PNG/JPG) with size limit.
- Uploaded file is delivered to email/CRM/storage depending on stack.
- Form validates required fields and shows success/error states.

**TODO (need backend decision)**
- Where uploads go: email attachment, cloud storage (S3), or CMS media.

---

### 6.4 Navigation links

Programs dropdown should include Join Us. Career link should point here.

---

## 7) Open Questions / Needed Inputs (blockers)

1. Exact URLs for all social accounts (Threads/TikTok/X/YouTube).
2. Which product gets 10% discount (product handle/ID).
3. Correct images for "Zero Sugar" and "Keffiyeh".
4. Distributor logos (SVG/PNG).
5. Store locator: exact addresses or lat/lng for each store.
6. Tech stack details (WordPress/WooCommerce? Shopify? Custom Next.js?) — affects implementation approach for:
   - Product tabs
   - Store locator map
   - File upload handling

---

## 8) Deliverables (what developer should ship)

- [ ] Updated loader media + styling
- [ ] Homepage fixes + new copy + TikTok feed embed + nav dropdown
- [ ] Shop page copy + product tabs/sections
- [ ] About page copy + timeline cleanup + photo/badges
- [ ] Contact page info update + social icons + store locator map/list
- [ ] New Programs page + linkouts
- [ ] New Join Us page + distributor/career sections + attachment upload
