"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-bold">Selamat Datang</h1>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Link href="/tagging">
          <Button className="w-full">Open Tagging</Button>
        </Link>

        <Link href="/login">
          <Button variant="outline" className="w-full">
            Login sebagai PIC
          </Button>
        </Link>
      </div>
    </main>
  );
}
