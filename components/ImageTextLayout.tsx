'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { PARALLAX_STRENGTH } from '../lib/parallax-config'

interface ImageTextLayoutProps {
  src: string
  alt: string
  imagePosition?: 'left' | 'right'
  imageSize?: 'xs' | 'small' | 'medium' | 'large'
  parallax?: number
  children: React.ReactNode
  className?: string
}

const imageSizeClasses = {
  xs: 'w-full md:w-60',
  small: 'w-full md:w-72',
  medium: 'w-full md:w-80', 
  large: 'w-full md:w-96'
}

export default function ImageTextLayout({
  src,
  alt,
  imagePosition = 'left',
  imageSize = 'medium',
  parallax = PARALLAX_STRENGTH,
  children,
  className = ''
}: ImageTextLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${parallax * 40}%`, `-${parallax * 40}%`]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const isImageLeft = imagePosition === 'left'
  
  return (
    <div className={`my-8 ${className}`}>
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        {/* Image Container */}
        <div 
          ref={containerRef}
          className={`relative overflow-hidden h-64 ${imageSizeClasses[imageSize]} ${
            isImageLeft ? 'md:order-1' : 'md:order-2'
          } flex-shrink-0`}
        >
          <motion.div
            style={{ 
              y: (isVisible && !shouldReduceMotion) ? y : 0 
            }}
            className="relative w-full h-[108%] -top-[4%]"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              quality={90}
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
            />
          </motion.div>
        </div>

        {/* Text Content */}
        <div className={`flex-1 ${isImageLeft ? 'md:order-2' : 'md:order-1'}`}>
          <div className="prose prose-lg max-w-none text-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
} 