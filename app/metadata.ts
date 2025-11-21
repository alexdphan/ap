import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alex Phan",
  description: "Growth engineer, angel investor, and startup advisor.",
  openGraph: {
    title: "Alex Phan",
    description: "Growth engineer, angel investor, and startup advisor.",
    url: "https://alexdphan.com",
    siteName: "Alex Phan",
    images: [
      {
        url: "/AP.png",
        width: 1200,
        height: 630,
        alt: "Alex Phan",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alex Phan",
    description: "Growth engineer, angel investor, and startup advisor.",
    images: ["/AP.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

