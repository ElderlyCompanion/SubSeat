import CookieBanner from "./components/CookieBanner";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
});

/* ── SEO METADATA ── */
export const metadata = {
  /* BASIC */
  title: {
    default: "SubSeat — The Subscription Booking Platform for Beauty Professionals",
    template: "%s | SubSeat",
  },
  description:
    "SubSeat is the UK's subscription booking platform for barbers, salons, nail techs, lash artists and beauty professionals. Customers book smarter. Businesses earn predictable monthly income.",
  keywords: [
    "subscription booking platform",
    "barber subscription",
    "salon membership app",
    "nail tech booking",
    "lash artist subscription",
    "beauty professional platform",
    "recurring revenue barbers",
    "no show solution barbers",
    "book barber online UK",
    "salon booking app UK",
    "SubSeat",
    "beauty subscription UK",
    "membership booking platform",
  ],
  authors: [{ name: "SubSeat Ltd", url: "https://subseat.co.uk" }],
  creator: "SubSeat Ltd",
  publisher: "SubSeat Ltd",
  category: "Beauty & Wellness Technology",

  /* CANONICAL */
  metadataBase: new URL("https://subseat.co.uk"),
  alternates: {
    canonical: "/",
  },

  /* OPEN GRAPH — controls how SubSeat looks when shared on WhatsApp, LinkedIn, Facebook */
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://subseat.co.uk",
    siteName: "SubSeat",
    title: "SubSeat — Your Seat, Your Subscription",
    description:
      "The smarter way to book barbers, salons and beauty professionals — while helping businesses earn predictable monthly income through memberships.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SubSeat — The Subscription Booking Platform",
      },
    ],
  },

  /* TWITTER / X CARD */
  twitter: {
    card: "summary_large_image",
    title: "SubSeat — Your Seat, Your Subscription",
    description:
      "The UK's subscription booking platform for barbers, salons, nail techs and beauty professionals.",
    images: ["/og-image.png"],
    creator: "@SubSeat",
    site: "@SubSeat",
  },

  /* ROBOTS */
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* APP / PWA */
  applicationName: "SubSeat",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SubSeat",
  },

  /* VERIFICATION */
  verification: {
    google: "5pvbnbVURc5qCI8wf-gA6B6m8RuCyPlex7pIhbWWxBs",
  },

  /* ICONS — updated to include SVG favicon */
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

