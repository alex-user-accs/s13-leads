import { NextResponse } from "next/server";
import { getDictionary } from "@/lib/i18n";
import { isLeadService, isValidUaPhone, MIN_FILL_MS } from "@/lib/lead";

const TG_API = "https://api.telegram.org";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

/**
 * Best-effort per-IP limit. Kept in memory, so it is per server instance —
 * on serverless hosts pair it with a platform rate-limit rule.
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 1000) {
    for (const [key, times] of hits) {
      if (now - times[times.length - 1] >= RATE_WINDOW_MS) hits.delete(key);
    }
  }
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  const limited = recent.length >= RATE_LIMIT;
  if (!limited) recent.push(now);
  hits.set(ip, recent);
  return limited;
}

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export async function POST(request: Request) {
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const name = str(body.name).slice(0, 100);
  const phone = str(body.phone).slice(0, 30);
  if (name.length < 2 || !isValidUaPhone(phone)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Spam checks: honeypot must be empty, form filled in ≥ MIN_FILL_MS.
  // Bots get a fake success so they don't retry.
  if (body.honeypot || typeof body.elapsed !== "number" || body.elapsed < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  const service = isLeadService(body.service) ? body.service : null;
  const locale = body.locale === "en" ? "en" : "uk";

  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;

  if (!token || !chatId) {
    console.warn("[lead] TG env not set; lead:", { name, phone, service });
    return NextResponse.json({ ok: true });
  }

  // The owner reads leads in Ukrainian regardless of the visitor's language.
  const uk = getDictionary("uk");
  const text = [
    "🚗 Нова заявка з сайту S13",
    `Ім'я: ${name}`,
    `Телефон: ${phone}`,
    service ? `Послуга: ${uk.services.groups[service].title}` : null,
    `Мова: ${locale}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch(`${TG_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!res.ok) throw new Error(`TG ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lead] Telegram send failed:", err);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
