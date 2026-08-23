import Link from "next/link";

export default function NotFound() {
  return (
    <article className="flex flex-col gap-4 text-body">
      <h1 className="text-heading" style={{ color: "var(--text-primary)" }}>
        Page not found
      </h1>
      <p className="text-pretty" style={{ color: "var(--text-muted)" }}>
        That address does not match a page on Alex Phan&apos;s site. Use one of
        these canonical routes instead.
      </p>
      <nav aria-label="Page recovery" className="flex flex-wrap gap-x-5 gap-y-2">
        <Link href="/" className="underline underline-offset-4">
          Home
        </Link>
        <Link href="/about" className="underline underline-offset-4">
          About
        </Link>
        <Link href="/contact" className="underline underline-offset-4">
          Contact
        </Link>
        <a href="/sitemap.xml" className="underline underline-offset-4">
          Sitemap
        </a>
        <a href="/llms.txt" className="underline underline-offset-4">
          Agent guide
        </a>
      </nav>
    </article>
  );
}
