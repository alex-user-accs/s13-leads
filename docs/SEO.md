# S13 Detailing Studio — SEO Plan

Researched 2026-11-03. Covers what was changed on the site, the keyword and competitor research behind it, and what still has to happen off the site. For a local service business, most of the remaining ranking gains are off the site.

---

## 1. Summary

- **Market:** Vinnytsia, Ukrainian-language search. Almost every service query also appears with **"ціна"** (price), so price visibility is the main hook.
- **Competition is weak on SEO.** The local competitors' sites are single pages with 400–525 words; two have no H1, and one declares its Ukrainian site as Russian (`lang="ru"`). A well-optimized page can outrank them.
- **The biggest problems on our site were technical** (fixed, see §4): an invalid business type in the structured data, and a map pin ~3.5 km away from the Google Business Profile pin.
- **The biggest remaining lever is the Google Business Profile** (§5). Local-ranking studies put it at roughly a third of the local ranking weight. Next come reviews, consistent business listings, and dedicated service pages (§6).

---

## 2. Keyword research

Source: Google autocomplete (gl=ua), which shows what people in Ukraine type now. Search volumes need Google Keyword Planner or Search Console once the site is live.

| Priority | Query (uk) | Where it's targeted |
|---|---|---|
| 1 | детейлінг вінниця / детейлінг авто вінниця | title, H1, meta description |
| 1 | хімчистка салону (авто) вінниця + **ціна** | title, H2 "Хімчистка салону: фото до і після", FAQ "Скільки коштує хімчистка салону у Вінниці?" |
| 1 | полірування авто вінниця + **ціна** | title, FAQ "Скільки коштує полірування авто?", price list |
| 2 | полірування фар вінниця + ціна | meta description, FAQ, price list |
| 2 | кераміка на авто вінниця / керамічне покриття авто + ціна | title, price list, FAQ about durability |
| 2 | озонування авто вінниця | price list item renamed from "Озонація" to the searched form "Озонування" |
| 3 | хімчистка сидінь авто вінниця | price list, gallery caption |
| 3 | детейлінг вінниця відгуки | H2 "Відгуки клієнтів про S13" |

Findings:
- **Russian-language queries** (детейлинг винница, химчистка салона винница) still exist but return far fewer suggestions than Ukrainian. A Russian version of the site is not worth it.
- **"мийка авто вінниця"** has strong demand, but S13 isn't a car wash; only the three-phase wash is on the price list. Don't target it beyond that.
- Competitor brand searches seen in suggestions: "детейлінг космос", "віп детейлінг", "детейлінг центр". These are the names people already know.

---

## 3. Competitors (websites)

