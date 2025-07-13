export default function SiteFooter() {
  // Footer links data
  const footerLinks = [
    {
      href: "https://www.linkedin.com/in/alexanderdphan/",
      label: "LinkedIn",
      external: true,
    },
    {
      href: "https://x.com/alexdphan",
      label: "X",
      external: true,
    },
    {
      href: "mailto:alexphan0515@gmail.com",
      label: "Email",
      external: false,
    },
    {
      href: "https://github.com/alexdphan",
      label: "GitHub",
      external: true,
    },
  ];

  const footerLinkClassName =
    "relative text-foreground font-normal tracking-wide hover:text-white hover:bg-foreground/10 transition-all duration-200 overflow-hidden group py-1 mx-2 px-2 underline decoration-foreground underline-offset-4";

  return (
    <div className="max-w-4xl mx-auto w-full px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-wrap justify-start -mx-2">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              {...(link.external && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
              className={footerLinkClassName}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
