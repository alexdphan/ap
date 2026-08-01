import type { Metadata } from "next";

export const siteUrl = "https://alexdphan.com";

const description =
  "Alex Phan is an angel investor and growth advisor focused on elegantly simple, overlooked opportunities. Previously a growth engineer at Rho and Browserbase.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Alex Phan — Angel Investor & Growth Advisor",
  description,
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "Alex Phan", url: "/" }],
  creator: "Alex Phan",
  publisher: "Alex Phan",
  category: "technology",
  openGraph: {
    title: "Alex Phan — Angel Investor & Growth Advisor",
    description,
    url: "/",
    siteName: "Alex Phan",
    images: [
      {
        url: "/opengraph-image.png",
        width: 5120,
        height: 2880,
        alt: "AP — Alex Phan",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alex Phan — Angel Investor & Growth Advisor",
    description,
    creator: "@alexdphan",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: siteUrl,
  name: "Alex Phan",
  description,
  mainEntity: {
    "@type": "Person",
    "@id": `${siteUrl}/#alex-phan`,
    name: "Alex Phan",
    alternateName: "@alexdphan",
    url: siteUrl,
    image: `${siteUrl}/alex.jpg`,
    description,
    sameAs: [
      "https://linkedin.com/in/alexanderdphan",
      "https://x.com/alexdphan",
    ],
    knowsAbout: [
      "Angel investing",
      "Growth advising",
      "Growth engineering",
      "Startups",
    ],
  },
};
