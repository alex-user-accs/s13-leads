export const BUSINESS = {
  name: "S13 Detailing Studio",
  phone: "+380638065056",
  phoneDisplay: "+38 (063) 806 50 56",
  address: {
    street: "вул. Данила Нечая, 224а",
    city: "Вінниця",
    region: "Вінницька область",
    zip: "21012",
    country: "UA",
  },
  /** Must match the Google Business Profile pin (googleMaps link below). */
  geo: { lat: 49.2045062, lng: 28.4953615 },
  hours: { days: "Mo-Sa", open: "09:00", close: "18:00" },
  instagram: "https://www.instagram.com/s13.detailing.vn/",
  instagramHandle: "@s13.detailing.vn",
  googleMaps: "https://maps.app.goo.gl/ZH524FUUXQSXLawA7",
  email: "",
} as const;

export type ServiceGroupId = "cleaning" | "polishing" | "protection" | "extra";

/** Group ids shown as headline cards above the full price list. */
export const CARD_GROUP_IDS: ServiceGroupId[] = ["cleaning", "polishing", "protection"];

export interface ServiceItem {
  id: string;
  price: number | null;
  /** Upper bound of a price range, e.g. "від 1000 до 2000". */
  priceMax?: number;
  /** Price set individually with the owner, e.g. car pickup/delivery. */
  negotiable?: boolean;
  from: boolean;
}

export interface ServiceGroup {
  id: ServiceGroupId;
  /** Unused for groups outside CARD_GROUP_IDS. */
  priceFrom: number;
  items: ServiceItem[];
}

/** Placeholder prices — replace with owner's numbers (see SPEC.md §13). */
export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: "cleaning",
    priceFrom: 4000,
    items: [
      { id: "ozonation", price: 500, from: false },
      { id: "child-seat", price: 500, from: false },
      { id: "wool-removal", price: 500, from: false },
      { id: "conservants", price: 800, from: false },
      { id: "three-phase-wash", price: 800, from: false },
      { id: "light-cleaning", price: 1500, from: false },
      { id: "seat-cleaning", price: 1500, from: true },
      { id: "cleaning-basic", price: 4000, from: false },
      { id: "cleaning-full", price: 5000, from: true },
    ],
  },
  {
    id: "polishing",
    priceFrom: 5000,
    items: [
      { id: "headlights-polish", price: 800, from: false },
      { id: "polish-partial", price: 1000, from: true },
      { id: "headlights-grind", price: 2000, from: false },
      { id: "polish-1step", price: 5000, from: true },
      { id: "polish-3step", price: 8000, from: true },
      { id: "polish-deep", price: 11000, from: true },
    ],
  },
  {
    id: "protection",
    priceFrom: 5000,
    items: [
      { id: "bitumen-removal", price: 700, from: false },
      { id: "quick-ceramic", price: 800, from: false },
      { id: "metal-removal", price: 900, from: false },
      { id: "antirain", price: 1000, from: false },
      { id: "wax", price: 1000, priceMax: 2000, from: false },
      { id: "ceramic", price: 5000, from: true },
    ],
  },
  {
    id: "extra",
    priceFrom: 0,
    items: [{ id: "car-pickup", price: null, from: false, negotiable: true }],
  },
];

export const STATS = {
  cars: 568,
  years: 3,
  services: 22,
} as const;
