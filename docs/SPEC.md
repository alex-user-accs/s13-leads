# S13 Detailing Studio — Frontend Specification (SDD)

Version 1.1 · updated 2026-11-03 · Status: **v1 implemented. This document describes the code as built.**
Scope: landing page (single page), uk/en, desktop + mobile.
Related: `../PROJECT-GUIDE.md` (running, hosting, security review, launch checklist).

---

## 1. Goals & success criteria

| Goal | Metric |
|---|---|
| Primary conversion | Phone call (`tel:` taps / calls) |
| Secondary conversion | Callback form submissions (delivered to Telegram) |
| Visual | Outstanding vs local competitors, dark premium-technical style |
| SEO | Rank for detailing queries in Вінниця |
| Performance | Lighthouse ≥ 90 mobile (Performance, SEO, A11y, Best Practices) |

Non-goals (v1): online booking, blog content, payment, CMS.

## 2. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15.5 (App Router), React 19 | All pages statically generated; one dynamic route (`/api/lead`) |
| Language | TypeScript, strict | |
| Styling | CSS Modules + global design tokens (CSS custom properties) | No Tailwind |
| Font | Onest (variable), Google Fonts via `next/font` | Self-hosted at build time, `display: swap`, subsets latin + cyrillic |
| Animations | CSS transitions + IntersectionObserver; no animation library | Parallax: shared `useParallax` hook (rAF + transform) |
| Icons | Inline SVG components (`components/ui/Icons.tsx`) | No emoji, no icon font |
| Images | `next/image`, AVIF/WebP | Real photos in `public/photos/`; source originals in `../assets/` |
| i18n | Route groups: `/` (uk, default), `/en` | Dictionary JSON files, no runtime i18n lib |
| Forms | `/api/lead` → Telegram Bot API | See §9 |
| Analytics | **Not installed yet** | Planned: Vercel Analytics or GA4 (§14) |
| Hosting | Not chosen yet. Needs a Node.js host (the API route rules out static-only hosting) | Options in PROJECT-GUIDE §4 |

## 3. Project structure

```
site/src/
  app/
    (uk)/layout.tsx, page.tsx      # / — Ukrainian
    (en)/layout.tsx, en/page.tsx   # /en — English
    api/lead/route.ts              # lead form → Telegram
    sitemap.ts, robots.ts, icon.png
  components/
    Landing.tsx                    # assembles all sections + JSON-LD
    layout/   Header, Footer, MobileCallBar, RootDocument (<html>/<body> shell)
    sections/ Hero, Services, BeforeAfter, Process, WhyS13,
              Warranty, Gallery, Reviews, Faq, Contact
    ui/       Icons, RevealInit (scroll-reveal observer)
  lib/
    constants.ts   # business data, prices, stats
    i18n.ts        # locales, getDictionary, localePath
    seo.ts         # metadata, LocalBusiness + FAQ JSON-LD
    lead.ts        # lead rules shared by form and API (phone check, services)
    motion.ts      # useParallax, prefersReducedMotion
    fonts.ts
  dictionaries/    # uk.json, en.json (same keys)
  styles/          # tokens.css, globals.css
site/public/       # logo.png, og.png (1200×630), photos/, brands/, avatars/
```

