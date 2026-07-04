import type { MetadataRoute } from "next";

/**
 * Allow all crawlers; point them at the sitemap. Emitted as
 * `out/robots.txt` on static export (`output: 'export'`).
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://sushantzd.github.io/sitemap.xml",
    host: "https://sushantzd.github.io",
  };
}
