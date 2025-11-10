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
    <aside className="flex-shrink-0 editorial-label text-sm md:text-base text-gray-400">
      <nav className="space-y-7 md:space-y-9">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block hover:text-gray-700 transition-all duration-300 ease-out relative ${
                isActive ? "pl-4 md:pl-5 text-gray-900 editorial-headline" : ""
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
