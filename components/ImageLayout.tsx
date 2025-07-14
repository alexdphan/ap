import Image from "next/image";
import { ReactNode } from "react";

interface MediaProps {
  src: string;
  alt?: string;
  caption?: string | ReactNode;
  className?: string;
}

export default function ImageLayout({
  src,
  alt = "",
  caption,
  className = "",
}: MediaProps) {
  // Don't render anything if src is empty or undefined
  if (!src) return null;

  // Check if the src is a video file
  const isVideo = /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(src);

  // Function to parse simple markdown links in string captions
  const parseCaption = (caption: string | ReactNode) => {
    if (typeof caption !== "string") return caption;

    // Simple regex to match [text](url) format
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(caption)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(caption.slice(lastIndex, match.index));
      }

      // Add the link
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-green hover:text-accent-green-light underline"
        >
          {match[1]}
        </a>
      );

      lastIndex = linkRegex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < caption.length) {
      parts.push(caption.slice(lastIndex));
    }

    return parts.length > 0 ? parts : caption;
  };

  if (isVideo) {
    return (
      <div className={`relative overflow-hidden my-8 group ${className}`}>
        <div className="relative w-full">
          <video
            src={src}
            className="w-full h-auto object-cover video-hover-controls"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            controls
          >
            Your browser does not support the video tag.
          </video>
        </div>
        {caption && (
          <div className="mt-3 text-sm text-foreground/60 text-center italic">
            {parseCaption(caption)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden my-8 ${className}`}>
      <div className="relative w-full" style={{ height: "400px" }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          quality={90}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          loading="lazy"
        />
      </div>
      {caption && (
        <div className="mt-3 text-sm text-foreground/60 text-center italic">
          {parseCaption(caption)}
        </div>
      )}
    </div>
  );
}
