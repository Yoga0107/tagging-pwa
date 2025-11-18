"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">Welcome to ERP System</h1>
      <div className="flex gap-4">
        <Button onClick={() => router.push("/open-tagging")}>Open Tagging</Button>
        <Button onClick={() => router.push("/dashboard")}>Login as PIC</Button>
      </div>
    </main>
  );
}
