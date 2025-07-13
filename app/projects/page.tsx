import React from "react";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import AnimatedSection from "../../components/AnimatedSection";
import projectsData from "../../data/projects.json";

export default function Projects() {
  return (
    <div className="min-h-screen">
      <div className="py-6">
        <SiteHeader />
        <div className="max-w-4xl mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            {/* Page Title & Description */}
            <AnimatedSection delay={0.2} className="mb-16 mt-16">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight tracking-tight">
                Projects
              </h1>
              <p className="text-foreground/60 text-lg leading-relaxed">
                Product work and experiments in design systems, growth
                engineering, and user experience.
              </p>
            </AnimatedSection>

            {/* Projects Content */}
            <div className="space-y-16">
              <AnimatedSection delay={0.3}>
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-8 tracking-wide border-b border-foreground/10 pb-3">
                    Recent Work
                  </h2>
                  <div className="space-y-10">
                    {projectsData.map((project) => (
                      <article key={project.id} className="group">
                        <div className="text-xs text-foreground/40 mb-3 font-medium tracking-wide">
                          {project.date} • {project.category}
                        </div>
                        <Link href={project.href} className="block">
                          <h3 className="text-foreground font-medium mb-3 group-hover:text-accent-green transition-colors leading-tight">
                            {project.title}
                          </h3>
                          <p className="text-foreground/70 leading-relaxed group-hover:text-foreground/80 transition-colors">
                            {project.description}
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
                    Experiments
                  </h2>
                  <div className="space-y-6">
                    <div className="text-foreground/60 leading-relaxed">
                      <p className="mb-4">
                        Ongoing experiments in design systems, animation, and
                        user interaction.
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
                  <h2 className="text-lg font-semibold text-foreground mb-8 tracking-wide border-b border-foreground/10 pb-3">
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
        <AnimatedSection delay={0.6} className="mt-20">
          <SiteFooter />
        </AnimatedSection>
      </div>
    </div>
  );
}
