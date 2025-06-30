import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alex Phan (AP)",
  description: "Alex Phan (AP)",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
