import type { Metadata } from "next";
import "./globals.css";
import PageTransition from "./PageTransition";
import NavigationHandler from "./NavigationHandler";

export const metadata: Metadata = {
  title: "Alex Phan (AP)",
  description: "Alex Phan (AP)",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <NavigationHandler />
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
