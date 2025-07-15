import React from "react";
import Link from "next/link";
import Image from "next/image";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import AnimatedSection from "../../components/AnimatedSection";
import investmentsData from "../../data/investments.json";

export default function Investments() {
  return (
    <div className="min-h-screen">
      <div className="py-6">
        <SiteHeader />
        <div className="max-w-4xl mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            {/* Page Title & Description */}
            <AnimatedSection delay={0.2} className="mb-16 mt-16">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight tracking-tight">
                Investments
              </h1>
              <p className="text-foreground/60 text-lg leading-relaxed">
                Early-stage investments in companies building the future of
                developer tools, automation, platform, and infrastructure.
              </p>
            </AnimatedSection>

            {/* Investments Content */}
            <div className="space-y-16">
              <AnimatedSection delay={0.3}>
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-8 tracking-wide border-b border-foreground/10 pb-3">
                    Portfolio
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {investmentsData.map((investment) => (
                      <article key={investment.id} className="group">
                        {/* <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-foreground/50 font-medium tracking-wider uppercase">
                              {investment.date}
                            </span>
                          </div>
                          <span className="hidden sm:block text-xs text-foreground/20">
                            •
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-foreground/50 font-medium tracking-wide bg-foreground/3 px-2 py-1 border border-foreground/5">
                              {investment.category}
                            </span>
                          </div>
                        </div> */}

                        <Link
                          href={investment.href}
                          className="block"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <h3 className="text-foreground font-medium mb-3 group-hover:text-accent-green transition-colors leading-tight flex items-center gap-2">
                            {investment.icon && (
                              <Image
                                src={investment.icon}
                                alt={investment.title}
                                width={18}
                                height={18}
                                className="flex-shrink-0"
                              />
                            )}
                            <span>{investment.title}</span>
                          </h3>
                          <p className="text-foreground/70 leading-relaxed group-hover:text-foreground/80 transition-colors">
                            {investment.description}
                          </p>
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>

        {/* Footer */}
        <AnimatedSection delay={0.4} className="mt-20">
          <SiteFooter />
        </AnimatedSection>
      </div>
    </div>
  );
}
