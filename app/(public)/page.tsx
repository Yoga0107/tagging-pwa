"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Tagging System</h1>

      <Link href="/open-tagging">
        <Button className="w-48">Open Tagging</Button>
      </Link>

      <Link href="/login">
        <Button variant="secondary" className="w-48">
          Login sebagai PIC
        </Button>
      </Link>
    </div>
  );
}
