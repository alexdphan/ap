import React from 'react';
// import TechnicalGrid from '../components/TechnicalGrid';
import RetroCarousel from '../components/RetroCarousel';

export default function Home() {
  // Video URLs - Add your videos here
  const videoItems = [
    {
      id: '1',
      title: 'Vibes',
      description: 'Exploring new interaction patterns and visual interfaces',
      videoUrl: 'https://pub-5018f734e2604654b16c6609e8c82280.r2.dev/Video-379.mp4',
    },
    {
      id: '2',
      title: 'Matches my aesthetic :)',
      description: 'A rapid prototyping session with unconventional approaches',
      videoUrl: 'https://pub-5018f734e2604654b16c6609e8c82280.r2.dev/Video-437.mp4',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Single Column Layout */}
      <div className="max-w-4xl mx-auto px-6 py-6 md:py-12">
        <div className="max-w-xl mx-auto">
          
          {/* Large Number */}
          <div className="text-6xl md:text-9xl font-bold text-foreground/10 mb-6 md:mb-8 tracking-tighter">
            [ AP ]
          </div>

          {/* Category */}
          {/* <div className="text-sm text-foreground/60 mb-4 tracking-wide">
            Growth Engineer & Creative Technologist
          </div> */}

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 md:mb-8 leading-tight tracking-tight">
            Alex Phan
          </h1>

           {/* Category */}
          {/* <div className="text-sm text-foreground/60 mb-2 tracking-wide">
            Vibes: 
          </div> */}

          {/* Retro Carousel */}
          <div className="mb-8 md:mb-16">
            <RetroCarousel items={videoItems} />
          </div>

          {/* Description Section */}
          <div className="mb-8 md:mb-16">
            <h3 className="text-sm text-foreground/60 mb-4 md:mb-6 tracking-wide">
              Description
            </h3>
            <p className="text-foreground text-base md:text-lg leading-relaxed">
              I spend a lot of my time thinking about what are the backdoors that are often overlooked or unseen.
            </p>
            <p className="text-foreground text-base md:text-lg leading-relaxed mt-4">
              I&apos;m also the first growth engineer at Browserbase, an exciting startup in San Francisco.
            </p>
            <p className="text-foreground text-base md:text-lg leading-relaxed mt-4">
             DM if you&apos;d like to chat!
            </p>
          </div>

          {/* Projects Section */}
          <div>
            <h3 className="text-sm text-foreground/60 mb-4 md:mb-6 tracking-wide">
              Current Focus
            </h3>
            <div className="space-y-2">
              <div className="text-foreground font-medium">Growth Engineering at Browserbase</div>
              <div className="text-foreground font-medium">Experimental Interface Design</div>
              <div className="text-foreground font-medium">Rapid Prototyping</div>
              <div className="text-foreground font-medium">Developer Tools & Automation</div>
              <div className="text-foreground font-medium">Creative Technology Projects</div>
              <div className="text-foreground font-medium">Open Source Contributions</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
