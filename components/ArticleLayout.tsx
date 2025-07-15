"use client";

import { useState, useEffect, ReactNode, useRef } from "react";
import { usePathname } from "next/navigation";
import FloatingBottomNav, { Heading } from "./FloatingNav";
import projectsData from "../data/projects.json";
import memosData from "../data/memos.json";

interface ArticleLayoutProps {
  children: ReactNode;
}

export default function ArticleLayout({ children }: ArticleLayoutProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Determine if this is a project or memo and get navigation data
  const isProject = pathname.startsWith("/projects");
  const isMemo = pathname.startsWith("/memos");

  const allItems = isProject ? projectsData : isMemo ? memosData : [];
  const type = isProject ? "projects" : "memos";

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (!contentRef.current) return;
      const headingElements = Array.from(
        contentRef.current.querySelectorAll("h2")
      );

      if (headingElements.length > 0) {
        const extractedHeadings: Heading[] = headingElements
          .map((el) => ({
            id: el.id,
            text: el.textContent || "",
            level: 2,
          }))
          .filter((h) => h.id && h.text);

        setHeadings(extractedHeadings);
        observer.disconnect(); // Stop observing once we have the headings
      }
    });

    if (contentRef.current) {
      observer.observe(contentRef.current, { childList: true, subtree: true });
    }

    // Backup timer in case mutation observer fails for some reason
    const timeoutId = setTimeout(() => {
      if (!contentRef.current || headings.length > 0) return;
      const headingElements = Array.from(
        contentRef.current.querySelectorAll("h2")
      );
      if (headingElements.length > 0) {
        const extractedHeadings: Heading[] = headingElements
          .map((el) => ({ id: el.id, text: el.textContent || "", level: 2 }))
          .filter((h) => h.id && h.text);
        setHeadings(extractedHeadings);
      }
    }); // 500ms delay to wait for animations

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [headings.length]);

  return (
    <>
      {(isProject || isMemo) && (
        <FloatingBottomNav headings={headings} currentPath={pathname} />
      )}
      <div ref={contentRef}>{children}</div>
    </>
  );
}
