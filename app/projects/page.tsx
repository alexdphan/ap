import React from 'react';
import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import AnimatedSection from '../../components/AnimatedSection';

export default function Projects() {
  return (
    <div className="min-h-screen">
      <div className="py-6">
        <AnimatedSection delay={0.1}>
          <SiteHeader />
        </AnimatedSection>
        <div className="max-w-4xl mx-auto px-6">
          <div className="max-w-2xl mx-auto">

          {/* Page Title & Description */}
          <AnimatedSection delay={0.2} className="mb-12 md:mb-16 mt-12 md:mt-16">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight tracking-tight">
              Projects
            </h1>
            <p className="text-foreground/60 text-lg leading-relaxed">
              Product work and experiments in design systems, growth engineering, and user experience.
            </p>
          </AnimatedSection>

          {/* Projects Content */}
          <div className="space-y-12">
            <AnimatedSection delay={0.3}>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-6 tracking-wide border-b border-foreground/10 pb-2">
                  Recent Work
                </h2>
              <div className="space-y-8">
                <article className="group">
                  <div className="text-xs text-foreground/40 mb-2 font-medium tracking-wide">2024 • PRODUCT DESIGN</div>
                  <Link 
                    href="/projects/browserbase-growth"
                    className="block"
                  >
                    <h3 className="text-foreground font-medium mb-2 group-hover:text-accent-green transition-colors leading-tight">
                      Browserbase Growth
                    </h3>
                    <p className="text-foreground/70 leading-relaxed group-hover:text-foreground/80 transition-colors">
                      Scaling browser automation infrastructure through iterative product development, 
                      user feedback loops, and growth optimization strategies.
                    </p>
                  </Link>
                </article>
                
                <article className="group">
                  <div className="text-xs text-foreground/40 mb-2 font-medium tracking-wide">2024 • PROTOTYPING</div>
                  <Link 
                    href="/projects/rapid-prototyping"
                    className="block"
                  >
                    <h3 className="text-foreground font-medium mb-2 group-hover:text-accent-green transition-colors leading-tight">
                      Rapid Prototyping
                    </h3>
                    <p className="text-foreground/70 leading-relaxed group-hover:text-foreground/80 transition-colors">
                      Quick iteration cycles and experimental approaches to validate ideas fast. 
                      Building to learn, not just to ship.
                    </p>
                  </Link>
                </article>

                <article className="group">
                  <div className="text-xs text-foreground/40 mb-2 font-medium tracking-wide">2024 • INTERFACE DESIGN</div>
                  <Link 
                    href="/projects/experimental-interfaces"
                    className="block"
                  >
                    <h3 className="text-foreground font-medium mb-2 group-hover:text-accent-green transition-colors leading-tight">
                      Experimental Interfaces
                    </h3>
                    <p className="text-foreground/70 leading-relaxed group-hover:text-foreground/80 transition-colors">
                      Exploring unconventional interaction patterns and interface paradigms. 
                      How can design push beyond traditional expectations?
                    </p>
                  </Link>
                </article>
              </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-6 tracking-wide border-b border-foreground/10 pb-2">
                  Experiments
                </h2>
                <div className="space-y-6">
                  <div className="text-foreground/60 leading-relaxed">
                    <p className="mb-4">
                      Ongoing experiments in design systems, animation, and user interaction.
                    </p>
                    <div className="text-sm text-foreground/40 space-y-2">
                      <div>• Parallax scrolling systems</div>
                      <div>• Micro-interaction libraries</div>
                      <div>• AI-assisted design workflows</div>
                      <div>• Performance optimization techniques</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.5}>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-6 tracking-wide border-b border-foreground/10 pb-2">
                  Archive
                </h2>
                <p className="text-foreground/60 leading-relaxed">
                  Previous projects and case studies coming soon...
                </p>
              </div>
            </AnimatedSection>
          </div>

          </div>
        </div>
        
        {/* Footer */}
        <AnimatedSection delay={0.6} className="mt-16">
          <SiteFooter />
        </AnimatedSection>
      </div>
    </div>
  );
} 