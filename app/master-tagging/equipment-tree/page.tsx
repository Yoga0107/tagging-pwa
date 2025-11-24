"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";


type Equipment = {
  id: number;
  system: string;
  sub_system: string;
  machine_unit: string;
  machine_part: string;
  spare_part: string;
  spare_part_specs: string;
  sku: string;
  business_unit: string;
};

const STORAGE_KEY = "equipment_tree_data_v1";

export default function EquipmentTreePage() {
  const [data, setData] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof Equipment | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Modal state
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<Equipment | null>(null);

  // form state
  const emptyForm: Equipment = {
    id: 0,
    system: "",
    sub_system: "",
    machine_unit: "",
    machine_part: "",
    spare_part: "",
    spare_part_specs: "",
    sku: "",
    business_unit: ""
  };
  const [form, setForm] = useState<Equipment>(emptyForm);

  const exportExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Equipment Tree");

  XLSX.writeFile(workbook, "equipment-tree.xlsx");
};

const exportPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Equipment Tree Report", 14, 15);

  autoTable(doc, {
    startY: 25,
    head: [[
      "ID", "System", "Sub System", "Machine Unit", "Machine Part", 
      "Spare Part", "Specs", "SKU", "Business Unit"
    ]],
    body: data.map((row) => [
      row.id,
      row.system,
      row.sub_system,
      row.machine_unit,
      row.machine_part,
      row.spare_part,
      row.spare_part_specs,
      row.sku,
      row.business_unit,
    ]),
    styles: { fontSize: 8 },
  });

  doc.save("equipment-tree.pdf");
};


  // load data: prefer localStorage, fallback to JSON file
  useEffect(() => {
    async function load() {
      setLoading(true);
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Equipment[];
          setData(parsed);
          setLoading(false);
          return;
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      try {
        const res = await fetch("/data/equipment-tree.json");
        const json = await res.json();
        // ensure id numeric
        const normalized = (json || []).map((r: any, i: number) => ({ id: r.id ?? i+1, ...r }));
        setData(normalized);
        setLoading(false);
      } catch (e) {
        console.error("Failed loading equipment json", e);
        setData([]);
        setLoading(false);
      }
    }
    load();
  }, []);

  // helpers: persist
  const persist = (next: Equipment[]) => {
    setData(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  // Search + sort
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    let list = data.filter((d) => {
      if (!s) return true;
      return (
        String(d.system).toLowerCase().includes(s) ||
        String(d.sub_system).toLowerCase().includes(s) ||
        String(d.machine_unit).toLowerCase().includes(s) ||
        String(d.machine_part).toLowerCase().includes(s) ||
        String(d.spare_part).toLowerCase().includes(s) ||
        String(d.spare_part_specs).toLowerCase().includes(s) ||
        String(d.sku).toLowerCase().includes(s) ||
        String(d.business_unit).toLowerCase().includes(s)
      );
    });

    if (sortKey) {
      list = list.sort((a, b) => {
        const av = String(a[sortKey] ?? "").toLowerCase();
        const bv = String(b[sortKey] ?? "").toLowerCase();
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return list;
  }, [data, search, sortKey, sortDir]);

  // pagination slice
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((page - 1) * itemsPerPage, (page - 1) * itemsPerPage + itemsPerPage);

  // actions
  const onSort = (key: keyof Equipment) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, id: (data.length ? Math.max(...data.map(d => d.id)) + 1 : 1) });
    setOpenDialog(true);
  };

  const openEdit = (row: Equipment) => {
    setEditing(row);
    setForm(row);
    setOpenDialog(true);
  };

  const saveForm = () => {
    // very basic validation
    if (!form.system || !form.machine_unit) {
      alert("Please fill required fields: system, machine unit");
      return;
    }

    if (editing) {
      const next = data.map((d) => (d.id === form.id ? form : d));
      persist(next);
    } else {
      const next = [...data, form];
      persist(next);
    }
    setOpenDialog(false);
  };

  const remove = (id: number) => {
    if (!confirm("Delete this record?")) return;
    const next = data.filter(d => d.id !== id);
    persist(next);
  };

  // reset page if filtered length shorter
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // table header helper
  const Th = ({ children, keyname }: { children: React.ReactNode; keyname?: keyof Equipment }) => (
    <th className="p-3 text-center cursor-pointer select-none" onClick={() => keyname && onSort(keyname)}>
      <div className="flex items-center justify-center gap-2">
        <span>{children}</span>
        {sortKey === keyname ? <span className="text-sm">({sortDir})</span> : null}
      </div>
    </th>
  );

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Equipment Tree</CardTitle>

          <div className="flex items-center gap-3">
            <Input placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="min-w-[220px]" />
            <Button variant="ghost" onClick={() => { setSearch(""); setSortKey(null); setSortDir("asc"); setPage(1); }}>Reset</Button>
            <Button variant="outline" onClick={exportPDF}>Export PDF</Button>
  <Button variant="outline" onClick={exportExcel}>Export Excel</Button>
            <Button onClick={openAdd}><Plus className="mr-2" />Add</Button>
            
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <TableRow  className="bg-gray-50">
                  <Th keyname="id">No.</Th>
                  <Th keyname="system">System</Th>
                  <Th keyname="sub_system">Sub System</Th>
                  <Th keyname="machine_unit">Machine Unit</Th>
                  <Th keyname="machine_part">Machine Part</Th>
                  <Th keyname="spare_part">Spare Part</Th>
                  <Th keyname="spare_part_specs">Specs</Th>
                  <Th keyname="sku">SKU</Th>
                  <Th keyname="business_unit">Business Unit</Th>
                  <Th>Action</Th>
                </TableRow>
              </thead>

              <tbody>
                {paginated.map((row) => (
                  <TableRow key={row.id} className="even:bg-white odd:bg-gray-50">
                    <TableCell className="text-center p-2">{row.id}</TableCell>
                    <TableCell className="text-center p-2">{row.system}</TableCell>
                    <TableCell className="text-center p-2">{row.sub_system}</TableCell>
                    <TableCell className="text-center p-2">{row.machine_unit}</TableCell>
                    <TableCell className="text-center p-2">{row.machine_part}</TableCell>
                    <TableCell className="text-center p-2">{row.spare_part}</TableCell>
                    <TableCell className="text-center p-2">{row.spare_part_specs}</TableCell>
                    <TableCell className="text-center p-2">{row.sku}</TableCell>
                    <TableCell className="text-center p-2">{row.business_unit}</TableCell>
                    <TableCell className="text-center p-2 flex gap-2 justify-center">
                      <Button size="sm" variant="outline" onClick={() => openEdit(row)}><Edit size={14} /></Button>
                      <Button size="sm" variant="destructive" onClick={() => remove(row.id)}><Trash2 size={14} /></Button>
                    </TableCell>
                  </TableRow>
                ))}

                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center p-6 text-muted-foreground">No data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Separator className="my-4" />

          {/* pagination */}
          <div className="flex items-center justify-between">
            <div>Showing {Math.min(data.length, (page - 1) * itemsPerPage + 1)} - {Math.min(data.length, page * itemsPerPage)} of {data.length}</div>

            <div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => page > 1 && setPage(page - 1)} />
                  </PaginationItem>

                  <PaginationItem className="px-4 py-2">Page {page} / {totalPages}</PaginationItem>

                  <PaginationItem>
                    <PaginationNext onClick={() => page < totalPages && setPage(page + 1)} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog for add/edit */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Equipment" : "Add Equipment"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label>System</Label>
              <Input value={form.system} onChange={(e) => setForm({...form, system: e.target.value})} />
            </div>

            <div>
              <Label>Sub System</Label>
              <Input value={form.sub_system} onChange={(e) => setForm({...form, sub_system: e.target.value})} />
            </div>

            <div>
              <Label>Machine Unit</Label>
              <Input value={form.machine_unit} onChange={(e) => setForm({...form, machine_unit: e.target.value})} />
            </div>

            <div>
              <Label>Machine Part</Label>
              <Input value={form.machine_part} onChange={(e) => setForm({...form, machine_part: e.target.value})} />
            </div>

            <div>
              <Label>Spare Part</Label>
              <Input value={form.spare_part} onChange={(e) => setForm({...form, spare_part: e.target.value})} />
            </div>

            <div>
              <Label>Spare Part Specs</Label>
              <Input value={form.spare_part_specs} onChange={(e) => setForm({...form, spare_part_specs: e.target.value})} />
            </div>

            <div>
              <Label>SKU</Label>
              <Input value={form.sku} onChange={(e) => setForm({...form, sku: e.target.value})} />
            </div>

            <div>
              <Label>Business Unit</Label>
              <Input value={form.business_unit} onChange={(e) => setForm({...form, business_unit: e.target.value})} />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={saveForm}>{editing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
