interface ProjectItemProps {
  title: string
  description: string
  children?: React.ReactNode
}

function ProjectItem({ title, description, children }: ProjectItemProps) {
  return (
    <div className="border-l-2 border-accent-green/20 pl-4">
      <h4 className="font-semibold text-foreground mb-1">{title}</h4>
      <span className="text-sm text-foreground/70">{description}</span>
      {children}
    </div>
  )
}

interface ProjectListProps {
  children: React.ReactNode
}

export default function ProjectList({ children }: ProjectListProps) {
  return (
    <div className="space-y-4 my-6">
      {children}
    </div>
  )
}

export { ProjectItem } 