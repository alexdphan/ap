interface LeadProps {
  children: React.ReactNode;
}

export default function Lead({ children }: LeadProps) {
  return (
    <div className="text-lg leading-relaxed text-foreground/75 font-normal">
      {children}
    </div>
  );
}
