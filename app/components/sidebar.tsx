"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
} from "@/components/ui/sheet";

import {
    Home,
    Layers,
    ScanSearch,
    Settings,
    Menu,
    Database,
    Boxes,
    ChevronDown,
    ChevronRight,
} from "lucide-react";

import { useState } from "react";

export default function Sidebar() {
    const pathname = usePathname();

    const [openMaster, setOpenMaster] = useState(true);
    const [openTagging, setOpenTagging] = useState(true);
    const [openWMS, setOpenWMS] = useState(true);

    const masterMenu = [
        { href: "/master/dashboard", label: "Dashboard" },
        { href: "/master/equipmenttree", label: "Equipment Tree" },
        { href: "/master/pic", label: "Master PIC" },
        { href: "/master/plant", label: "Plant Area" },
        { href: "/master/bu", label: "Business Unit" },
    ];

    const taggingMenu = [
        { href: "/tagging/dashboard", label: "Dashboard" },
        { href: "/tagging/table", label: "Open Tagging" },
        { href: "/tagging/close", label: "Close Tagging" },
        { href: "/tagging/report", label: "Report" },
    ];

    const wmsMenu = [
        { href: "/wms/dashboard", label: "Dashboard" },
        { href: "/wms/inbound", label: "Inbound" },
        { href: "/wms/outbound", label: "Outbound" },
        { href: "/wms/stock", label: "Stock Opname" },
        { href: "/wms/mutation", label: "Mutation" },
        { href: "/wms/report", label: "Report" },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full w-64 border-r bg-white">
            <div className="p-5 font-semibold text-lg">ERP System</div>
            <Separator />

            <ScrollArea className="flex-1 p-3">
                <div className="space-y-1">

                    {/* MAIN DASHBOARD */}
                    <Link href="/dashboard">
                        <Button
                            variant={pathname === "/dashboard" ? "default" : "ghost"}
                            className="w-full justify-start gap-2"
                        >
                            <Home size={18} />
                            Main Dashboard
                        </Button>
                    </Link>

                    <Separator className="my-3" />

                    {/* MASTER DATA */}
                    <button
                        className="flex w-full justify-between items-center p-2 text-sm font-medium hover:bg-gray-100 rounded-md"
                        onClick={() => setOpenMaster(!openMaster)}
                    >
                        <div className="flex items-center gap-2">
                            <Database size={18} /> Master Data
                        </div>
                        {openMaster ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    {openMaster && (
                        <div className="ml-6 space-y-1 mt-1">
                            {masterMenu.map((item) => (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant={pathname === item.href ? "default" : "ghost"}
                                        className={cn(
                                            "w-full justify-start text-sm",
                                            pathname === item.href && "font-semibold"
                                        )}
                                    >
                                        {item.label}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    )}

                    <Separator className="my-3" />

                    {/* TAGGING SYSTEM */}
                    <button
                        className="flex w-full justify-between items-center p-2 text-sm font-medium hover:bg-gray-100 rounded-md"
                        onClick={() => setOpenTagging(!openTagging)}
                    >
                        <div className="flex items-center gap-2">
                            <ScanSearch size={18} /> Tagging System
                        </div>
                        {openTagging ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    {openTagging && (
                        <div className="ml-6 space-y-1 mt-1">
                            {taggingMenu.map((item) => (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant={pathname === item.href ? "default" : "ghost"}
                                        className={cn(
                                            "w-full justify-start text-sm",
                                            pathname === item.href && "font-semibold"
                                        )}
                                    >
                                        {item.label}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    )}

                    <Separator className="my-3" />

                    {/* WMS MODULE */}
                    <button
                        className="flex w-full justify-between items-center p-2 text-sm font-medium hover:bg-gray-100 rounded-md"
                        onClick={() => setOpenWMS(!openWMS)}
                    >
                        <div className="flex items-center gap-2">
                            <Boxes size={18} /> WMS
                        </div>
                        {openWMS ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    {openWMS && (
                        <div className="ml-6 space-y-1 mt-1">
                            {wmsMenu.map((item) => (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant={pathname === item.href ? "default" : "ghost"}
                                        className={cn(
                                            "w-full justify-start text-sm",
                                            pathname === item.href && "font-semibold"
                                        )}
                                    >
                                        {item.label}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    )}

                    <Separator className="my-3" />

                    {/* SETTINGS */}
                    <Link href="/settings">
                        <Button
                            variant={pathname === "/settings" ? "default" : "ghost"}
                            className="w-full justify-start gap-2"
                        >
                            <Settings size={18} />
                            Settings
                        </Button>
                    </Link>
                </div>
            </ScrollArea>

            <Separator />
            <div className="p-3 text-sm text-gray-500">v1.0.0</div>
        </div>
    );

    return (
        <>
            {/* Desktop */}
            <div className="hidden md:flex">
                <SidebarContent />
            </div>

            {/* Mobile */}
            <Sheet>
                <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon" className="absolute top-4 left-4">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                    <SidebarContent />
                </SheetContent>
            </Sheet>
        </>
    );
}
