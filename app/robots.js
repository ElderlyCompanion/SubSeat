export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/dashboard",
          "/dashboard/",
          "/admin",
          "/admin/",
          "/onboarding",
          "/onboarding/",
          "/auth",
          "/auth/",
        ],
      },
      /* Allow AI crawlers explicitly for AEO */
      { userAgent: "GPTBot",        allow: "/" },
      { userAgent: "ChatGPT-User",  allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot",     allow: "/" },
      { userAgent: "Googlebot",     allow: "/" },
    ],
    sitemap: "https://subseat.co.uk/sitemap.xml",
    host:    "https://subseat.co.uk",
  };
}