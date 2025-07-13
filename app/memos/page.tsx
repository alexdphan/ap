import React from "react";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import AnimatedSection from "../../components/AnimatedSection";
import memosData from "../../data/memos.json";

export default function Memos() {
  return (
    <div className="min-h-screen">
      <div className="py-6">
        <SiteHeader />
        <div className="max-w-4xl mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            {/* Page Title & Description */}
            <AnimatedSection delay={0.2} className="mb-16 mt-16">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight tracking-tight">
                Memos
              </h1>
              <p className="text-foreground/60 text-lg leading-relaxed">
                Short-form thoughts and observations on design, technology, and
                growth.
              </p>
            </AnimatedSection>

            {/* Memos Content */}
            <div className="space-y-16">
              <AnimatedSection delay={0.3}>
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-8 tracking-wide border-b border-foreground/10 pb-3">
                    Recent Thoughts
                  </h2>
                  <div className="space-y-10">
                    {memosData.map((memo) => (
                      <article key={memo.id} className="group">
                        <div className="text-xs text-foreground/40 mb-3 font-medium tracking-wide">
                          {memo.date}
                        </div>
                        <Link href={memo.href} className="block">
                          <h3 className="text-foreground font-medium mb-3 group-hover:text-accent-green transition-colors leading-tight">
                            {memo.title}
                          </h3>
                          <p className="text-foreground/70 leading-relaxed group-hover:text-foreground/80 transition-colors">
                            {memo.description}
                          </p>
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.4}>
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-8 tracking-wide border-b border-foreground/10 pb-3">
                    Archive
                  </h2>
                  <p className="text-foreground/60 leading-relaxed">
                    More thoughts and observations coming soon...
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>

        {/* Footer */}
        <AnimatedSection delay={0.5} className="mt-20">
          <SiteFooter />
        </AnimatedSection>
      </div>
    </div>
  );
}
