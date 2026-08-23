import { AgentationToolbar } from "@/components/AgentationToolbar";
import localFont from "next/font/local";
import "./globals.css";
import { metadata, profilePageJsonLd } from "./metadata";

export { metadata };

const openRunde = localFont({
  src: "./fonts/open-runde-latin-subset-400.woff2",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  preload: true,
  variable: "--font-open-runde",
  weight: "400",
});

const themeScript = `
  (() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = (isDark) => {
      document.documentElement.classList.toggle('dark', isDark);
      document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', isDark ? '#111110' : '#f6f5f2');
    };

    applyTheme(query.matches);
    query.addEventListener('change', (event) => applyTheme(event.matches));
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={openRunde.variable}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#f6f5f2" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(profilePageJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <div
          className="flex min-h-dvh justify-center overflow-x-hidden overflow-y-auto"
          style={{ backgroundColor: "var(--bg-outer)" }}
        >
          <main
            className="relative z-0 w-full max-w-lg px-6 py-16 sm:py-20"
            style={{ backgroundColor: "var(--bg-content)" }}
          >
            {children}
          </main>
        </div>
        {process.env.NODE_ENV === "development" ? (
          <AgentationToolbar />
        ) : null}
      </body>
    </html>
  );
}