Buttons, section headings and the container are global CSS classes (`.btn`, `.btn-primary`, `.btn-ghost`, `.sec-label`, `.sec-title`, `.sec-sub`, `.container`), not components.

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
Rules: yellow is reserved for CTAs, key numbers and active states, never large fills. Contrast: all text ≥ 4.5:1 (muted on card checked); yellow-on-black buttons use #111 text.

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
- Section padding: 88px desktop / 64px mobile; container max 1180px, side padding 24px/16px.
- Radius: 16px cards, 10px buttons/inputs, 100px pills.
- Breakpoints: ≤ 599 mobile, 600–899 tablet, ≥ 900 desktop.
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
| 0 | Header (fixed) | logo, anchor nav (Послуги, Результати, Як ми працюємо, Галерея, Контакти), UA/EN switch, phone | Blur bg. < 900px: nav hidden, logo + language switch + phone remain (no burger menu) |
| 1 | Hero | address badge (links to map), H1 "Детейлінг авто у Вінниці — вигляд як з салону" (yellow span), sub, CTA call + CTA "Розрахувати вартість" (→ form), trust row: **568+ авто**, **5.0 рейтинг Google**, **100% гарантія якості**, real photo | Photo preloaded (`priority`); static, no parallax |
| 2 | Services | 3 group cards (Хімчистка / Полірування / Захист кузова) with features, "від N грн", CTA → form | Card hover lift. "Повний прайс" accordion (`<details>`) lists **22 services in 4 groups** (incl. "Додатково": car pickup, price negotiable) |
| 3 | Before/After | one before/after photo pair; large outlined "S13" watermark | Pointer + touch drag (pointer capture), keyboard arrows (±4%), range 5–95%; watermark parallax (amp −110px mobile / −220px desktop) |
| 4 | Process | 4 steps: Заявка → Огляд → Робота → Видача | Dashed curved arrows between steps; staggered reveal; 4 → 2 → 1 columns |
| 5 | Why S13 (parallax band) | H2, copy, 3 counters: **568+** cars, **3** years, **22** services; giant outlined "S13" watermark; CTA | Watermark amp −150px mobile / −330px desktop, background 80px; counters ease-out over 1.2s on first view |
| 6 | Warranty + materials | warranty text + 3 points; materials panel with **8 brand logos**: Koch Chemie, CarPro, Soft99, Glaco, Meguiar's, Shiny Garage, ZviZZer, Binder | Static, reveal only |
| 7 | Gallery | **6 photos** (WebP) with captions: body polishing, interior cleaning, ceramic coating, headlight polishing, seat cleaning, wax protection | Lightbox: overlay, arrows, swipe, Esc, caption + counter, scroll lock. See known gaps (§12) |
| 8 | Reviews | **4 real reviews** (1 Google, 3 Instagram), name, text, 5 stars, avatar photo or initial; each card links to the original; button to the Google Maps profile | Horizontal scroll-snap carousel; auto-advances every 4s while visible, pauses on hover/touch and for 8s after manual scroll; dot navigation |
| 9 | FAQ | **10 questions** (incl. cleaning/polishing prices, car pickup, location), accordion | Native `<details>`; prices in answers are filled from the price list; FAQPage JSON-LD |
| 10 | Contact | address, hours (Пн–Сб 09:00–18:00, Нд вихідний), phone, Instagram; callback form; Google Maps embed | Map iframe uses native `loading="lazy"` |
| — | Footer | logo, © year, phone, Instagram | |
| — | Mobile call bar | sticky bottom "Зателефонувати" | Hidden ≥ 900px; slides away when the contact section is ≥ 20% visible |

## 6. Animation spec (level: moderate)

| Effect | Implementation | Constraint |
|---|---|---|
| Scroll reveals | `RevealInit` adds `.on` via IntersectionObserver (threshold 0.15); opacity + translateY(28px), 0.7s ease; per-item stagger 0.06–0.1s | once per element |
| Parallax (Before/After, Why S13) | `useParallax` hook: rAF-throttled passive scroll listener, `transform: translateY`; skipped when the section is > 1.2 viewports away | never `background-attachment: fixed` |
| Counters | count-up on first intersection (threshold 0.5), 1.2s cubic ease-out | integers only |
| Reviews carousel | auto-scroll every 4s | pauses as described in §5 |
| Hover | translateY(-2/-6px), border-color, 0.2–0.25s | desktop only (`hover: hover`) |
| Reduced motion | `prefers-reduced-motion: reduce` → reveals shown immediately, parallax/counters/carousel autoplay disabled, transitions ~0 | mandatory |

Budget: no layout shift from animations (transform/opacity only), CLS < 0.1.

## 7. i18n

- `/` = Ukrainian (default, no prefix), `/en` = English. `hreflang` alternates uk/en + `x-default` → `/`. `<html lang>` per locale.
- Dictionaries: one JSON per locale with identical keys; all copy externalized incl. aria-labels, meta and FAQ.
- The language switch links to the other locale's home page (it does not keep the current scroll position).
- Prices use `грн` and `uk-UA` number formatting in both locales; phone shown as +38 (063) 806 50 56.

## 8. SEO

- Title (uk): `Детейлінг у Вінниці: хімчистка салону, полірування, кераміка | S13`
- Title (en): `Car Detailing in Vinnytsia: Interior Cleaning, Polishing, Ceramic | S13`
- Meta description with services, city, "Ціни від {minPrice} грн" (filled from the price list) and phone; unique per locale.
- H1 and the services, before/after, reviews and contact H2s include the service, "ціни" or the city. Keyword research and rationale: `SEO.md`.
- Keywords targeted naturally in H2/copy/FAQ: детейлінг Вінниця, хімчистка салону Вінниця, полірування авто Вінниця, кераміка авто Вінниця, полірування фар, антидощ.
- JSON-LD: one `@graph` with `AutoWash` (schema.org has no detailing type) + `WebSite` + `FAQPage`. The business has address (вул. Данила Нечая, 224а, Вінниця, 21012), geo matching the Google Business Profile pin, phone, opening hours (Mo–Sa 09:00–18:00), sameAs, hasMap, areaServed, logo, images, priceRange `₴₴`, and the full price list as `OfferCatalog`. No review/rating markup (self-serving reviews are not eligible). Output escapes `<`.
- OG/Twitter image `og.png` 1200×630 with alt, OG alternate locale, canonical per locale, `max-image-preview: large`, `sitemap.xml` (with reciprocal hreflang and 9 work photos), `robots.txt`, optional Search Console verification via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
- All absolute URLs come from `NEXT_PUBLIC_SITE_URL`. **It must be set to the production domain**, otherwise they fall back to `https://s13-detailing.vercel.app`.
- Semantic HTML: single h1, sections with h2, `<address>`, landmark roles.

