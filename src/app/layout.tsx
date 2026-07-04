import type { Metadata, Viewport } from "next";
import "./globals.css";
import { personal } from "@/data/resume";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";

const SITE_URL = "https://sushantzd.github.io";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Sushant Choudhary — AI Engineer",
  description: personal.tagline,
  keywords: [
    "AI Engineer",
    "Machine Learning",
    "Generative AI",
    "LLM",
    "RAG",
    "NLP",
    "FastAPI",
    "Python",
    "Vector Databases",
  ],
  authors: [{ name: personal.name }],
  creator: personal.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Sushant Choudhary — AI Engineer",
    description: personal.tagline,
    siteName: "Sushant Choudhary — SYNAPSE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sushant Choudhary — AI Engineer",
    description: personal.tagline,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05060b",
  width: "device-width",
  initialScale: 1,
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personal.name,
  jobTitle: personal.role,
  email: `mailto:${personal.email}`,
  telephone: personal.phone,
  url: SITE_URL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "New Delhi",
    addressCountry: "IN",
  },
  sameAs: [
    personal.socials.github,
    personal.socials.linkedin,
    personal.socials.hackerrank,
    personal.socials.linktree,
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "Machine Learning",
    "Generative AI",
    "Large Language Models",
    "Retrieval-Augmented Generation",
    "Natural Language Processing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Fonts: General Sans + Satoshi (Fontshare, SEPARATE links per family —
            a combined multi-family Fontshare URL silently drops one), JetBrains Mono (Google) */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body>
        <SmoothScroll>
          <CustomCursor />
          <ScrollProgress />
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
