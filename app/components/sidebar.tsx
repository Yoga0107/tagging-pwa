"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ScrollArea,
} from "@/components/ui/scroll-area";
import {
  Button
} from "@/components/ui/button";
import {
  Separator
} from "@/components/ui/separator";
import {
  Home,
  Layers,
  ScanSearch,
  Settings,
  Menu
} from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent
} from "@/components/ui/sheet";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { href: "/dashboard/tagging", label: "Tagging", icon: <ScanSearch size={18} /> },
    { href: "/dashboard/system", label: "System", icon: <Layers size={18} /> },
    { href: "/dashboard/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full w-60 border-r bg-white">
      <div className="p-5 font-semibold text-lg">ERP System</div>
      <Separator />

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === item.href && "font-semibold"
                )}
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>

      <Separator />
      <div className="p-3 text-sm text-gray-500">v1.0.0</div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="absolute top-4 left-4">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-60">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
