import type { MetadataRoute } from "next";

/**
 * Single-page portfolio → one URL (the site root). Emitted as
 * `out/sitemap.xml` on static export (`output: 'export'`).
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://sushantzd.github.io",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
