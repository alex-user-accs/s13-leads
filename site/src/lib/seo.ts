import type { Metadata } from "next";
import { BUSINESS } from "./constants";
import { getDictionary, type Locale } from "./i18n";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://s13-detailing.vercel.app";

export function buildMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  const path = locale === "uk" ? "/" : "/en";
  return {
    metadataBase: new URL(SITE_URL),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: path,
      languages: { uk: "/", en: "/en", "x-default": "/" },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: path,
      siteName: BUSINESS.name,
      locale: locale === "uk" ? "uk_UA" : "en_US",
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    robots: { index: true, follow: true },
  };
}

export function localBusinessJsonLd(locale: Locale) {
  const dict = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@type": "AutoDetailing",
    name: BUSINESS.name,
    description: dict.meta.description,
    url: SITE_URL,
    telephone: BUSINESS.phone,
    priceRange: "₴₴",
    image: `${SITE_URL}/og.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.zip,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.lat,
      longitude: BUSINESS.geo.lng,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: BUSINESS.hours.open,
      closes: BUSINESS.hours.close,
    },
    sameAs: [BUSINESS.instagram, BUSINESS.googleMaps],
  };
}

export function faqJsonLd(locale: Locale) {
  const dict = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
