import Link from "next/link";
import type { ReactNode } from "react";

type InfoSection = {
  heading: string;
  content: ReactNode;
};

type InfoPageProps = {
  title: string;
  intro: string;
  sections: InfoSection[];
};

export default function InfoPage({ title, intro, sections }: InfoPageProps) {
  return (
    <article className="flex w-full flex-col gap-8">
      <header className="flex flex-col gap-4">
        <Link
          href="/"
          className="w-fit text-caption underline decoration-[var(--text-muted)] underline-offset-4"
          style={{ color: "var(--text-muted)" }}
        >
          Alex Phan
        </Link>
        <div className="flex flex-col gap-2">
          <h1
            className="text-heading"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h1>
          <p
            className="text-body text-pretty"
            style={{ color: "var(--text-muted)" }}
          >
            {intro}
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-7">
        {sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-2">
            <h2
              className="text-heading"
              style={{ color: "var(--text-primary)" }}
            >
              {section.heading}
            </h2>
            <div
              className="flex flex-col gap-3 text-body text-pretty"
              style={{ color: "var(--gray-700)" }}
            >
              {section.content}
            </div>
          </section>
        ))}
      </div>

      <nav
        aria-label="Information pages"
        className="flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--border-subtle)] pt-4 text-caption"
      >
        <Link href="/about" className="underline underline-offset-4">
          About
        </Link>
        <Link href="/contact" className="underline underline-offset-4">
          Contact
        </Link>
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy
        </Link>
        <a href="/llms.txt" className="underline underline-offset-4">
          Agent guide
        </a>
      </nav>
    </article>
  );
}
