import type { Metadata, Viewport } from "next";
import "./globals.css";
import CustomCursor from "../components/CustomCursor";

export const metadata: Metadata = {
  title: "Alex Phan (AP)",
  description: "Alex Phan (AP)",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