/* ── AEO STRUCTURED DATA (Schema.org JSON-LD) ──
   This tells AI engines — ChatGPT, Perplexity, Google SGE, Claude —
   exactly what SubSeat is, who it serves, and how it works.
*/
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    /* 1. ORGANISATION */
    {
      "@type": "Organization",
      "@id": "https://subseat.co.uk/#organization",
      name: "SubSeat",
      url: "https://subseat.co.uk",
      logo: {
        "@type": "ImageObject",
        url: "https://subseat.co.uk/logo.png",
        width: 200,
        height: 200,
      },
      description:
        "SubSeat is the UK's subscription-based booking platform for barbers, salons, nail technicians, lash artists and beauty professionals. Customers subscribe monthly for priority access. Businesses earn predictable recurring revenue.",
      foundingLocation: {
        "@type": "Place",
        addressCountry: "GB",
      },
      areaServed: "GB",
      sameAs: [
        "https://twitter.com/SubSeat",
        "https://instagram.com/subseat",
        "https://linkedin.com/company/subseat",
      ],
    },

    /* 2. SOFTWARE APPLICATION */
    {
      "@type": "SoftwareApplication",
      "@id": "https://subseat.co.uk/#software",
      name: "SubSeat",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, iOS, Android",
      url: "https://subseat.co.uk",
      description:
        "SubSeat is a subscription booking SaaS platform that enables beauty and wellness professionals to offer monthly membership plans to their customers, replacing one-off appointments with predictable recurring revenue.",
      offers: [
        {
          "@type": "Offer",
          name: "Basic Seat",
          price: "0",
          priceCurrency: "GBP",
          description: "Free to join. 6% platform fee on subscription revenue only.",
        },
        {
          "@type": "Offer",
          name: "Partner Seat",
          price: "39.99",
          priceCurrency: "GBP",
          description: "One-time founding fee. Advanced analytics, priority support and partner badge.",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "1",
        bestRating: "5",
      },
    },

    /* 3. WEBSITE */
    {
      "@type": "WebSite",
      "@id": "https://subseat.co.uk/#website",
      url: "https://subseat.co.uk",
      name: "SubSeat",
      description: "The subscription booking platform for beauty and wellness professionals in the UK.",
      publisher: { "@id": "https://subseat.co.uk/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://subseat.co.uk/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },

    /* 4. SERVICE */
    {
      "@type": "Service",
      "@id": "https://subseat.co.uk/#service",
      name: "SubSeat Subscription Booking Platform",
      provider: { "@id": "https://subseat.co.uk/#organization" },
      serviceType: "Subscription Booking Platform",
      areaServed: {
        "@type": "Country",
        name: "United Kingdom",
      },
      description:
        "SubSeat enables barbers, hair salons, nail technicians, lash artists, brow artists and wellness professionals to offer subscription membership plans. Customers pay monthly for unlimited or priority access. SubSeat charges a simple 6% platform fee on subscription revenue.",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "SubSeat Service Categories",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Barber Subscriptions" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hair Salon Memberships" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Nail Tech Subscriptions" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Lash Artist Memberships" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Brow Artist Subscriptions" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Massage Memberships" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Skincare Subscriptions" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wellness Memberships" } },
        ],
      },
    },

    /* 5. FAQ — AEO GOLD
       These Q&As are directly indexed by AI engines and voice search.
       When someone asks ChatGPT or Perplexity about SubSeat, these answers get surfaced.
    */
    {
      "@type": "FAQPage",
      "@id": "https://subseat.co.uk/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is SubSeat?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SubSeat is a UK-based subscription booking platform for barbers, salons, nail technicians, lash artists and beauty professionals. Customers subscribe monthly for priority booking access, and businesses earn predictable recurring revenue instead of relying on one-off appointments.",
          },
        },
        {
          "@type": "Question",
          name: "How does SubSeat work for customers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Customers search for beauty and wellness professionals on SubSeat, choose a monthly membership plan, and pay via Stripe. They get priority booking slots, WhatsApp and email reminders, and a unified calendar showing all their subscriptions in one place.",
          },
        },
        {
          "@type": "Question",
          name: "How does SubSeat work for businesses?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Businesses create a free profile on SubSeat in under 10 minutes, list their services and set monthly subscription prices. Customers subscribe and pay monthly. SubSeat charges a simple 6% platform fee on subscription revenue — there are no hidden monthly charges.",
          },
        },
        {
          "@type": "Question",
          name: "How much does SubSeat cost for businesses?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SubSeat is free to join. The platform charges a simple 6% fee only on subscription revenue earned. There are no monthly fees, no setup costs and no hidden charges. A Partner Seat founding plan is available for a one-time fee of £39.99.",
          },
        },
        {
          "@type": "Question",
          name: "Does SubSeat help reduce no-shows?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Because customers pay a monthly subscription upfront, the financial impact of no-shows is significantly reduced. Subscribers have already paid for the month, so missed appointments do not result in lost revenue for the business.",
          },
        },
        {
          "@type": "Question",
          name: "What makes SubSeat different from Booksy, Fresha and Treatwell?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SubSeat uses a subscription model rather than per-appointment booking, giving businesses predictable monthly income. SubSeat charges a simple 6% platform fee with no hidden charges, compared to up to 35% commission on other platforms. SubSeat also includes WhatsApp notifications, two-way calendar sync, and equal visibility for all businesses without pay-to-boost features.",
          },
        },
        {
          "@type": "Question",
          name: "Is SubSeat available across the UK?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. SubSeat is available to beauty and wellness professionals and customers across the United Kingdom, including London, Birmingham, Manchester, Leeds, Bristol and beyond.",
          },
        },
        {
          "@type": "Question",
          name: "Does SubSeat send WhatsApp reminders?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. SubSeat sends appointment reminders and booking confirmations via both WhatsApp and email to customers and businesses. WhatsApp notifications are included for all SubSeat businesses and is a key differentiator from other booking platforms.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB" className={poppins.variable}>
      <head>
        {/* AEO STRUCTURED DATA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* ADDITIONAL META */}
        <meta name="theme-color" content="#563BE7" />
        <meta name="msapplication-TileColor" content="#563BE7" />
        <meta name="geo.region" content="GB" />
        <meta name="geo.placename" content="United Kingdom" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />

        {/* PRECONNECT for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body>{children}<CookieBanner /></body>
    </html>
  );
}