import type { Metadata } from "next";
import { BUSINESS, SERVICE_GROUPS, type ServiceItem } from "./constants";
import { getDictionary, localePath, type Locale } from "./i18n";
import { fillPrices } from "./prices";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://s13-detailing.vercel.app";

const BUSINESS_ID = `${SITE_URL}/#business`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const OG_LOCALE = { uk: "uk_UA", en: "en_US" } as const;

export function buildMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  const path = localePath(locale);
  const description = fillPrices(dict.meta.description);
  const ogImage = { url: "/og.png", width: 1200, height: 630, alt: BUSINESS.name };
  const verification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  return {
    metadataBase: new URL(SITE_URL),
    title: dict.meta.title,
    description,
    alternates: {
      canonical: path,
      languages: { uk: "/", en: "/en", "x-default": "/" },
    },
    openGraph: {
      title: dict.meta.title,
      description,
      url: path,
      siteName: BUSINESS.name,
      locale: OG_LOCALE[locale],
      alternateLocale: OG_LOCALE[locale === "uk" ? "en" : "uk"],
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description,
      images: [ogImage.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    ...(verification && { verification: { google: verification } }),
  };
}

function offerJsonLd(item: ServiceItem, name: string) {
  const offer = { "@type": "Offer", itemOffered: { "@type": "Service", name } };
  if (!item.price) return offer;
  const price = item.priceMax
    ? { minPrice: item.price, maxPrice: item.priceMax }
    : item.from
      ? { minPrice: item.price }
      : { price: item.price };
  return {
    ...offer,
    priceSpecification: { "@type": "PriceSpecification", priceCurrency: "UAH", ...price },
  };
}

function businessJsonLd(locale: Locale) {
  const dict = getDictionary(locale);
  const names = dict.services.items as Record<string, string>;
  return {
    // schema.org has no detailing type; AutoWash is the closest
    // AutomotiveBusiness subtype for washing, cleaning and polishing.
    "@type": "AutoWash",
    "@id": BUSINESS_ID,
    name: BUSINESS.name,
    alternateName: "S13",
    description: fillPrices(dict.meta.description),
    url: SITE_URL,
    telephone: BUSINESS.phone,
    priceRange: "₴₴",
    currenciesAccepted: "UAH",
    logo: `${SITE_URL}/logo.png`,
    image: [`${SITE_URL}/photos/hero.jpg`, `${SITE_URL}/og.png`],
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
    hasMap: BUSINESS.googleMaps,
    areaServed: { "@type": "City", name: BUSINESS.address.city },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: BUSINESS.hours.open,
      closes: BUSINESS.hours.close,
    },
    sameAs: [BUSINESS.instagram, BUSINESS.googleMaps],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: dict.services.fullPrice,
      itemListElement: SERVICE_GROUPS.map((group) => ({
        "@type": "OfferCatalog",
        name: dict.services.groups[group.id].title,
        itemListElement: group.items.map((item) => offerJsonLd(item, names[item.id])),
      })),
    },
  };
}

/** One @graph per page: the business, the website and the FAQ. */
export function jsonLdGraph(locale: Locale) {
  const dict = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@graph": [
      businessJsonLd(locale),
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: BUSINESS.name,
        inLanguage: locale === "uk" ? "uk-UA" : "en",
        publisher: { "@id": BUSINESS_ID },
      },
      {
        "@type": "FAQPage",
        inLanguage: locale === "uk" ? "uk-UA" : "en",
        mainEntity: dict.faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: fillPrices(item.a) },
        })),
      },
    ],
  };
}
