import React from 'react';
import Link from 'next/link';

export default function Memos() {
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
            <div className="text-sm text-foreground/60">Memos</div>
          </div>

          {/* Page Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-8 md:mb-12 leading-tight tracking-tight">
            Memos
          </h1>

          {/* Memos Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm text-foreground/60 mb-3 tracking-wide">Recent Thoughts</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-xs text-foreground/40 mb-1">Dec 2024</div>
                  <Link 
                    href="/memos/backdoors-overlooked"
                    className="text-foreground hover:text-foreground/80 transition-colors block"
                  >
                    The backdoors that are often overlooked are usually the most obvious ones - 
                    the patterns we dismiss because they seem too simple or too direct.
                  </Link>
                </div>
                
                <div>
                  <div className="text-xs text-foreground/40 mb-1">Nov 2024</div>
                  <Link 
                    href="/memos/growth-engineering-systems"
                    className="text-foreground hover:text-foreground/80 transition-colors block"
                  >
                    Growth engineering isn&apos;t just about metrics - it&apos;s about building systems 
                    that make the right behaviors feel natural and inevitable.
                  </Link>
                </div>

                <div>
                  <div className="text-xs text-foreground/40 mb-1">Nov 2024</div>
                  <Link 
                    href="/memos/interfaces-extensions-thought"
                    className="text-foreground hover:text-foreground/80 transition-colors block"
                  >
                    The best interfaces don&apos;t feel like interfaces at all. They feel like 
                    extensions of thought.
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-foreground/60 mb-3 tracking-wide">Archive</h3>
              <div className="text-foreground/60">
                More thoughts and observations coming soon...
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
} 