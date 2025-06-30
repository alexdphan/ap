"use client";
import React from "react";
import RetroCarousel from "../components/RetroCarousel";
import { videoItems } from "../data/videos";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import AnimatedSection from "../components/AnimatedSection";

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-between py-6">
      {/* Header - Attached to Top */}
      <SiteHeader />

      {/* Main Content - Center */}
      <div className="max-w-4xl mx-auto w-full px-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          {/* Main Title */}
          {/* <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight tracking-tight">
            Alex Phan
          </h1> */}

          {/* Carousel */}
          <AnimatedSection delay={0.2}>
            <RetroCarousel items={videoItems} />
          </AnimatedSection>

          {/* Description Section */}
          <AnimatedSection delay={0.3}>
            <div>
              {/* <h3 className="text-sm text-foreground/60 mb-4 md:mb-6 tracking-wide">
                Description
              </h3> */}
              <p className="text-foreground/70 leading-relaxed group-hover:text-foreground/80 transition-colors text-lg">
                I spend a lot of my time thinking about what backdoors are
                overlooked or unseen.
              </p>
              <p className="mt-2 text-foreground/70 leading-relaxed group-hover:text-foreground/80 transition-colors text-lg">
              Open to opportunities, feel free to reach out
              </p>
              {/* <p className="text-foreground text-base md:text-lg leading-relaxed mt-2">
                I&apos;m also the first growth engineer at Browserbase, an
                exciting startup in San Francisco.
              </p> */}
              {/* <p className="text-foreground text-base md:text-lg leading-relaxed mt-4">
               DM if you&apos;d like to chat!
              </p> */}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Footer - Attached to Bottom */}
      <AnimatedSection delay={0.4}>
        <SiteFooter />
      </AnimatedSection>
    </div>
  );
}
