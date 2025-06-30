import React from 'react';
import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import AnimatedSection from '../../components/AnimatedSection';

export default function Memos() {
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
              Memos
            </h1>
            <p className="text-foreground/60 text-lg leading-relaxed">
              Short-form thoughts and observations on design, technology, and growth.
            </p>
          </AnimatedSection>

          {/* Memos Content */}
          <div className="space-y-12">
            <AnimatedSection delay={0.3}>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-6 tracking-wide border-b border-foreground/10 pb-2">
                  Recent Thoughts
                </h2>
                <div className="space-y-8">
                <article className="group">
                  <div className="text-xs text-foreground/40 mb-2 font-medium tracking-wide">DEC 2024</div>
                  <Link 
                    href="/memos/parallax-design-testing"
                    className="block"
                  >
                    <h3 className="text-foreground font-medium mb-2 group-hover:text-accent-green transition-colors leading-tight">
                      Parallax Design Testing
                    </h3>
                    <p className="text-foreground/70 leading-relaxed group-hover:text-foreground/80 transition-colors">
                      Testing parallax scrolling effects with images and content - exploring how 
                      visual depth can enhance the reading experience.
                    </p>
                  </Link>
                </article>
                
                <article className="group">
                  <div className="text-xs text-foreground/40 mb-2 font-medium tracking-wide">DEC 2024</div>
                  <Link 
                    href="/memos/backdoors-overlooked"
                    className="block"
                  >
                    <h3 className="text-foreground font-medium mb-2 group-hover:text-accent-green transition-colors leading-tight">
                      Backdoors Overlooked
                    </h3>
                    <p className="text-foreground/70 leading-relaxed group-hover:text-foreground/80 transition-colors">
                      The backdoors that are often overlooked are usually the most obvious ones - 
                      the patterns we dismiss because they seem too simple or too direct.
                    </p>
                  </Link>
                </article>
                
                <article className="group">
                  <div className="text-xs text-foreground/40 mb-2 font-medium tracking-wide">NOV 2024</div>
                  <Link 
                    href="/memos/growth-engineering-systems"
                    className="block"
                  >
                    <h3 className="text-foreground font-medium mb-2 group-hover:text-accent-green transition-colors leading-tight">
                      Growth Engineering Systems
                    </h3>
                    <p className="text-foreground/70 leading-relaxed group-hover:text-foreground/80 transition-colors">
                      Growth engineering isn&apos;t just about metrics - it&apos;s about building systems 
                      that make the right behaviors feel natural and inevitable.
                    </p>
                  </Link>
                </article>

                <article className="group">
                  <div className="text-xs text-foreground/40 mb-2 font-medium tracking-wide">NOV 2024</div>
                  <Link 
                    href="/memos/interfaces-extensions-thought"
                    className="block"
                  >
                    <h3 className="text-foreground font-medium mb-2 group-hover:text-accent-green transition-colors leading-tight">
                      Interfaces as Extensions of Thought
                    </h3>
                    <p className="text-foreground/70 leading-relaxed group-hover:text-foreground/80 transition-colors">
                      The best interfaces don&apos;t feel like interfaces at all. They feel like 
                      extensions of thought.
                    </p>
                  </Link>
                </article>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-6 tracking-wide border-b border-foreground/10 pb-2">
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
        <AnimatedSection delay={0.5} className="mt-16">
          <SiteFooter />
        </AnimatedSection>
      </div>
    </div>
  );
} 