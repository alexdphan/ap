"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/bio", label: "bio" },
    { href: "/now", label: "now" },
    { href: "/work", label: "work" },
    { href: "/inspiration", label: "inspiration" },
    { href: "/investments", label: "investments" },
  ];

  return (
    <aside className="flex-shrink-0 text-[11px] tracking-[0.08em] text-gray-400 uppercase font-medium">
      <nav className="space-y-6">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block hover:text-gray-700 transition-all duration-300 ease-out relative ${
                isActive ? "pl-3 text-gray-900 font-semibold" : ""
              }`}
            >
              <span
                className={`absolute left-0 top-0 bottom-0 w-[2px] bg-gray-900 transition-all duration-300 ease-out ${
                  isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
                }`}
                style={{
                  transformOrigin: "center",
                }}
              />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
