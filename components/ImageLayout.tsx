import Image from 'next/image'

interface ImageProps {
  src: string
  alt: string
  className?: string
}

export default function ParallaxImage({ 
  src, 
  alt, 
  className = ''
}: ImageProps) {
  // Don't render anything if src is empty or undefined
  if (!src) return null;

  return (
    <div 
      className={`relative overflow-hidden my-8 ${className}`}
      style={{ height: '400px' }}
    >
      <div className="relative w-full h-full">
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
    </div>
  )
} 