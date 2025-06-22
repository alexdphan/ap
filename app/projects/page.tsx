import React from 'react';
import Link from 'next/link';

export default function Projects() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-6 md:py-12">
        <div className="max-w-xl mx-auto">
          
          {/* Header with back link */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <Link 
              href="/"
              className="text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              ← Back
            </Link>
            <div className="text-sm text-foreground/60">Projects</div>
          </div>

          {/* Page Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-8 md:mb-12 leading-tight tracking-tight">
            Projects
          </h1>

          {/* Projects Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-3">Current Work</h3>
              <div className="space-y-3">
                <Link 
                  href="/projects/browserbase-growth"
                  className="text-foreground hover:text-foreground/80 transition-colors block"
                >
                  Growth Engineering at Browserbase
                </Link>
                <Link 
                  href="/projects/experimental-interfaces"
                  className="text-foreground hover:text-foreground/80 transition-colors block"
                >
                  Experimental Interface Design
                </Link>
                <Link 
                  href="/projects/rapid-prototyping"
                  className="text-foreground hover:text-foreground/80 transition-colors block"
                >
                  Rapid Prototyping
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-3">Side Projects</h3>
              <div className="space-y-3">
                <div className="text-foreground/60">Developer Tools & Automation</div>
                <div className="text-foreground/60">Creative Technology Projects</div>
                <div className="text-foreground/60">Open Source Contributions</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-3">Coming Soon</h3>
              <div className="text-foreground/60">
                More detailed project breakdowns and case studies...
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
} 