interface FeatureItemProps {
  children: React.ReactNode;
}

function FeatureItem({ children }: FeatureItemProps) {
  return (
    <li className="flex items-start gap-3">
      <span className="text-accent-green text-sm mt-1">•</span>
      <span>{children}</span>
    </li>
  );
}

interface FeatureListProps {
  title?: string;
  children: React.ReactNode;
}

export default function FeatureList({ title, children }: FeatureListProps) {
  return (
    <div className="bg-foreground/5 p-6 my-8">
      {title && (
        <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      )}
      <ul className="space-y-3 text-foreground/80">{children}</ul>
    </div>
  );
}

export { FeatureItem };
