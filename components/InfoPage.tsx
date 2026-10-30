import Link from "next/link";
import type { ReactNode } from "react";

type InfoSection = {
  heading: string;
  content: ReactNode;
};

const INFO_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
];

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
          className="touch-target w-fit text-caption underline decoration-[var(--text-muted)] underline-offset-4"
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
        {INFO_LINKS.map((link) => {
          const isCurrent = link.label === title;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isCurrent ? "page" : undefined}
              className="touch-target underline underline-offset-4 aria-[current=page]:no-underline"
              style={isCurrent ? { color: "var(--text-muted)" } : undefined}
            >
              {link.label}
            </Link>
          );
        })}
        <a href="/llms.txt" className="touch-target underline underline-offset-4">
          Agent guide
        </a>
      </nav>
    </article>
  );
}
