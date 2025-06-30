interface ProseContainerProps {
  children: React.ReactNode
}

export default function ProseContainer({ children }: ProseContainerProps) {
  return (
    <div className="prose prose-lg prose-gray max-w-none">
      <div className="space-y-8 text-foreground/80 leading-relaxed">
        {children}
      </div>
    </div>
  )
} 