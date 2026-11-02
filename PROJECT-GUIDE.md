# S13 Detailing Studio — Project Guide

Status check: 2026-11-02. Covers how to run the site, how to host it without exposing secrets, the security review findings, and what is left to do before launch.

---

## 1. What this project is

A one-page landing site for S13 Detailing Studio (Vinnytsia), Ukrainian at `/` and English at `/en`.

| Part | Details |
|---|---|
| Framework | Next.js 15.5 (App Router), React 19, TypeScript |
| Styling | CSS Modules + design tokens (`site/src/styles/tokens.css`) |
| Pages | Static, built ahead of time |
| Server part | One API route, `POST /api/lead`, which sends callback-form leads to the owner on Telegram |
| Content | `site/src/dictionaries/uk.json`, `en.json`; prices and stats in `site/src/lib/constants.ts` |
| Spec | `docs/SPEC.md` (design/feature spec), `site/README.md` (short dev notes) |

Folder layout:

```
S13 Detailng Studio/        ← git root
├─ site/                    ← the Next.js app (everything that gets deployed)
│  ├─ src/                  ← code and text
│  ├─ public/               ← optimized images the site actually serves
│  ├─ .env.example          ← list of required variables (no values)
│  └─ .env.local            ← REAL secrets, local only, ignored by git
├─ assets/                  ← original source files, NOT used by the build
│  ├─ logos/                ← S13 logo variants
│  ├─ brands/               ← material brand logos
│  ├─ avatars/              ← reviewer photos
│  ├─ photos/               ← work and studio photos
│  ├─ placeholders/         ← old placeholder images
│  └─ raw/                  ← RAW camera originals (~170 MB), ignored by git
├─ docs/                    ← SPEC.md, project-brief.md, design-preview.html
└─ PROJECT-GUIDE.md         ← this file
```

To put a new image on the site, export an optimized copy (WebP/JPG, ≤ ~300 KB) from `assets/` into `site/public/` and keep the original in `assets/`. Anything inside `site/public/` is uploaded to the host and can be downloaded by anyone.

Because the site has an API route, it needs a host that runs Node.js. It cannot be uploaded as plain HTML files.

---

## 2. Run it locally

Needs **Node.js 20 LTS or newer** (tested with 20.20.0) and npm.

```bash
cd site
npm ci                         # install exact locked versions
cp .env.example .env.local     # then fill in values (see §3)
npm run dev                    # http://localhost:3000
```

Production build, to check before deploying:

```bash
npm run build                  # must finish with no errors
npm start                      # serves the build on http://localhost:3000 (use -p 8080 for another port)
```

If `TG_BOT_TOKEN` / `TG_CHAT_ID` are empty, the form still answers "success" and the lead is only written to the server log. That is handy for testing without sending real messages:

```bash
TG_BOT_TOKEN= TG_CHAT_ID= npm start
```

---

## 3. Secrets: keeping the API keys private

The site has two secrets, used to deliver leads to Telegram, plus one public setting:

| Variable | Secret? | Purpose |
|---|---|---|
| `TG_BOT_TOKEN` | **Yes.** Anyone who has it can control the bot | Telegram bot that sends lead messages |
| `TG_CHAT_ID` | Yes (low risk) | Owner's Telegram chat that receives leads |
| `NEXT_PUBLIC_SITE_URL` | No. It is public by design | Production URL for canonical links, sitemap and social previews |

**Verified on 2026-11-02:**

- The token is read only on the server (`site/src/app/api/lead/route.ts`). It has no `NEXT_PUBLIC_` prefix, so Next.js never puts it in browser code.
- Searched the whole production build (`.next/`, `public/`, the pre-rendered HTML): the token and chat ID appear **nowhere**. They are read at runtime from the environment.
- `.env.local` is ignored by git and was never committed (checked the full history).

**Rules for hosting:**

1. Put the real values only in the hosting provider's **Environment Variables** settings (Vercel: Project → Settings → Environment Variables; VPS: a `.env.local` file on the server with `chmod 600`). Never put them in code, in git, or in a `NEXT_PUBLIC_*` variable.
2. The bot should belong to the **customer**. Create it from the customer's own Telegram account with @BotFather (steps in `site/README.md`). Do not ship the token that is in the current local `.env.local`.
3. If a token was ever pasted into a chat, email or screenshot, revoke it in @BotFather (`/revoke`) and issue a new one.
4. Keep the GitHub repo **private**. The source has no secrets, but there is no reason to publish it.

---

## 4. Hosting options

| Option | Effort | Notes |
|---|---|---|
| **Vercel** (recommended) | Lowest | Made by the Next.js team; deploys on every git push; free HTTPS. The free Hobby plan is for **non-commercial use only**, so a business site should be on Pro, or on another host. The local folder is already linked to a Vercel project (`site/.vercel`). |
| Netlify / Render / Railway | Low | Support Next.js with API routes. Set Root Directory = `site`. |
| VPS (Linux, Node 20+) | Medium | Full control. See the outline below. |
| Shared hosting (cPanel) | Only if it has a "Node.js app" feature | Plain PHP/HTML hosting **will not work** (the form needs Node). |

### Vercel

1. Push this repo to a private GitHub repo.
2. vercel.com → Add New Project → import it → **Root Directory: `site`**.
3. Add the env variables from §3 (Production environment).
4. Deploy → open the site → submit the form → check that the message arrives in Telegram.
5. Settings → Domains → add the customer's domain and follow the DNS instructions.
6. Set `NEXT_PUBLIC_SITE_URL` to the final domain (e.g. `https://s13detailing.com`) and redeploy.

### VPS (outline)

