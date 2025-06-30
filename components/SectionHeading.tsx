import { ReactNode } from "react";

interface SectionHeadingProps {
  children: React.ReactNode;
}

interface ReactElementWithChildren {
  props: {
    children?: ReactNode;
  };
}

const extractTextFromNode = (node: ReactNode): string => {
  if (typeof node === 'string') {
    return node;
  }
  
  if (typeof node === 'number') {
    return node.toString();
  }
  
  if (Array.isArray(node)) {
    return node.map(extractTextFromNode).join(' ');
  }
  
  if (node && typeof node === 'object' && 'props' in node) {
    // For React elements, recursively extract text from children
    const element = node as ReactElementWithChildren;
    if (element.props && element.props.children) {
      return extractTextFromNode(element.props.children);
    }
  }
  
  return '';
};

const slugify = (node: ReactNode): string => {
  const text = extractTextFromNode(node);
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

export default function SectionHeading({ children }: SectionHeadingProps) {
  const id = slugify(children);
  return (
    <h2 id={id} className="text-2xl font-semibold text-foreground mt-12 mb-6 tracking-tight border-b border-foreground/10 pb-3">
      {children}
    </h2>
  );
} 