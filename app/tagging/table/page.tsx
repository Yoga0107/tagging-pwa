"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TaggingTablePage() {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPlant, setFilterPlant] = useState("All");
  const [filterCatSystem, setFilterCatSystem] = useState("All");
  const [filterPIC, setFilterPIC] = useState("All");

  const itemsPerPage = 10;

  // Fetch data.json
  useEffect(() => {
    async function loadData() {
      const res = await fetch("/data/data.json");
      const json = await res.json();
      setData(json);
    }
    loadData();
  }, []);

  // FILTER & SEARCH
  const filtered = data.filter((item) => {
    const matchesSearch =
      item.ticket.toLowerCase().includes(search.toLowerCase()) ||
      item.plant.toLowerCase().includes(search.toLowerCase()) ||
      item.catSystem.toLowerCase().includes(search.toLowerCase()) ||
      item.subSystem.toLowerCase().includes(search.toLowerCase()) ||
      item.pic.toLowerCase().includes(search.toLowerCase()) ||
      item.status.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || item.status === filterStatus;

    const matchesPlant =
      filterPlant === "All" || item.plant === filterPlant;

    const matchesCatSystem =
      filterCatSystem === "All" || item.catSystem === filterCatSystem;

    const matchesPIC =
      filterPIC === "All" || item.pic === filterPIC;

    return matchesSearch && matchesStatus && matchesPlant && matchesCatSystem && matchesPIC;
  });

  // PAGINATION
  const startIndex = (page - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return <Badge className="bg-red-500 text-center">Open</Badge>;
      case "Postponed":
        return <Badge className="bg-yellow-500 text-black text-center">Postponed</Badge>;
      case "Closed":
        return <Badge className="bg-green-600 text-center">Closed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const renderAction = (status: string) => {
    if (status === "Open") {
      return <Button size="sm" variant="outline">Review Tagging</Button>;
    }
    if (status === "Postponed") {
      return <Button size="sm" variant="outline">Update</Button>;
    }
    return <Button size="sm" variant="outline">View Detail</Button>;
  };

  return (
    <div className="p-8 space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-center">Tagging List</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* SEARCH BAR */}
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <Input
              placeholder="Search ticket, plant, system, PIC..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="w-full"
            />

            {/* FILTER STATUS */}
            <Select onValueChange={(v) => { setPage(1); setFilterStatus(v); }}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Postponed">Postponed</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            {/* FILTER PLANT */}
            <Select onValueChange={(v) => { setPage(1); setFilterPlant(v); }}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Plant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Plant</SelectItem>
                <SelectItem value="Plant A">Plant A</SelectItem>
                <SelectItem value="Plant B">Plant B</SelectItem>
                <SelectItem value="Plant C">Plant C</SelectItem>
              </SelectContent>
            </Select>

            {/* FILTER CATEGORY SYSTEM */}
            <Select onValueChange={(v) => { setPage(1); setFilterCatSystem(v); }}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category System" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Category</SelectItem>
                <SelectItem value="Mechanical">Mechanical</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="Instrumentation">Instrumentation</SelectItem>
              </SelectContent>
            </Select>

            {/* FILTER PIC */}
            <Select onValueChange={(v) => { setPage(1); setFilterPIC(v); }}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="PIC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All PIC</SelectItem>
                <SelectItem value="John Doe">John Doe</SelectItem>
                <SelectItem value="Andrew">Andrew</SelectItem>
                <SelectItem value="Michael">Michael</SelectItem>
                <SelectItem value="Sarah">Sarah</SelectItem>
                <SelectItem value="Budi">Budi</SelectItem>
                <SelectItem value="Rizky">Rizky</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* TABLE */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Ticket</TableHead>
                <TableHead className="text-center">Plant Area</TableHead>
                <TableHead className="text-center">Category System</TableHead>
                <TableHead className="text-center">Sub Category</TableHead>
                <TableHead className="text-center">PIC</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">{item.ticket}</TableCell>
                  <TableCell className="text-center">{item.plant}</TableCell>
                  <TableCell className="text-center">{item.catSystem}</TableCell>
                  <TableCell className="text-center">{item.subSystem}</TableCell>
                  <TableCell className="text-center">{item.pic}</TableCell>
                  <TableCell className="text-center">{renderStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-center">{renderAction(item.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => page > 1 && setPage(page - 1)}
                    className="cursor-pointer"
                  />
                </PaginationItem>

                <PaginationItem className="px-4 py-2 text-sm">
                  Page {page} of {totalPages}
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    onClick={() => page < totalPages && setPage(page + 1)}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
