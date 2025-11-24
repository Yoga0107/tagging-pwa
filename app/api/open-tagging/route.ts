import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { Pool } from "pg";

// === DATABASE CONFIG WITH SSL SUPPORT ===
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.PGSSLMODE === "require" ||
    process.env.SSL === "true"
      ? { rejectUnauthorized: false }
      : false,
});

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const uid = randomUUID();

    const fields = {
      plant_area: form.get("plant_area") || "",
      business_unit: form.get("business_unit") || "",
      tagger: form.get("tagger") || "",
      nik_tagger: form.get("nik_tagger") || "",
      dept_tagger: form.get("dept_tagger") || "",
      tag_category: form.get("tag_category") || "",
      tag_category_system: form.get("tag_category_system") || "",
      tag_category_subsystem: form.get("tag_category_subsystem") || "",
      tag_priority: form.get("tag_priority") || "",
      tag_pic: form.get("tag_pic") || "",
      tag_desc: form.get("tag_desc") || "",
    };

    // === FILE HANDLING ===
    const file = form.get("tag_open_media") as File | null;
    let fileBuffer: Buffer | null = null;

    if (file && file.size > 0) {
      const buffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(buffer);
    }

    await pool.query(
      `INSERT INTO public.open_tagging
      (uid, plant_area, business_unit, tagger, nik_tagger, dept_tagger, 
       tag_category, tag_category_system, tag_category_subsystem, 
       tag_priority, tagging_timestamp, tag_pic, tag_desc, tag_open_media)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, NOW(), $11, $12, $13)`,
      [
        uid,
        fields.plant_area,
        fields.business_unit,
        fields.tagger,
        fields.nik_tagger,
        fields.dept_tagger,
        fields.tag_category,
        fields.tag_category_system,
        fields.tag_category_subsystem,
        fields.tag_priority,
        fields.tag_pic,
        fields.tag_desc,
        fileBuffer,
      ]
    );

    return NextResponse.json({ success: true, uid });
  } catch (error: any) {
    console.error("OPEN TAGGING ERROR:", error);
    return NextResponse.json(
      { error: "Failed to insert data", detail: error.message },
      { status: 500 }
    );
  }
}
