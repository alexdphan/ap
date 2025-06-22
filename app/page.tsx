import React from "react";
import RetroCarousel from "../components/RetroCarousel";
import { videoItems } from "../data/videos";
import Link from "next/link";

export default function Home() {
  // Navigation links data
  const navigationLinks = [
    { href: "/projects", label: "Projects" },
    { href: "/memos", label: "Memos" },
  ];

  // Footer links data
  const footerLinks = [
    { 
      href: "https://www.linkedin.com/in/alexanderdphan/", 
      label: "LinkedIn",
      external: true 
    },
    { 
      href: "https://x.com/alexdphan", 
      label: "X",
      external: true 
    },
    { 
      href: "mailto:alexphan0515@gmail.com", 
      label: "Email",
      external: false 
    },
    { 
      href: "https://github.com/alexdphan", 
      label: "GitHub",
      external: true 
    },
  ];

  // Shared link styling
  const linkClassName = "relative text-base font-normal text-foreground tracking-wide hover:text-white transition-colors cursor-pointer overflow-hidden group px-2 py-1 underline decoration-foreground/50 hover:decoration-white underline-offset-4";
  const footerLinkClassName = "relative text-foreground font-normal tracking-wide hover:text-white transition-colors overflow-hidden group px-2 py-1 mx-2 underline decoration-foreground/50 hover:decoration-white underline-offset-4";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - Attached to Top */}
      <div className="max-w-4xl mx-auto w-full px-6 pt-6 md:pt-12">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="text-6xl md:text-6xl font-bold text-foreground/10 tracking-tighter hover:text-accent-green transition-colors duration-300 cursor-pointer">
              [ AP ]
            </div>

            {/* Projects + Memos Stack */}
            <div className="flex flex-col gap-2 text-right">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClassName}
                >
                  <span className="relative z-10 group-hover:text-white transition-colors">{link.label}</span>
                  <div className="absolute inset-0 bg-accent-green transform translate-x-[101%] group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Center */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6">
        <div className="max-w-xl mx-auto flex flex-col gap-12 md:gap-15 py-12 md:py-16">
          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight tracking-tight">
            Alex Phan
          </h1>

          {/* Carousel */}
          <RetroCarousel items={videoItems} />

          {/* Description Section */}
          <div>
            {/* <h3 className="text-sm text-foreground/60 mb-4 md:mb-6 tracking-wide">
              Description
            </h3> */}
            <p className="text-foreground text-base md:text-lg leading-relaxed">
              I spend a lot of my time thinking about what backdoors are
              overlooked or unseen.
            </p>
            <p className="text-foreground text-base md:text-lg leading-relaxed mt-4">
              I&apos;m also the first growth engineer at Browserbase, an
              exciting startup in San Francisco.
            </p>
            {/* <p className="text-foreground text-base md:text-lg leading-relaxed mt-4">
             DM if you&apos;d like to chat!
            </p> */}
          </div>
        </div>
      </div>

      {/* Footer - Attached to Bottom */}
      <div className="max-w-4xl mx-auto w-full px-6 pb-6 md:pb-12">
        <div className="max-w-xl mx-auto">
          <div className="flex flex-wrap justify-start -mx-2">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
                className={footerLinkClassName}
              >
                <span className="relative z-10 group-hover:text-white transition-colors">{link.label}</span>
                <div className="absolute inset-0 bg-accent-green transform translate-x-[101%] group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
