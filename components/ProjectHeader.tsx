interface ProjectHeaderProps {
  year?: string
  category: string
  subcategory?: string
  title: string
  description: string
}

export default function ProjectHeader({ 
  year = '2024', 
  category, 
  subcategory, 
  title, 
  description
}: ProjectHeaderProps) {
  return (
    <div className="mb-12 md:mb-16 mt-12 md:mt-16">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs text-foreground/40 font-medium tracking-wide">{year}</span>
        <span className="text-xs text-foreground/20">•</span>
        <span className="text-xs text-foreground/40 font-medium tracking-wide">{category}</span>
        {subcategory && (
          <>
            <span className="text-xs text-foreground/20">•</span>
            <span className="text-xs text-foreground/40 font-medium tracking-wide">{subcategory}</span>
          </>
        )}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight tracking-tight">
        {title}
      </h1>
      <div className="text-foreground/60 text-lg leading-relaxed">
        {description}
      </div>
    </div>
  )
} 