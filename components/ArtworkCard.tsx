"use client";

import Image from "next/image";
import { useState, useRef } from "react";

interface ArtworkCardProps {
  title?: string;
  image: string;
  date?: string;
  alt: string;
  width?: number;
  height?: number;
}

export default function ArtworkCard({
  title,
  image,
  date,
  alt,
  width = 200,
  height = 250,
}: ArtworkCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setMousePosition({ x: rotateY, y: rotateX });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div className="flex flex-col items-end flex-shrink-0">
      {/* Artwork Title */}
      {title && (
        <div className="text-right mb-4">
          <h2 className="text-[11px] tracking-[0.05em] text-gray-400 whitespace-pre-line leading-relaxed font-normal">
            {title}
          </h2>
        </div>
      )}

      {/* Artwork Image with Floating Shadow */}
      <div
        ref={cardRef}
        className="artwork-card mb-6"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${
            mousePosition.y
          }deg) rotateY(${mousePosition.x}deg) scale(${isHovered ? 1.02 : 1})`,
          transition: isHovered
            ? "transform 0.1s ease-out"
            : "transform 0.5s ease-out",
        }}
      >
        <Image
          src={image}
          alt={alt}
          width={width}
          height={height}
          className="object-cover"
          priority
        />
      </div>

      {/* Artwork Date */}
      {date && (
        <div className="text-right">
          <p className="text-[11px] tracking-[0.05em] text-gray-400">{date}</p>
        </div>
      )}
    </div>
  );
}
