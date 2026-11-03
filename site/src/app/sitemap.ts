import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const PHOTOS = [
  "hero.jpg",
  "before.jpg",
  "after.jpg",
  ...Array.from({ length: 6 }, (_, i) => `gallery-${i + 1}.webp`),
].map((file) => `${SITE_URL}/photos/${file}`);

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const languages = { uk: `${SITE_URL}/`, en: `${SITE_URL}/en` };
  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages },
      images: PHOTOS,
    },
    {
      url: `${SITE_URL}/en`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages },
    },
  ];
}
