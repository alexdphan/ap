"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { springs } from "@/lib/animation";

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
  const cardRef = useRef<HTMLDivElement>(null);

  // Spring-based rotation for smooth mouse tracking
  const rotateX = useSpring(0, springs.cardTrack);
  const rotateY = useSpring(0, springs.cardTrack);
  const scale = useSpring(1, springs.cardTrack);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation - spring will smoothly interpolate
    const targetRotateX = ((y - centerY) / centerY) * -10;
    const targetRotateY = ((x - centerX) / centerX) * 10;

    rotateX.set(targetRotateX);
    rotateY.set(targetRotateY);
  };

  const handleMouseLeave = () => {
    // Spring will smoothly animate back to 0
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  const handleMouseEnter = () => {
    scale.set(1.02);
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
      <motion.div
        ref={cardRef}
        className="artwork-card mb-6"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: 1000,
          rotateX,
          rotateY,
          scale,
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
      </motion.div>

      {/* Artwork Date */}
      {date && (
        <div className="text-right">
          <p className="text-[11px] tracking-[0.05em] text-gray-400">{date}</p>
        </div>
      )}
    </div>
  );
}
