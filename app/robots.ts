import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/profile", "/api/"],
      },
    ],
    sitemap: "https://shadcn-dir.vercel.app/sitemap.xml",
  };
}
