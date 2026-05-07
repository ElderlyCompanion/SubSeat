export default function sitemap() {
  const base = "https://subseat.co.uk";
  const now  = new Date();

  return [
    /* ── CORE PAGES ── */
    { url: base,                               lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/discover`,                 lastModified: now, changeFrequency: "daily",   priority: 0.95 },
    { url: `${base}/finance`,                  lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/insurance`,                lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/marketplace`,              lastModified: now, changeFrequency: "daily",   priority: 0.9 },

    /* ── BUSINESS PAGES ── */
    { url: `${base}/business/revenue-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },

    /* ── CATEGORIES ── */
    { url: `${base}/barbers`,                  lastModified: now, changeFrequency: "weekly",  priority: 0.85 },
    { url: `${base}/hair-salons`,              lastModified: now, changeFrequency: "weekly",  priority: 0.85 },
    { url: `${base}/nail-technicians`,         lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/lash-artists`,             lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/beauty-salons`,            lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/massage`,                  lastModified: now, changeFrequency: "weekly",  priority: 0.8 },

    /* ── LEGAL + INFO ── */
    { url: `${base}/about`,                    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`,                  lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`,                  lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/terms`,                    lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];
}