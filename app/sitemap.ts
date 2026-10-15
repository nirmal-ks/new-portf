import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/resume`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
