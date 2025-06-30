import Image from 'next/image'

interface ImageGridProps {
  images: Array<{
    src: string
    alt: string
    size?: 'xs' | 'small' | 'medium' | 'large' | 'wide' | 'tall'
    position?: 'left' | 'right' | 'center'
  }>
  className?: string
}

const sizeClasses = {
  xs: 'w-full h-48 md:w-64',
  small: 'w-full h-56 md:w-72',
  medium: 'w-full h-64 md:w-80',
  large: 'w-full h-80',
  wide: 'w-full h-48',
  tall: 'w-full h-80 md:w-64'
}

const positionClasses = {
  left: 'md:float-left md:mr-8 md:mb-6',
  right: 'md:float-right md:ml-8 md:mb-6',
  center: 'md:mx-auto md:clear-both'
}

function ImageItem({ 
  src, 
  alt, 
  size = 'medium',
  position = 'center',
  className = ''
}: {
  src: string
  alt: string
  size?: 'xs' | 'small' | 'medium' | 'large' | 'wide' | 'tall'
  position?: 'left' | 'right' | 'center'
  className?: string
}) {
  const isFloated = position === 'left' || position === 'right'
  const containerClasses = `relative overflow-hidden ${sizeClasses[size]} ${positionClasses[position]} ${className}`
  const spacingClasses = isFloated ? '' : 'my-8'

  return (
    <div 
      className={`${containerClasses} ${spacingClasses}`}
    >
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          quality={90}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
          loading="lazy"
        />
      </div>
    </div>
  )
}

export default function ParallaxImageGrid({ images, className = '' }: ImageGridProps) {
  const hasFloatedImages = images.some(img => img.position === 'left' || img.position === 'right')
  
  return (
    <div className={`${hasFloatedImages ? 'overflow-hidden' : 'space-y-8 md:space-y-10'} my-8 ${className}`}>
      {images.map((img, index) => (
        <ImageItem
          key={index}
          src={img.src}
          alt={img.alt}
          size={img.size}
          position={img.position}
        />
      ))}
      {hasFloatedImages && <div className="clear-both" />}
    </div>
  )
} 