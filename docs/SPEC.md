# S13 Detailing Studio — Frontend Specification (SDD)

Version 1.0 · 2026-07-14 · Status: **draft, awaiting approval**
Scope: landing page (single page), uk/en, desktop + mobile.

---

## 1. Goals & success criteria

| Goal | Metric |
|---|---|
| Primary conversion | Phone call (`tel:` taps / calls) |
| Secondary conversion | Callback form submissions |
| Visual | Outstanding vs local competitors, dark premium-technical style |
| SEO | Rank for detailing queries in Вінниця |
| Performance | Lighthouse ≥ 90 mobile (Performance, SEO, A11y, Best Practices) |

Non-goals (v1): online booking, blog content, payment, CMS.

## 2. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSG/SSR hybrid; static generation preferred — page is fully static |
| Language | TypeScript, strict | |
| Styling | CSS Modules + global design tokens (CSS custom properties) | No Tailwind — keeps bundle minimal, tokens shared with spec |
| Font | Onest (variable), Google Fonts via `next/font` | Self-hosted at build time by next/font, `display: swap`, subsets: latin + cyrillic |
| Animations | CSS transitions + IntersectionObserver; no animation library | Parallax: rAF + transform |
| Icons | Inline SVG components (custom set, stroke style) | No emoji, no icon font |
| Images | `next/image`, AVIF/WebP, placeholders until real photos | |
| i18n | Route-based: `/` (uk, default), `/en` | Dictionary JSON files, no runtime i18n lib needed |
| Forms | API route `/api/lead` → Telegram Bot API notification (v1) | Fallback: mailto if bot token absent |
| Analytics | Vercel Analytics (v1), GA4 slot prepared | |
| Hosting | Vercel (v1), portable static output for future host | |

## 3. Project structure

```
src/
  app/
    [locale]/           # uk | en
      layout.tsx        # fonts, header, footer, JSON-LD
      page.tsx          # assembles sections
    api/lead/route.ts
    sitemap.ts, robots.ts, icon
  components/
    ui/                 # Button, Container, SectionHeading, Badge, Input
    sections/           # Hero, Services, BeforeAfter, Process, WhyS13,
                        # Warranty, Gallery, Reviews, Faq, Contact
    layout/             # Header, Footer, MobileCallBar, LangSwitch
  lib/                  # i18n.ts, seo.ts, constants.ts (business data)
  dictionaries/         # uk.json, en.json
  styles/               # tokens.css, globals.css
public/                 # logos, favicon, og.jpg, photos/
```

## 4. Design tokens

### 4.1 Colors
```css
--bg:        #0B0B0C;  /* page */
--panel:     #141416;  /* alternating sections */
--card:      #1A1A1D;  /* cards */
--border:    #26262A;
--accent:    #E3D200;  /* logo yellow — CTA, highlights only */
--accent-dim:#B8AA00;  /* hover/pressed */
--text:      #F4F4F2;
--muted:     #9B9CA0;
--grey:      #77787B;  /* logo grey — secondary elements */
```
Rules: yellow reserved for CTAs, key numbers, active states — never large fills. Contrast: all text ≥ 4.5:1 (muted on card checked), yellow-on-black buttons use #111 text.

### 4.2 Typography (Onest)
| Role | Size (desktop → mobile) | Weight | Line-height |
|---|---|---|---|
| H1 | clamp(34–56px) | 800 | 1.12 |
| H2 | clamp(26–38px) | 800 | 1.2 |
| H3 (card) | 20px | 700 | 1.3 |
| Body | 16–17px | 400 | 1.6 |
| Small/labels | 13–14px | 500–600 | 1.4 |
| Section label | 13px, uppercase, ls 2.5px, yellow | 600 | |

### 4.3 Spacing, radius, breakpoints
- Section padding: 88px desktop / 64px mobile; container max 1180px, side 24px/16px.
- Radius: 16px cards, 10px buttons/inputs, 100px pills.
- Breakpoints: ≤ 599 mobile, 600–899 tablet, ≥ 900 desktop. Layout verified at 375, 768, 1440.
- Z-index scale: header 100, mobile call bar 120, lightbox 200.

### 4.4 Buttons
| Variant | Style | Use |
|---|---|---|
| Primary | yellow bg, #111 text, hover lift + glow shadow | Call, form submit, service CTA |
| Ghost | 1px border, text; hover yellow border/text | Secondary actions |
Min touch target 44×44px. `tel:` links on all phone mentions.

## 5. Page sections (order fixed)

| # | Section | Content | Key behavior |
|---|---|---|---|
| 0 | Header (fixed) | logo, anchor nav, lang switch UA/EN, phone | Blur bg; mobile: burger-less — logo + phone only |
| 1 | Hero | badge, H1 + yellow span, sub, CTA call + CTA form, trust counters (500+ авто, 5.0 Google, гарантія), photo | Photo placeholder → real photo later; light bg parallax |
| 2 | Services | 3 group cards (Хімчистка / Полірування / Захист кузова), features, "від N грн", CTA | Card hover lift; "Повний прайс" accordion under cards with all 14 services (from brief) |
| 3 | Before/After | slider, 2–3 pairs switchable | Pointer + touch drag (pointer capture, touch-action none), keyboard accessible (arrow keys) |
| 4 | Process | 4 steps (Заявка → Огляд → Робота → Видача) | Staggered reveal |
| 5 | Why S13 (parallax band) | H2, copy, 3 stat counters; giant outlined "S13" watermark | Full-viewport band; word travels top→bottom of section (amp −330px desktop / −150 mobile); counters animate on first view |
| 6 | Warranty + materials | 2-col: warranty text + materials/brand chips | Static, reveal only |
| 7 | Gallery | grid 6–8 photos, category tag | Lightbox: fullscreen overlay, swipe/arrows/Esc, caption, counter; focus trap |
| 8 | Reviews | 4–6 cards (Google/Instagram), name + text + stars, link to Google profile | Horizontal scroll-snap on mobile |
| 9 | FAQ | 5–7 questions, accordion | `<details>`-based, JSON-LD FAQPage |
| 10 | Contact | form (name, phone, service optional), contact items, Google Maps embed (lazy), hours, Instagram | Form validation; map loads on scroll into view |
| — | Footer | logo, nav, contacts, © | |
| — | Mobile call bar | sticky bottom "Зателефонувати" | Hidden ≥ 900px; hides when contact section visible |

