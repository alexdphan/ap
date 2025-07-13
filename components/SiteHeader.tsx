import Link from "next/link";

interface SiteHeaderProps {
  titleColor?: string;
}

export default function SiteHeader({
  titleColor = "text-accent-green",
}: SiteHeaderProps) {
  const navigationLinks = [
    { href: "/projects", label: "Projects" },
    { href: "/memos", label: "Memos" },
  ];

  const linkClassName =
    "relative text-base font-normal text-foreground tracking-wide hover:text-white transition-colors cursor-pointer overflow-hidden group py-1 underline decoration-accent-green underline-offset-4";

  return (
    <div className="max-w-4xl mx-auto w-full px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className={`text-5xl md:text-5xl font-bold tracking-tighter hover:text-accent-green ap-title-animate cursor-pointer ${titleColor}`}
          >
            [ AP ]
          </Link>

          {/* Projects + Memos Stack */}
          <div className="flex flex-col gap-1 text-right justify-center">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClassName}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
