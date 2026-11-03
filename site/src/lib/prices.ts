import { SERVICE_GROUPS } from "./constants";

export const fmt = (n: number) => n.toLocaleString("uk-UA");

const allItems = SERVICE_GROUPS.flatMap((group) => group.items);
const minPrice = Math.min(...allItems.flatMap((item) => (item.price ? [item.price] : [])));

/**
 * Replaces {price:<service-id>} and {minPrice} in copy with numbers from
 * SERVICE_GROUPS, so prices in text can't drift from the price list.
 * Throws on an unknown id, which fails the build instead of shipping a typo.
 */
export function fillPrices(text: string): string {
  return text
    .replace(/\{minPrice\}/g, fmt(minPrice))
    .replace(/\{price:([a-z0-9-]+)\}/g, (_, id: string) => {
      const item = allItems.find((i) => i.id === id);
      if (!item?.price) throw new Error(`Unknown or unpriced service in copy: ${id}`);
      return fmt(item.price);
    });
}
