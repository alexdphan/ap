interface CalloutProps {
  children: React.ReactNode;
  type?: "default" | "quote";
}

export default function Callout({ children, type = "default" }: CalloutProps) {
  if (type === "quote") {
    return (
      <div className="text-lg font-medium text-foreground/90 italic border-l-4 border-accent-green/30 pl-6 py-2">
        {children}
      </div>
    );
  }

  return <div className="bg-foreground/5 p-6 my-8">{children}</div>;
}
