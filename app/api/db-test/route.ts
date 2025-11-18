import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // simple raw query
    const result = await db.execute("SELECT NOW();");

    console.log("Database connected:", result);

    return NextResponse.json({
      status: "success",
      message: "Connected to Supabase database",
      serverTime: result,
    });
  } catch (error: any) {
    console.error("DB connection error:", error);
    return NextResponse.json({
      status: "error",
      message: error.message,
    });
  }
}
