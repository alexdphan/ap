import React from "react";
import Link from "next/link";
import Image from "next/image";
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
                Work and experiments in systems, growth engineering, and user
                experience.
              </p>
            </AnimatedSection>

            {/* Projects Content */}
            <div className="space-y-16">
              <AnimatedSection delay={0.3}>
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-8 tracking-wide border-b border-foreground/10 pb-3">
                    Work
                  </h2>
                  <div className="space-y-10">
                    {projectsData.map((project) => (
                      <article key={project.id} className="group">
                        <div className="flex flex-row items-center gap-2 sm:gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-foreground/50 font-medium tracking-wider uppercase">
                              {project.date}
                            </span>
                          </div>
                          <span className="text-xs text-foreground/20">•</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-foreground/50 font-medium tracking-wide bg-foreground/3 px-2 py-1 border border-foreground/5">
                              {project.category}
                            </span>
                          </div>
                        </div>
                        <Link href={project.href} className="block">
                          <h3 className="text-foreground font-medium mb-3 group-hover:text-accent-green transition-colors leading-tight flex items-center gap-2">
                            {project.icon && (
                              <Image
                                src={project.icon}
                                alt={project.title}
                                width={18}
                                height={18}
                                className="flex-shrink-0"
                              />
                            )}
                            <span>{project.title}</span>
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
                        Experiments pre-2024, you can check it out{" "}
                        <Link
                          href="https://www.alexdphan.com/projects"
                          className="underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          here
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* <AnimatedSection delay={0.5}>
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-8 tracking-wide border-b border-foreground/10 pb-3">
                    Archive
                  </h2>
                  <p className="text-foreground/60 leading-relaxed">
                    Previous projects and case studies coming soon...
                  </p>
                </div>
              </AnimatedSection> */}
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
