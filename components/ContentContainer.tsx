interface ContentContainerProps {
  children: React.ReactNode
  size?: 'default' | 'narrow' | 'wide'
}

export default function ContentContainer({ children, size = 'default' }: ContentContainerProps) {
  const sizeClasses = {
    narrow: 'max-w-2xl',
    default: 'max-w-4xl',
    wide: 'max-w-6xl'
  }
  return (
    <div className={`${sizeClasses[size]} mx-auto px-6 md:px-0`}>
      {children}
    </div>
  )
} 