```bash
git clone <private-repo> s13 && cd s13/site
npm ci && npm run build
nano .env.local && chmod 600 .env.local      # paste the 3 variables
npm i -g pm2
pm2 start npm --name s13 -- start -- -p 3000
pm2 save && pm2 startup
```

Put Nginx in front as a reverse proxy to `localhost:3000`, add HTTPS with `certbot --nginx`, and rate-limit `/api/lead` there (see §5, finding 3). Use Linux, not Windows Server.

---

## 5. Security review (2026-11-02)

### Fixed during this check

| # | Severity | Finding | Action |
|---|---|---|---|
| 1 | **Critical** | Next.js 15.5.20 was affected by several published advisories, including **remote code execution in the Image Optimization API when AVIF/SVG images are used**. This site turns AVIF on in `next.config.ts`. Also cache poisoning and DoS issues. | Updated to **Next.js 15.5.28** with `npm audit fix` (no breaking changes). Also patched `sharp`, `nanoid`, `source-map-js`. Build verified. |
| 2 | Info | The older React2Shell RCE (Dec 2025) | Already patched: React 19.2.7 is a fixed version. |

### Fixed in the refactor (2026-11-03)

| # | Severity | Finding | What changed |
|---|---|---|---|
| 3 | **High** | No rate limit on `/api/lead`. 25 requests in a row were all accepted. | Per-IP limit in `route.ts`: 5 requests per 10 minutes, then HTTP 429. It is kept in memory, so it is per server instance. **On Vercel, also add a Firewall rate-limit rule for `/api/lead`; on a VPS, Nginx `limit_req`.** |
| 4 | **Medium** | The anti-spam timing check was skipped when the client left out `elapsed`. | `elapsed` is now required. Missing or under 3 s gets a fake "ok" and is never sent. If spam still gets through, add Cloudflare Turnstile. |
| 5 | Medium | `service` and `locale` were not validated (a 5,000-character value was accepted). | Only `cleaning` / `polishing` / `protection` and `uk` / `en` are accepted. The Telegram message now shows the service's Ukrainian name instead of its id. |
| 6 | Medium | No security headers. | `next.config.ts` now sends `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS and a CSP limited to `frame-ancestors`, `object-src`, `base-uri` and `form-action`. A full script CSP would need nonces, so it was left out. |
| 9 | Medium | Posting `null` or a non-text `name` crashed the route with HTTP 500. | Input is type-checked; these now return 400. |

### Still open

| # | Severity | Finding | Recommended fix |
|---|---|---|---|
| 7 | Low | PostCSS bundled inside Next.js has advisories. It only runs at build time on the project's own CSS, so it is not reachable by visitors. | Fully cleared by upgrading to **Next.js 16** (a major version, so test first). |
| 8 | Low | When Telegram is not configured, lead names and phone numbers are written to the server logs. | OK for testing. In production, make sure the TG variables are set so this branch is never used. |

Checked and fine: there is no user input rendered as HTML (the JSON-LD is built from static text only), all external links use `rel="noopener noreferrer"`, Telegram messages are sent as plain text (no HTML injection), the `X-Powered-By` header is disabled, and there are no middleware or auth bypass concerns (there is no login).

---

## 6. Functional check (2026-11-02)

| Check | Result |
|---|---|
| TypeScript (`tsc --noEmit`) | Pass |
| Production build (`next build`) | Pass, 9 routes, ~126 kB first-load JS |
| `/`, `/en`, `/robots.txt`, `/sitemap.xml`, images, image optimizer | All HTTP 200 |
| Form API: valid lead → 200, invalid phone → 400 | Pass |
| Telegram delivery | Tested locally by the developer with the customer's bot (@s13_cust_bot) on 2026-11-03. Test once more on the hosted site. |
| Visual / mobile layout, Lighthouse | Not re-checked this time. Run the QA checklist in `docs/SPEC.md` §12 on the hosted URL. |

---

## 7. Launch checklist

**Owner / content**
- [ ] Customer confirms the prices in `site/src/lib/constants.ts` (still marked "placeholder")
- [ ] Customer confirms the stats (568 cars, 3 years, 22 services), phone, address and opening hours
- [ ] Domain bought, and access to its DNS
- [ ] Customer's own Telegram bot created; token and chat ID handed over privately

**Technical**
- [ ] Add a host-level rate-limit rule for `/api/lead` (see §5, finding 3)
- [ ] Host chosen (§4); env variables set there, not in git
- [ ] `NEXT_PUBLIC_SITE_URL` set to the real domain. If it is not set, the canonical links and sitemap point to the default `s13-detailing.vercel.app`, which hurts SEO.
- [ ] HTTPS working; `www` → main domain redirect
- [ ] Submit the form on the live site, confirm the Telegram message arrives
- [ ] Lighthouse mobile ≥ 90; test on a real phone
- [ ] Google Search Console: verify the domain, submit `/sitemap.xml`; check JSON-LD with the Rich Results Test
- [ ] Analytics: the spec plans Vercel Analytics / GA4, but **neither is installed yet**

**Later**
- [ ] Upgrade to Next.js 16 (clears finding 7)
- [ ] Run `npm audit` monthly and update Next.js patch releases
- [ ] Unused logos in `site/public/brands/` (gyeon, menzerna, rupes) can be removed or added to the materials list

---

## 8. Git

The repository is at the project root on branch `master`. The site's original history is kept under `site/`.

Ignored by git (`.gitignore`): all `.env*` files except `.env.example`, `node_modules/`, `.next/`, `.vercel`, and `assets/raw/` (RAW originals). Back up `assets/raw/` separately, for example to cloud storage.

To publish to GitHub as a **private** repo:

```bash
gh repo create s13-detailing --private --source . --push
```