## 6. Animation spec (level: moderate)

| Effect | Implementation | Constraint |
|---|---|---|
| Scroll reveals | IntersectionObserver adds `.on`; opacity+translateY(28px), 0.7s ease, stagger ≤ 0.24s | once per element |
| Parallax (Hero, Why S13) | rAF + `transform: translateY`, passive scroll listener | never `background-attachment: fixed` |
| Counters | count-up on first intersection, 1.2s | integers only |
| Hover | translateY(-2/-6px), border-color, 0.2–0.25s | desktop only (`hover: hover`) |
| Reduced motion | `prefers-reduced-motion: reduce` → all above disabled, content visible | mandatory |

Budget: no layout shift from animations (transform/opacity only), CLS < 0.1.

## 7. i18n

- `/` = Ukrainian (default, no prefix), `/en` = English. `hreflang` pair + `x-default` → uk.
- Dictionaries: flat JSON per locale; all copy externalized incl. aria-labels, meta, FAQ.
- Lang switch preserves scroll anchor. `<html lang>` per locale.
- Numbers/currency: `грн` both locales (₴ optional); phone formatted +38 (063) 806 50 56.

## 8. SEO

- Title (uk): `Детейлінг у Вінниці — хімчистка, полірування, кераміка | S13 Detailing Studio`
- Meta description with services + city + phone; unique per locale.
- Keywords targeting: детейлінг Вінниця, хімчистка салону Вінниця, полірування авто Вінниця, кераміка авто Вінниця, полірування фар, антидощ. Used naturally in H2/copy/FAQ — no stuffing.
- JSON-LD: `AutoDetailing` (LocalBusiness subtype) — name, address (вул. Данила Нечая, 224а, Вінниця, 21000), geo, phone, openingHours (Mo–Sa 09:00–18:00), sameAs (Instagram, Google Maps), priceRange `₴₴`; plus `FAQPage`.
- OG/Twitter image 1200×630 (logo on dark), canonical, sitemap.xml, robots.txt.
- Semantic HTML: single h1, sections with h2, `<address>`, landmark roles.

## 9. Forms & lead flow

- Fields: ім'я (required, ≥ 2 chars), телефон (required, mask +38 0XX XXX XX XX, validated), послуга (optional select).
- Submit → POST `/api/lead` → Telegram bot message to owner (env: `TG_BOT_TOKEN`, `TG_CHAT_ID`). Success state inline ("Передзвонимо протягом 15 хв"), error state with phone fallback.
- Spam: honeypot field + min-time-to-submit check. No CAPTCHA (friction).
- Consent line under button (обробка персональних даних).

## 10. Performance budget

| Metric | Target |
|---|---|
| LCP (mobile 4G) | ≤ 2.5s |
| CLS | < 0.1 |
| JS bundle (page) | ≤ 90KB gzip client JS |
| Images | AVIF/WebP, hero preloaded, rest lazy; explicit width/height |
| Font | 2 weights subset (400/800 variable axis), swap |
| Map/embeds | lazy on intersection |

## 11. Accessibility (WCAG 2.1 AA)

- Contrast ≥ 4.5:1; visible focus rings (yellow outline) on all interactive elements.
- Slider and lightbox keyboard-operable; lightbox: focus trap, Esc close, aria-modal.
- All images alt text (uk/en); form inputs with labels; accordion via native `<details>` or aria-expanded.
- Touch targets ≥ 44px; no motion for reduced-motion users.

## 12. QA acceptance checklist

- [ ] 375 / 768 / 1440 px: no horizontal scroll, layouts match spec
- [ ] Slider drag works: mouse, touch, keyboard
- [ ] Lightbox: open/close/swipe/Esc/focus trap
- [ ] Form: validation, success, error, honeypot
- [ ] `tel:` links dial correctly; sticky bar behavior
- [ ] uk ↔ en switch: all strings translated, hreflang present
- [ ] JSON-LD passes Google Rich Results test
- [ ] Lighthouse mobile ≥ 90 all categories
- [ ] `next build` clean, no console errors

## 13. Content dependencies (owner)

| Item | Status | Placeholder until then |
|---|---|---|
| Real prices ("від") | pending | 2 500 / 3 000 / 6 500 грн hardcoded |
| Studio & work photos | pending | styled dark placeholders |
| Reviews (IG highlights, Google) | pending | 4 drafted from typical feedback, marked for replacement |
| Exact "years of experience", cars count | pending | 500+ / 3 роки |
| Telegram bot token for leads | pending | form logs + mailto fallback |

## 14. Future (out of v1 scope)

Blog (`/blog`), extended gallery page, Telegram booking bot, A/B price display test, GA4 events (call click, form submit, scroll depth), client hosting migration.
