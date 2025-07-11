import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "../components/CustomCursor";

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
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
