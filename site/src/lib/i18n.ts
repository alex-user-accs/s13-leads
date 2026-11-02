import uk from "@/dictionaries/uk.json";
import en from "@/dictionaries/en.json";

export const locales = ["uk", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "uk";

const dictionaries = { uk, en } as const;

export type Dictionary = typeof uk;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] as Dictionary;
}

export function localePath(locale: Locale, anchor = ""): string {
  const base = locale === defaultLocale ? "/" : "/en";
  return anchor ? `${base}#${anchor}` : base;
}
