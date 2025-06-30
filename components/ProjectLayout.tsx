import ArticleLayout from "./ArticleLayout";

interface ProjectLayoutProps {
  children: React.ReactNode
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  return (
    <ArticleLayout>
      <div className="min-h-screen">
        <div className="py-6">
          {children}
        </div>
      </div>
    </ArticleLayout>
  )
} 