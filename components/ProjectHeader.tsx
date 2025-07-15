"use client";

import { usePathname } from "next/navigation";
import projectsData from "../data/projects.json";
import memosData from "../data/memos.json";
import investmentsData from "../data/investments.json";
import Image from "next/image";

interface ProjectHeaderProps {
  // Optional manual overrides - if not provided, will auto-fetch from data
  year?: string;
  category?: string;
  subcategory?: string;
  title?: string;
  description?: string;
}

export default function ProjectHeader({
  year,
  category,
  subcategory,
  title,
  description,
}: ProjectHeaderProps) {
  const pathname = usePathname();

  // Auto-detect project/memo data from current path
  const getDataFromPath = () => {
    // Extract the ID from pathname (e.g., /projects/browserbase -> browserbase)
    const pathParts = pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    // Check if it's a project, memo, or investment
    const isProject = pathname.startsWith("/projects");
    const isMemo = pathname.startsWith("/memos");
    const isInvestment = pathname.startsWith("/investments");

    if (isProject) {
      const project = projectsData.find((p) => p.id === id);
      if (project) {
        return {
          year: project.date,
          category: project.category,
          title: project.title,
          description: project.description,
          icon: project.icon,
        };
      }
    } else if (isMemo) {
      const memo = memosData.find((m) => m.id === id);
      if (memo) {
        return {
          year: memo.date,
          category: memo.category,
          title: memo.title,
          description: memo.description,
          icon: memo.icon,
        };
      }
    } else if (isInvestment) {
      const investment = investmentsData.find((i) => i.id === id);
      if (investment) {
        return {
          year: investment.date,
          category: investment.category,
          title: investment.title,
          description: investment.description,
          icon: undefined, // investments don't have icons
        };
      }
    }

    return null;
  };

  // Get auto data or use manual props
  const autoData = getDataFromPath();
  const finalData = {
    year: year || autoData?.year || "2024",
    category: category || autoData?.category || "",
    subcategory: subcategory,
    title: title || autoData?.title || "",
    description: description || autoData?.description || "",
    icon: autoData?.icon,
  };

  return (
    <div className="mb-12 md:mb-12 mt-12 md:mt-16">
      <div className="flex flex-row items-center gap-2 sm:gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-foreground/50 font-medium tracking-wider uppercase">
            {finalData.year}
          </span>
        </div>
        <span className="text-xs text-foreground/20">•</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-foreground/50 font-medium tracking-wide bg-foreground/3 px-2 py-1 border border-foreground/5 rounded-sm">
            {finalData.category}
          </span>
          {finalData.subcategory && (
            <span className="text-xs text-foreground/40 font-medium tracking-wide">
              {finalData.subcategory}
            </span>
          )}
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight tracking-tight flex items-center gap-3">
        {finalData.icon && (
          <Image
            src={finalData.icon}
            alt={finalData.title}
            width={32}
            height={32}
            className="flex-shrink-0"
          />
        )}
        <span>{finalData.title}</span>
      </h1>
      <div className="text-foreground/60 text-lg leading-relaxed">
        {finalData.description}
      </div>
    </div>
  );
}
