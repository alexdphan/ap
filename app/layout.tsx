import type { Metadata } from "next";
import "./globals.css";
import PageTransition from "./PageTransition";
import NavigationHandler from "./NavigationHandler";

export const metadata: Metadata = {
  title: "Alex Phan (AP)",
  description: "Alex Phan (AP)",
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
