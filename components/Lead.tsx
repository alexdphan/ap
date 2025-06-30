interface LeadProps {
  children: React.ReactNode
}

export default function Lead({ children }: LeadProps) {
  return (
    <div className="text-xl leading-relaxed text-foreground/90 font-medium">
      {children}
    </div>
  )
} 