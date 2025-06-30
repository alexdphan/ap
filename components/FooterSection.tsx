interface FooterSectionProps {
  children: React.ReactNode
}

export default function FooterSection({ children }: FooterSectionProps) {
  return (
    <div className="mt-16">
      {children}
    </div>
  )
} 