| Competitor | Title | H1 | Structured data | Notes |
|---|---|---|---|---|
| [DRIVEWAY](https://driveway.ua/) | "студія автодетейлінгу у Вінниці \| Хімчистка, полірування, плівки" | brand slogan, no keyword | AutoRepair | strongest of the three; also films, tinting |
| [Carclean](https://carclean.vn.ua/) | "Carclean Вінниця - Професійна детейлінг студія" | **none** | Organization + Review | page declared as `lang="ru"` |
| [Автомир ADC](https://avtomir.vn.ua/adc-deteyling) | "Детейлінг авто у Вінниці — полірування, кераміка, хімчистка" | **none** | none | a section of a car dealer's site |

Directories rank on page one for these queries too: [list.in.ua](https://list.in.ua/%D0%92%D1%96%D0%BD%D0%BD%D0%B8%D1%86%D1%8F/%D0%94%D0%B5%D1%82%D0%B5%D0%B9%D0%BB%D0%B8%D0%BD%D0%B3) (59 detailing businesses in Vinnytsia) and OLX. **S13 is not listed in any of them yet.**

---

## 4. Changes made on the site (2026-11-03)

| Change | Why |
|---|---|
| Structured data type `AutoDetailing` → **`AutoWash`** | `AutoDetailing` doesn't exist on schema.org (404), so Google most likely ignored the whole business block. AutoWash is the closest valid AutomotiveBusiness subtype. |
| Map pin → **49.2045062, 28.4953615** | Copied from the Google Business Profile. The old value was ~3.5 km off; the site and the profile must match. |
| Business markup now includes the full price list (22 services, as `OfferCatalog`), logo, photos, service area, map link, currency | Markup must reflect what's visible on the page; the price list is visible. Helps Google and AI answers understand services and prices. |
| One `@graph` with business, website and FAQ, linked by `@id` | Lets search engines connect the entities. |
| Title and description rewritten around "детейлінг у Вінниці" + services + "Ціни від 500 грн" | Keyword first; the price answers the dominant "ціна" intent. |
| H1: "Детейлінг авто у Вінниці — вигляд як з салону" | The old H1 had no keyword. The address moved into the badge above it (it already linked to the map). |
| H2s for services, before/after, reviews and contact now name the service, "ціни" or the city | Headings are a strong on-page signal; the old ones were slogans. |
| 4 new FAQ answers: cleaning price, polishing price, car pickup, location | They answer the price queries directly, which is the format AI Overviews quote. Prices come from the price list automatically (`{price:id}` placeholders), so they can't go stale. |
| Before/after photos got descriptive alt text (they had "ДО"/"ПІСЛЯ") | Image search and accessibility. |
| Sitemap: 9 work photos added; the language links now go both ways | Google Images, and correct hreflang. |
| `max-image-preview: large`, OG alternate locale, OG image alt | Bigger previews in Search, Discover and link shares. |
| Optional `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` env var | Verify Search Console without code changes. |

Deliberately **not** done:
- **No review stars markup.** Google doesn't show stars for reviews a business publishes about itself (review snippet guidelines).
- **FAQ markup kept, but no rich result expected.** Google retired FAQ rich results in 2026. The markup still helps other engines and AI answers understand the content.
- **No meta keywords and no `llms.txt`.** Google ignores both.

---

## 5. Off-site: Google Business Profile and listings (owner / before launch)

This is where most of the local ranking comes from. In order of impact:

1. **Google Business Profile**
   - Primary category: **"Детейлінг автомобілів"** (Car detailing service). Add secondary categories only if they're true.
   - Add every service with its price (the same as the site), working hours, and the **website link** once the domain is live.
   - Write a description that names the services and Vinnytsia.
   - Upload new real work photos regularly (e.g. weekly); post short updates and before/after photos.
   - Check the Q&A and any AI-generated fields on the profile, and correct anything wrong.
   - **The name, address and phone must match the site exactly:** "вул. Данила Нечая, 224а, Вінниця, **21012**". The site used the generic city postcode 21000 until 2026-11-03; set 21012 on the profile and every listing too.
2. **Reviews**
   - Ask every happy client for a Google review, using a short link or QR code at handover.
   - Reply to every review. Reviews that mention the service and the city ("хімчистка салону у Вінниці") help most.
3. **Listings with the same name, address and phone:** list.in.ua, OLX (services), infoauto.com.ua, Visicom, Apple Maps (Business Connect), Bing Places. Link Instagram to the site and the profile.
4. **Search Console** on launch day: verify the domain, submit `/sitemap.xml`, and check the structured data with the Rich Results Test.

---

## 6. Next phase: service pages (recommended)

The 2026 consensus for local service businesses: **one strong page per main service** beats a single page that covers everything. The competitors don't have them, which makes this the clearest opportunity.

| Page | Target query | Content |
|---|---|---|
| `/khimchystka-salonu` | хімчистка салону авто вінниця ціна | full cleaning price list, process, how long it takes, before/after, FAQ |
| `/poliruvannia-avto` | полірування авто вінниця ціна | 1/3-step/deep compared, headlight polishing, photos |
| `/keramika` | кераміка на авто вінниця | what it gives, how long it lasts, aftercare, price |

Each page needs **real, distinct content from the owner**: process details, durations, photos of that service. Pages that only swap words are treated as low quality. Needs: content from the owner, then about 1–2 days of development.

---

## 7. Measuring

After launch, check monthly:
- Search Console: impressions and clicks per query (§2), and indexing status.
- Google Business Profile insights: calls, route requests, website clicks.
- Form leads in Telegram. Ask callers where they found S13.
- Track the "ціна" queries especially; they are the closest to booking.

---

Sources: [Google: LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business) · [Google: review snippet guidelines](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) · [Google: changes to FAQ rich results](https://developers.google.com/search/blog/2023/08/howto-faq-changes) · [Google Search documentation updates](https://developers.google.com/search/updates) · [schema.org AutomotiveBusiness](https://schema.org/AutomotiveBusiness) · [Local SEO & GBP guide 2026 (Outpace)](https://outpaceseo.com/article/local-seo-gbp/) · [Local SEO in the AI Overview era (RankVelt)](https://www.rankvelt.com/blog/local-seo-ai-overviews) · [Local SEO ranking factors 2026 (ClickRank)](https://www.clickrank.ai/local-seo-ranking-factors/) · [Service area pages (Pipelineon)](https://pipelineon.com/blog/service-area-pages-seo/)
