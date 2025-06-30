import type { MDXComponents } from 'mdx/types'
import ImageLayout from './components/ImageLayout'
import ImageGrid from './components/ImageGrid'
import ImageTextLayout from './components/ImageTextLayout'
import Callout from './components/Callout'
import ProjectList, { ProjectItem } from './components/ProjectList'
import Lead from './components/Lead'
import SectionHeading from './components/SectionHeading'
import FeatureList, { FeatureItem } from './components/FeatureList'
import ProjectHeader from './components/ProjectHeader'
import ProjectLayout from './components/ProjectLayout'
import ContentContainer from './components/ContentContainer'
import ProseContainer from './components/ProseContainer'
import ContentSection from './components/ContentSection'
import FooterSection from './components/FooterSection'
import TableOfContents from './components/TableOfContents'
import ArticleLayout from './components/ArticleLayout'

// Utility component for clearing floated content
function ClearFloat() {
  return <div className="clear-both" />
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => (
      <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-8 md:mb-12 leading-tight tracking-tight clear-both">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-foreground mt-8 mb-4 clear-both">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-bold text-foreground mt-6 mb-3">
        {children}
      </h3>
        ),
    ul: ({ children }) => (
      <ul className="space-y-2 text-foreground text-base md:text-lg leading-relaxed">
        {children}
      </ul>
    ),
    li: ({ children }) => (
      <li className="text-foreground">
        {children}
      </li>
    ),
    a: ({ href, children }) => (
      <a 
        href={href}
        className="text-foreground hover:text-foreground/80 transition-colors underline"
      >
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-foreground/20 pl-4 italic text-foreground/80">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-foreground/10 px-1 py-0.5 rounded text-sm font-mono text-foreground">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-foreground/10 p-4 rounded overflow-x-auto">
        <code className="text-sm font-mono text-foreground">
          {children}
        </code>
      </pre>
    ),
    // Custom image component
    img: ({ src, alt, ...props }) => (
      <ImageLayout 
        src={src || ''} 
        alt={alt || ''} 
        {...props} 
      />
    ),
    // Named components for explicit use
    ImageLayout,
    ImageGrid,
    ImageTextLayout,
    Callout,
    ProjectList,
    ProjectItem,
    Lead,
    SectionHeading,
    FeatureList,
    FeatureItem,
    ProjectHeader,
    ProjectLayout,
    ContentContainer,
    ProseContainer,
    ContentSection,
    FooterSection,
    ClearFloat,
    TableOfContents,
    ArticleLayout,
    ...components,
  }
} 