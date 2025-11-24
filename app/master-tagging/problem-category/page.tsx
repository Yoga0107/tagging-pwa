"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Trash2, Edit, Plus } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const STORAGE_KEY = "category_problem_data_v1";

export default function CategoryProblemPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(null);

  const emptyForm = {
    id: 0,
    system: "",
    sub_system: "",
    problem_category: [], // multi-string array
  };
  const [form, setForm] = useState(emptyForm);
  const [problemText, setProblemText] = useState(""); // textarea text

  const exportExcel = () => {
    const sheetData = data.map((r) => ({
      id: r.id,
      system: r.system,
      sub_system: r.sub_system,
      problem_category: r.problem_category.join(", "),
    }));
    const ws = XLSX.utils.json_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CategoryProblem");
    XLSX.writeFile(wb, "category-problem.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Category Problem Report", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["ID", "System", "Sub System", "Problem Category"]],
      body: data.map((r) => [r.id, r.system, r.sub_system, r.problem_category.join(", ")]),
      styles: { fontSize: 8 },
    });

    doc.save("category-problem.pdf");
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setData(parsed);
          setLoading(false);
          return;
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      try {
        const res = await fetch("/data/category-problem.json");
        const json = await res.json();
        const normalized = (json || []).map((r, i) => ({ id: r.id ?? i + 1, ...r }));
        setData(normalized);
      } catch (e) {
        console.error(e);
        setData([]);
      }
      setLoading(false);
    }
    load();
  }, []);

  const persist = (next) => {
    setData(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    let list = data.filter((d) => {
      if (!s) return true;
      return (
        d.system.toLowerCase().includes(s) ||
        d.sub_system.toLowerCase().includes(s) ||
        d.problem_category.join(", ").toLowerCase().includes(s)
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const onSort = (k) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(k);
      setSortDir("asc");
    }
  };

  const openAdd = () => {
    setEditing(null);
    const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    setForm({ ...emptyForm, id: newId });
    setProblemText("");
    setOpenDialog(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm(row);
    setProblemText(row.problem_category.join(", "));
    setOpenDialog(true);
  };

  const saveForm = () => {
    const cleaned = problemText
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p);

    const finalRow = { ...form, problem_category: cleaned };

    if (!form.system || !form.sub_system) {
      alert("System & Sub System are required");
      return;
    }

    if (editing) {
      persist(data.map((d) => (d.id === form.id ? finalRow : d)));
    } else {
      persist([...data, finalRow]);
    }

    setOpenDialog(false);
  };

  const remove = (id) => {
    if (!confirm("Delete this record?")) return;
    persist(data.filter((d) => d.id !== id));
  };

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const Th = ({ label, col }) => (
    <th className="p-3 text-center cursor-pointer select-none" onClick={() => col && onSort(col)}>
      <div className="flex items-center justify-center gap-2">
        {label}
        {sortKey === col && <span>({sortDir})</span>}
      </div>
    </th>
  );

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Category Problem</CardTitle>
          <div className="flex gap-2 items-center">
            <Input placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="min-w-[200px]" />
            <Button variant="outline" onClick={exportPDF}>PDF</Button>
            <Button variant="outline" onClick={exportExcel}>Excel</Button>
            <Button onClick={openAdd}><Plus size={14} className="mr-1"/>Add</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <TableRow className="bg-gray-50">
                  <Th label="ID" col="id" />
                  <Th label="System" col="system" />
                  <Th label="Sub System" col="sub_system" />
                  <Th label="Problem Category" col={null} />
                  <Th label="Action" col={null} />
                </TableRow>
              </thead>
              <tbody>
                {paginated.map((row) => (
                  <TableRow key={row.id} className="odd:bg-gray-50">
                    <TableCell className="text-center p-2">{row.id}</TableCell>
                    <TableCell className="text-center p-2">{row.system}</TableCell>
                    <TableCell className="text-center p-2">{row.sub_system}</TableCell>
                    <TableCell className="text-center p-2">{row.problem_category.join(", ")}</TableCell>
                    <TableCell className="text-center p-2 flex gap-2 justify-center">
                      <Button size="sm" variant="outline" onClick={() => openEdit(row)}><Edit size={14}/></Button>
                      <Button size="sm" variant="destructive" onClick={() => remove(row.id)}><Trash2 size={14}/></Button>
                    </TableCell>
                  </TableRow>
                ))}

                {paginated.length === 0 && (
                  <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No data</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <div>Showing {Math.min(filtered.length, (page - 1) * itemsPerPage + 1)} - {Math.min(filtered.length, page * itemsPerPage)} of {filtered.length}</div>
            <Pagination>
              <PaginationContent>
                <PaginationItem><PaginationPrevious onClick={() => page > 1 && setPage(page - 1)} /></PaginationItem>
                <PaginationItem className="px-4">Page {page} / {totalPages}</PaginationItem>
                <PaginationItem><PaginationNext onClick={() => page < totalPages && setPage(page + 1)} /></PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>System</Label>
              <Input value={form.system} onChange={(e) => setForm({ ...form, system: e.target.value })} />
            </div>
            <div>
              <Label>Sub System</Label>
              <Input value={form.sub_system} onChange={(e) => setForm({ ...form, sub_system: e.target.value })} />
            </div>
            <div>
              <Label>Problem Category (comma separated)</Label>
              <Input value={problemText} onChange={(e) => setProblemText(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={saveForm}>{editing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}