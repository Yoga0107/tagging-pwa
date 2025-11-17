"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Tagging System", href: "/tagging-system" },
  ];

  return (
    <aside className="w-60 h-screen bg-gray-100 border-r p-4">
      <h2 className="text-xl font-bold mb-6">Menu</h2>

      <nav className="flex flex-col gap-2">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "p-2 rounded-md hover:bg-gray-200",
              pathname === item.href && "bg-gray-300 font-semibold"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
