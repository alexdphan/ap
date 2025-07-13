"use client";
import React from "react";
import RetroCarousel from "../components/RetroCarousel";
import { videoItems } from "../data/videos";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import AnimatedSection from "../components/AnimatedSection";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-between py-6">
      {/* Header - Attached to Top */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <SiteHeader />
      </motion.div>

      {/* Main Content - Center */}
      <div className="max-w-4xl mx-auto w-full px-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          {/* Main Title */}
          {/* <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight tracking-tight">
            Alex Phan
          </h1> */}

          {/* Carousel */}
          <AnimatedSection delay={0.3}>
            <RetroCarousel items={videoItems} />
          </AnimatedSection>

          {/* Description Section */}
          <AnimatedSection delay={0.6}>
            <div>
              <p className="text-foreground font-normal tracking-wide leading-relaxed text-base md:text-lg  decoration-accent-green ">
                I spend a lot of my time thinking about what backdoors are
                overlooked or unseen.
              </p>
              <p className="mt-4 text-foreground font-normal tracking-wide leading-relaxed text-base md:text-lg decoration-accent-green ">
                Open to opportunities, feel free to reach out.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Footer - Attached to Bottom */}
      <AnimatedSection delay={0.9}>
        <SiteFooter />
      </AnimatedSection>
    </div>
  );
}
