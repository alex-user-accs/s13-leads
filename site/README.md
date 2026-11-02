# S13 Detailing Studio — Landing Page

Next.js 15 landing page. Ukrainian (`/`) + English (`/en`). Spec: `../docs/SPEC.md`.

## Run locally

```bash
cd site
npm install
npm run dev        # http://localhost:3000
npm run build      # production check
```

## Deploy to Vercel

1. Push the project to a private GitHub repo (git root = the folder above `site/`).
2. vercel.com → Add New Project → import the repo → set **Root Directory** to `site`. Framework auto-detected.
3. Set env variables (Settings → Environment Variables):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | production URL, e.g. `https://s13detailing.com` |
| `TG_BOT_TOKEN` | Telegram bot token (see below) |
| `TG_CHAT_ID` | Owner's chat id |

Without TG vars the form still works — leads are logged, not delivered.

## Telegram bot for leads (2 minutes)

1. In Telegram, open **@BotFather** → `/newbot` → name it (e.g. `S13 Leads`) → copy the **token** → `TG_BOT_TOKEN`.
2. Owner opens the new bot and presses **Start**.
3. Open `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser, find `"chat":{"id":...}` → `TG_CHAT_ID`.
4. Add both to Vercel env → redeploy. Test the form.

## Replacing placeholders

| What | Where |
|---|---|
| Prices | `src/lib/constants.ts` → `SERVICE_GROUPS` |
| Stats (cars/years) | `src/lib/constants.ts` → `STATS` |
| Hero/gallery/before-after photos | `public/photos/` (already wired via `next/image` in `Hero.tsx`, `Gallery.tsx`, `BeforeAfter.tsx`) |
| Reviews | `src/dictionaries/uk.json` + `en.json` → `reviews.items` |
| Material brands | `src/components/sections/Warranty.tsx` → `MATERIAL_BRANDS` |
| All copy | `src/dictionaries/uk.json` / `en.json` |
