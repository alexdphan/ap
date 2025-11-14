"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "bio" },
    { href: "/now", label: "now" },
    { href: "/work", label: "work" },
    { href: "/inspiration", label: "inspiration" },
    { href: "/investments", label: "investments" },
  ];

  return (
    <aside className="flex-shrink-0">
      <nav className="space-y-5">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="block hover:opacity-70 transition-opacity relative pl-5"
            >
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 transition-all duration-300 ease-out ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  backgroundColor: 'var(--gray-900)',
                }}
              />
              <span
                className="text-body"
                style={{ 
                  color: isActive ? 'var(--gray-900)' : 'var(--gray-400)',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
