"use client";

import  { useEffect, useState } from "react";
import dataJson from "./open-tagging-data.json";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";


export default function OpenTaggingPage() {
  // STEP
  const [step, setStep] = useState(1);

  // FORM DATA
  const [form, setForm] = useState({
    nik: "",
    tagger_name: "",
    email: "",
    plant_area: "",
    business_unit: "",
    category_system: "",
    category_subsystem: "",
    problem_category: "",
    pic: "",
    description: "",
  });

  // MEDIA
  const [media, setMedia] = useState<File | null>(null);

  // Subsystem berdasarkan system
  const [filteredSubsystem, setFilteredSubsystem] = useState<string[]>([]);

  // Update input handler
  const updateForm = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-filter subsystem
  useEffect(() => {
    if (form.category_system) {
      setFilteredSubsystem(dataJson.category_subsystem[form.category_system]);
    }
  }, [form.category_system]);

  // Validation per step
  const validateStep = () => {
    if (step === 1) {
      return form.nik && form.tagger_name && form.email;
    }
    if (step === 2) {
      return (
        form.plant_area &&
        form.business_unit &&
        form.category_system &&
        form.category_subsystem &&
        form.problem_category &&
        form.pic &&
        form.description
      );
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const submitForm = () => {
    console.log("FINAL DATA:", form);
    console.log("MEDIA FILE:", media);

    alert("Open Tagging (Static) Berhasil Dibuat!");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Open Tagging — Step {step} dari 3
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Progress Bar */}
          <Progress value={step * 33.3} className="mb-6" />

          {/* ================= STEP 1 ================= */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Information Tagger</h2>

              {/* NIK */}
              <div>
                <label className="text-sm font-medium">Nomor Induk Karyawan</label>
                <Input
                  type="number"
                  placeholder="Masukkan NIK"
                  value={form.nik}
                  onChange={(e) => updateForm("nik", e.target.value)}
                />
              </div>

              {/* Tagger Name */}
              <div>
                <label className="text-sm font-medium">Nama Tagger</label>
                <Input
                  placeholder="Nama"
                  value={form.tagger_name}
                  onChange={(e) => updateForm("tagger_name", e.target.value)}
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium">Email Tagger</label>
                <Input
                  type="email"
                  placeholder="example@company.com"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ================= STEP 2 ================= */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Discovery Information</h2>

              {/* Plant Area */}
              <div>
                <label className="text-sm font-medium">Plant Area</label>
                <Select onValueChange={(v) => updateForm("plant_area", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Plant Area" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataJson.plant_area.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Business Unit */}
              <div>
                <label className="text-sm font-medium">Business Unit</label>
                <Select onValueChange={(v) => updateForm("business_unit", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Business Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataJson.business_unit.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category System */}
              <div>
                <label className="text-sm font-medium">Category System</label>
                <Select
                  onValueChange={(v) => {
                    updateForm("category_system", v);
                    updateForm("category_subsystem", ""); // reset
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Category System" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataJson.category_system.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Subsystem */}
              <div>
                <label className="text-sm font-medium">Category Sub System</label>
                <Select onValueChange={(v) => updateForm("category_subsystem", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Subsystem" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSubsystem.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Problem Category */}
              <div>
                <label className="text-sm font-medium">Problem Category</label>
                <Select onValueChange={(v) => updateForm("problem_category", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Problem" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataJson.problem_category.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* PIC */}
              <div>
                <label className="text-sm font-medium">PIC</label>
                <Select onValueChange={(v) => updateForm("pic", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih PIC" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataJson.pic.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  rows={3}
                  placeholder="Tuliskan deskripsi masalah..."
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ================= STEP 3 ================= */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Media Submission</h2>

              <p className="text-sm text-gray-500">
                Media dapat berupa gambar atau video singkat.
              </p>

              <Input
                type="file"
                accept="image/*, video/*"
                onChange={(e) => setMedia(e.target.files?.[0] ?? null)}
              />

              {media && (
                <div className="mt-3">
                  <p className="text-sm font-medium">Preview:</p>
                  {media.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(media)}
                      className="w-40 rounded border"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(media)}
                      className="w-40 rounded border"
                      controls
                    />
                  )}
                </div>
              )}
            </div>
          )}

          <Separator className="my-6" />

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button onClick={nextStep} disabled={!validateStep()}>
                Next
              </Button>
            ) : (
              <Button onClick={submitForm}>Submit</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
