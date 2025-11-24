'use client'
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Boxes, Tag, UserCog, Layers } from "lucide-react";

export default function MasterTaggingDashboard() {
  const [data, setData] = useState({
    equipment: 0,
    category: 0,
    pic: 0,
    classification: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      const [eq, cat, pic, classif] = await Promise.all([
        fetch("/data/equipment-tree.json").then((r) => r.json()),
        fetch("/data/category-problem.json").then((r) => r.json()),
        fetch("/data/pic.json").then((r) => r.json()),
        fetch("/data/classification.json").then((r) => r.json()),
      ]);

      setData({
        equipment: eq.length,
        category: cat.length,
        pic: pic.length,
        classification: classif.length,
      });

      setLoading(false);
    }

    loadAll();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  const cards = [
    { title: "Equipment Tree", icon: Boxes, value: data.equipment, href: "/master-tagging/equipment-tree" },
    { title: "Category Problem", icon: Tag, value: data.category, href: "/master-tagging/category-problem" },
    { title: "PIC", icon: UserCog, value: data.pic, href: "/master-tagging/pic" },
    { title: "Classification", icon: Layers, value: data.classification, href: "/master-tagging/classification" },
  ];

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((c, idx) => (
        <a key={idx} href={c.href}>
          <Card className="hover:shadow-md transition cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{c.title}</CardTitle>
              <c.icon className="h-6 w-6 text-teal-600" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-center">{c.value}</p>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
}
