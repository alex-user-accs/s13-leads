import { NextResponse } from "next/server";

const TG_API = "https://api.telegram.org";

export async function POST(request: Request) {
  let body: {
    name?: string;
    phone?: string;
    service?: string;
    honeypot?: string;
    elapsed?: number;
    locale?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const name = (body.name ?? "").trim().slice(0, 100);
  const phone = (body.phone ?? "").trim().slice(0, 30);

  const phoneDigits = phone.replace(/\D/g, "");
  const isValidUaPhone =
    /^380\d{9}$/.test(phoneDigits) || /^0\d{9}$/.test(phoneDigits);
  if (name.length < 2 || !isValidUaPhone) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Spam checks: honeypot must be empty, form filled in ≥ 3s.
  if (body.honeypot || (typeof body.elapsed === "number" && body.elapsed < 3000)) {
    return NextResponse.json({ ok: true });
  }

  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;

  if (!token || !chatId) {
    console.warn("[lead] TG env not set; lead:", { name, phone, service: body.service });
    return NextResponse.json({ ok: true });
  }

  const text = [
    "🚗 Нова заявка з сайту S13",
    `Ім'я: ${name}`,
    `Телефон: ${phone}`,
    body.service ? `Послуга: ${body.service}` : null,
    `Мова: ${body.locale ?? "uk"}`,
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
