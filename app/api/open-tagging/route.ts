import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { openTagging } from "@/lib/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const uid = body.uid ?? crypto.randomUUID(); // <- AUTO-GENERATE

    await db.insert(openTagging).values({
      uid,
      plant_area: body.plant_area,
      business_unit: body.business_unit,
      tagger: body.tagger,
      nik_tagger: body.nik_tagger,
      dept_tagger: body.dept_tagger,
      tag_category: body.tag_category,
      tag_category_system: body.tag_category_system,
      tag_category_subsystem: body.tag_category_subsystem,
      tag_priority: body.tag_priority,
      tagging_timestamp: new Date(), // <- otomatis timestamp juga boleh
      tag_pic: body.tag_pic,
      tag_desc: body.tag_desc,
      tag_open_media: body.tag_open_media,
    });

    return NextResponse.json({
      status: "success",
      message: "Data inserted",
      uid,
    });
  } catch (error: any) {
    console.error("INSERT ERROR =>", error);
    return NextResponse.json({ status: "error", message: error.message });
  }
  
}