## 9. Forms & lead flow

- Fields: ім'я (required, ≥ 2 chars), телефон (required, UA number: `+380XXXXXXXXX` or `0XXXXXXXXX`, spaces/brackets/dashes allowed; no input mask, placeholder shows the format), послуга (optional: cleaning / polishing / protection).
- Validation runs in the browser and again on the server with the same rules (`lib/lead.ts`).
- Submit → POST `/api/lead` → Telegram message to the owner (env `TG_BOT_TOKEN`, `TG_CHAT_ID`; server-only, never in client code). The message is always in Ukrainian: name, phone, service name, visitor's language.
- Success shown inline ("Передзвонимо протягом 15 хвилин у робочий час"); on failure, an error with a phone link.
- Spam protection:
  - hidden honeypot field (`company`) must be empty;
  - form must be filled in ≥ 3s (the `elapsed` value is required);
  - the server checks name/phone, ignores unknown service/locale values and limits each IP to 5 requests per 10 minutes (HTTP 429). The limit is per server instance; add a host-level rule in production.
  - Bot submissions get a fake "ok" and are dropped. No CAPTCHA (friction).
- If the Telegram variables are not set, the lead is only written to the server log and the visitor still sees success. **Production must have them set.**
- Consent line under the button (обробка персональних даних).

## 10. Performance budget

| Metric | Target | Current |
|---|---|---|
| LCP (mobile 4G) | ≤ 2.5s | not measured |
| CLS | < 0.1 | not measured |
| JS (page, first load) | ≤ 90KB gzip | **127 kB** reported by `next build`. ~99 kB of it is React + the Next.js runtime, so 90 kB is not reachable on this stack. ~7 kB is both dictionaries shipped to the browser by client components (can be trimmed) |
| Images | AVIF/WebP, hero preloaded, rest lazy; explicit sizes | done via `next/image` |
| Font | variable Onest, latin + cyrillic subsets, swap | done |
| Map/embeds | lazy | native `loading="lazy"` |

## 11. Accessibility (WCAG 2.1 AA)

- Contrast ≥ 4.5:1; visible focus rings (yellow outline) on all interactive elements.
- Before/after slider: `role="slider"` with aria values, keyboard arrows.
- Lightbox: `role="dialog"`, `aria-modal`, Esc closes, focus moves to the dialog on open (no full focus trap yet, see §12).
- All images have alt text (uk/en); form inputs have (visually hidden) labels; FAQ and price list use native `<details>`.
- Touch targets ≥ 44px; motion disabled for reduced-motion users.

## 12. QA acceptance checklist

- [ ] 375 / 768 / 1440 px: no horizontal scroll, layouts match spec
- [ ] Slider drag works: mouse, touch, keyboard
- [ ] Lightbox: open/close/swipe/Esc
- [x] Form: validation, success, error, honeypot, timing check, rate limit (API tested 2026-11-03)
- [x] Telegram delivery (tested locally 2026-11-03; retest on the hosted site)
- [ ] `tel:` links dial correctly; sticky bar behavior
- [ ] uk ↔ en switch: all strings translated, hreflang present
- [ ] JSON-LD passes Google Rich Results test
- [ ] Lighthouse mobile ≥ 90 all categories
- [x] `next build` clean (2026-11-03)

**Known gaps vs. original spec**
- Lightbox has no focus trap and does not return focus to the tile on close.
- Before/after shows one pair (the spec planned 2–3 switchable pairs).
- Hero has no parallax (planned "light bg parallax").
- The language switch does not keep the scroll position.
- The phone field has no input mask (format is validated instead).
- No analytics.

## 13. Content dependencies (owner)

| Item | Status | Notes |
|---|---|---|
| Prices ("від") | **to confirm** | Real price list in `lib/constants.ts` (cards from 4 000 / 5 000 / 5 000 грн); still marked placeholder in code until the owner signs off |
| Studio & work photos | done | hero, before/after, 6 gallery photos |
| Reviews | done | 4 real reviews (Google + Instagram), with links |
| Stats | done, confirm yearly | 568+ cars, 3 years, 22 services (`lib/constants.ts` → `STATS`) |
| Material brands | done | 8 brands confirmed by owner |
| Telegram bot for leads | done | customer's own bot; values in host env vars only |
| Production domain | **pending** | needed for `NEXT_PUBLIC_SITE_URL` |

## 14. Future (out of v1 scope)

Blog (`/blog`), extended gallery page, more before/after pairs, Telegram booking bot, A/B price display test, analytics + GA4 events (call click, form submit, scroll depth), Next.js 16 upgrade, lightbox focus trap.
