"use client";

import { useState } from "react";
import { z } from "zod";
import { plantAreas, businessUnits, tagCategories, tagCategorySystem, tagCategorySubsystem, tagPriorities } from "../../constants/openTagging";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const schema = z.object({
  uid: z.string(),
  plant_area: z.string(),
  business_unit: z.string(),
  tagger: z.string(),
  nik_tagger: z.string(),
  dept_tagger: z.string(),
  tag_category: z.string(),
  tag_category_system: z.string(),
  tag_category_subsystem: z.string(),
  tag_priority: z.string(),
  tag_desc: z.string(),
});

export default function OpenTaggingPage() {
  const [form, setForm] = useState({
    uid: crypto.randomUUID(),
    plant_area: "",
    business_unit: "",
    tagger: "",
    nik_tagger: "",
    dept_tagger: "",
    tag_category: "",
    tag_category_system: "",
    tag_category_subsystem: "",
    tag_priority: "",
    tag_desc: "",
    tagging_timestamp: new Date().toISOString(),
    tag_pic: "unassigned",
    tag_open_media: "",
  });

  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    const parse = schema.safeParse(form);
    if (!parse.success) {
      setStatus("❌ Please fill in all required fields.");
      return;
    }

    const res = await fetch("/api/open-tagging", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(form),
});


    if (res.ok) {
      setStatus("✅ Tagging submitted successfully!");
    } else {
      setStatus("❌ Failed to submit data.");
    }
  };

  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Open Tagging Form</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* Plant Area */}
          <Select onValueChange={(v) => setForm({ ...form, plant_area: v })}>
            <SelectTrigger><SelectValue placeholder="Plant Area" /></SelectTrigger>
            <SelectContent>
              {plantAreas.map((x) => (
                <SelectItem key={x} value={x}>{x}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Business Unit */}
          <Select onValueChange={(v) => setForm({ ...form, business_unit: v })}>
            <SelectTrigger><SelectValue placeholder="Business Unit" /></SelectTrigger>
            <SelectContent>
              {businessUnits.map((x) => (
                <SelectItem key={x} value={x}>{x}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input placeholder="Tagger Name" onChange={(e) => setForm({ ...form, tagger: e.target.value })} />
          <Input placeholder="NIK Tagger" onChange={(e) => setForm({ ...form, nik_tagger: e.target.value })} />
          <Input placeholder="Dept Tagger" onChange={(e) => setForm({ ...form, dept_tagger: e.target.value })} />

          {/* Category */}
          <Select onValueChange={(v) => setForm({ ...form, tag_category: v })}>
            <SelectTrigger><SelectValue placeholder="Tag Category" /></SelectTrigger>
            <SelectContent>
              {tagCategories.map((x) => (
                <SelectItem key={x} value={x}>{x}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* System */}
          <Select onValueChange={(v) => setForm({ ...form, tag_category_system: v })}>
            <SelectTrigger><SelectValue placeholder="Tag Category System" /></SelectTrigger>
            <SelectContent>
              {tagCategorySystem.map((x) => (
                <SelectItem key={x} value={x}>{x}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Subsystem */}
          <Select onValueChange={(v) => setForm({ ...form, tag_category_subsystem: v })}>
            <SelectTrigger><SelectValue placeholder="Tag Category Subsystem" /></SelectTrigger>
            <SelectContent>
              {tagCategorySubsystem.map((x) => (
                <SelectItem key={x} value={x}>{x}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Priority */}
          <Select onValueChange={(v) => setForm({ ...form, tag_priority: v })}>
            <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              {tagPriorities.map((x) => (
                <SelectItem key={x} value={x}>{x}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea placeholder="Tag Description" onChange={(e) => setForm({ ...form, tag_desc: e.target.value })} />

          <Button className="w-full mt-4" onClick={handleSubmit}>
            Submit
          </Button>

          {status && <p className="text-center mt-3">{status}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
