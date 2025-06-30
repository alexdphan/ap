interface ContentSectionProps {
  children: React.ReactNode
  className?: string
}

export default function ContentSection({ children, className = '' }: ContentSectionProps) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  )
} 