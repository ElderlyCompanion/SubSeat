export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      /* Allow AI crawlers explicitly for AEO */
      { userAgent: "GPTBot",        allow: "/" },
      { userAgent: "ChatGPT-User",  allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot",     allow: "/" },
      { userAgent: "Googlebot",     allow: "/" },
    ],
    sitemap: "https://subseat.com/sitemap.xml",
    host: "https://subseat.com",
  };
}