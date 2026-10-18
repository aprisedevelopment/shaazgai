"use client";

import { useEffect, useState } from "react";
import { applicationsApi } from "@/lib/anket-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Eye, FilterX, Users, FileText, CheckCircle, Download, ChevronLeft, ChevronRight, Printer } from "lucide-react";
import Link from "next/link";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { updateApplicationStatus } from "./actions";

export default function ApplicationsAdminPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationsApi.list();
      setApplications(response.data || []);
    } catch (error: any) {
      console.error(error);
      toast.error("Мэдээлэл татахад алдаа гарлаа: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBackup = async () => {
    const toastId = toast.loading("Бүх мэдээллийг татаж байна. Түр хүлээнэ үү...");
    try {
      const response = await applicationsApi.list({ limit: 10000 });
      const fullData = response.data || [];

      if (!fullData || fullData.length === 0) {
        toast.error("Татах өгөгдөл олдсонгүй.", { id: toastId });
        return;
      }

      const wb = XLSX.utils.book_new();
      const mainData = fullData.map((app: any) => {
        const {
          family_members,
          education_history,
          work_experience,
          skills,
          extended_relatives,
          reference_persons,
          ...core
        } = app;
        return core;
      });
      const wsMain = XLSX.utils.json_to_sheet(mainData);
      XLSX.utils.book_append_sheet(wb, wsMain, "Анкетууд");

      const extractTable = (tableName: string, arrayName: keyof typeof fullData[0]) => {
        const rows: any[] = [];
        fullData.forEach((app: any) => {
          const arr = app[arrayName] as any[];
          if (arr && arr.length > 0) {
            arr.forEach((item: any) => {
              rows.push({
                Эзэмшигч_ID: app.id,
                Эзэмшигч_Овог: app.last_name,
                Эзэмшигч_Нэр: app.first_name,
                ...item,
              });
            });
          }
        });
        if (rows.length > 0) {
          const ws = XLSX.utils.json_to_sheet(rows);
          XLSX.utils.book_append_sheet(wb, ws, tableName);
        }
      };

      extractTable("Гэр бүл", "family_members");
      extractTable("Боловсрол", "education_history");
      extractTable("Туршлага", "work_experience");
      extractTable("Ур чадвар", "skills");
      extractTable("Садан төрөл", "extended_relatives");
      extractTable("Тодорхойлох хүмүүс", "reference_persons");

      const dateStr = new Date().toISOString().split("T")[0];
      XLSX.writeFile(wb, `Tugeelt_Anket_Export_${dateStr}.xlsx`);

      toast.success("Excel файл амжилттай татагдлаа!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error("Алдаа гарлаа: " + err.message, { id: toastId });
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      `${app.first_name || ""} ${app.last_name || ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.register_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.phone || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGender = genderFilter === "" || app.gender === genderFilter;
    const matchesPosition = positionFilter === "" || app.applying_for === positionFilter;
    const matchesStatus = statusFilter === "" || app.status === statusFilter;

    return matchesSearch && matchesGender && matchesPosition && matchesStatus;
  });

  const positions = Array.from(new Set(applications.map((a) => a.applying_for))).filter(Boolean);

  const stats = {
    total: applications.length,
    today: applications.filter(
      (a) => new Date(a.created_at).toDateString() === new Date().toDateString()
    ).length,
    pending: applications.filter((a) => (a.status || "pending") === "pending").length,
  };

  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const paginatedApps = filteredApps.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const calculateAge = (birthDateStr: string | null, birthYearStr: string | null) => {
    if (birthYearStr) return new Date().getFullYear() - parseInt(birthYearStr);
    if (birthDateStr) {
      const birthDate = new Date(birthDateStr);
      if (!isNaN(birthDate.getTime())) {
        return new Date().getFullYear() - birthDate.getFullYear();
      }
    }
    return "—";
  };

  const formatMongolianDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header with Title and Global Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Анкетуудын <span className="text-blue-600">Нэгдсэн Сан</span>
          </h1>
          <p className="text-slate-500 font-semibold text-xs mt-0.5 uppercase tracking-wider">
            Recruitment & HR Applications
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            onClick={handleDownloadBackup}
            className="bg-slate-900 text-white font-bold px-5 h-11 w-full md:w-auto rounded-xl shadow-sm hover:bg-slate-800 transition-all border-none text-xs uppercase tracking-wider cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" />
            Excel Татах
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Нийт анкет", value: stats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Өнөөдөр ирсэн", value: stats.today, icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Хүлээгдэж буй", value: stats.pending, icon: CheckCircle, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
            <div className="flex justify-between items-center">
              <div className={cn(stat.bg, "p-2.5 rounded-xl", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tabular-nums">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col lg:flex-row gap-3 items-center shadow-sm">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Нэр, регистр, эсвэл утсаар хайх..."
            className="pl-10 h-11 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium placeholder:text-slate-400 focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap md:flex-nowrap gap-2.5 w-full lg:w-auto">
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val === "all" ? "" : val || "")}>
            <SelectTrigger className="w-full lg:w-36 h-11 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs px-3 outline-none">
              <SelectValue placeholder="Төлөв" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-slate-200 shadow-xl">
              <SelectItem value="all">Бүх төлөв</SelectItem>
              <SelectItem value="pending">Хүлээгдэж буй</SelectItem>
              <SelectItem value="reviewed">Хянагдсан</SelectItem>
              <SelectItem value="accepted">Зөвшөөрсөн</SelectItem>
              <SelectItem value="rejected">Татгалзсан</SelectItem>
            </SelectContent>
          </Select>

          <Select value={genderFilter} onValueChange={(val) => setGenderFilter(val === "all" ? "" : val || "")}>
            <SelectTrigger className="w-full lg:w-32 h-11 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs px-3 outline-none">
              <SelectValue placeholder="Хүйс" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-slate-200 shadow-xl">
              <SelectItem value="all">Бүх хүйс</SelectItem>
              <SelectItem value="male">Эрэгтэй</SelectItem>
              <SelectItem value="female">Эмэгтэй</SelectItem>
            </SelectContent>
          </Select>

          <Select value={positionFilter} onValueChange={(val) => setPositionFilter(val === "all" ? "" : val || "")}>
            <SelectTrigger className="w-full lg:w-48 h-11 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs px-3 outline-none">
              <SelectValue placeholder="Ажлын байр" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-slate-200 shadow-xl">
              <SelectItem value="all">Бүх ажлын байр</SelectItem>
              {positions.map((pos: any) => (
                <SelectItem key={pos} value={pos}>{pos}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            className="w-full lg:w-auto h-11 px-3 font-bold uppercase text-[10px] tracking-wider text-slate-400 hover:text-blue-600 transition-colors"
            onClick={() => {
              setSearchTerm("");
              setGenderFilter("");
              setPositionFilter("");
              setStatusFilter("");
            }}
          >
            <FilterX className="h-4 w-4 mr-1" />
            Цэвэрлэх
          </Button>
        </div>
      </div>

      {/* Main Listing Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/70">
            <TableRow className="border-b border-slate-200">
              <TableHead className="px-5 h-11 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Зураг</TableHead>
              <TableHead className="h-11 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Нэр & Регистр</TableHead>
              <TableHead className="h-11 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Сонирхсон Ажил</TableHead>
              <TableHead className="h-11 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Холбоо барих</TableHead>
              <TableHead className="h-11 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Огноо</TableHead>
              <TableHead className="h-11 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Төлөв</TableHead>
              <TableHead className="pr-5 h-11 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-none">
                <TableCell colSpan={7} className="text-center py-20">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Уншиж байна...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredApps.length === 0 ? (
              <TableRow className="border-none">
                <TableCell colSpan={7} className="text-center py-24">
                  <div className="flex flex-col items-center gap-3 opacity-40">
                    <Search className="w-10 h-10 text-slate-400" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">Анкет олдсонгүй</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedApps.map((app) => (
                <TableRow
                  key={app.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors"
                >
                  <TableCell className="px-5 py-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                      {app.photo_url ? (
                        <img src={app.photo_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-[8px] font-bold uppercase p-1 text-center">
                          Зураггүй
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 leading-tight">
                        {app.last_name} {app.first_name}
                      </span>
                      <span className="text-[10px] font-mono font-medium text-slate-400 mt-0.5">
                        {app.register_number}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 min-w-[180px]">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-blue-600">{app.applying_for}</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge variant="outline" className="text-[8px] h-3.5 px-1 font-bold border-slate-200 bg-slate-50 text-slate-500 uppercase">
                          {app.gender === "male" ? "Эр" : "Эм"}
                        </Badge>
                        <span className="text-[10px] font-medium text-slate-400">
                          {calculateAge(app.birth_date, app.birth_year)} нас
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-bold text-xs">{app.phone}</span>
                      <span className="text-[10px] font-medium text-slate-400 truncate max-w-[140px]">
                        {app.email || "—"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-700">{formatMongolianDate(app.created_at)}</span>
                      <span className="text-[9px] font-medium text-slate-400">
                        {new Date(app.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <Select
                      disabled={loading}
                      value={app.status || "pending"}
                      onValueChange={async (newStatus) => {
                        const loadingToast = toast.loading(`${app.first_name}-н төлөвийг шинэчилж байна...`);
                        const result = await updateApplicationStatus(app.id, newStatus);
                        if (result.success) {
                          toast.success("Төлөв шинэчлэгдлээ", { id: loadingToast });
                          setApplications((apps) =>
                            apps.map((a) => (a.id === app.id ? { ...a, status: newStatus } : a))
                          );
                        } else {
                          toast.error("Алдаа гарлаа: " + result.error, { id: loadingToast });
                        }
                      }}
                    >
                      <SelectTrigger
                        className={cn(
                          "h-8 w-36 text-[10px] font-bold uppercase tracking-wider rounded-lg border shadow-none outline-none px-2.5",
                          app.status === "pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : app.status === "reviewed"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : app.status === "accepted"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : app.status === "rejected"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border border-slate-200 shadow-xl">
                        <SelectItem value="pending" className="text-[10px] font-bold uppercase">Хүлээгдэж буй</SelectItem>
                        <SelectItem value="reviewed" className="text-[10px] font-bold uppercase">Хянагдсан</SelectItem>
                        <SelectItem value="accepted" className="text-[10px] font-bold uppercase">Зөвшөөрсөн</SelectItem>
                        <SelectItem value="rejected" className="text-[10px] font-bold uppercase">Татгалзсан</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="pr-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/receipt/${app.id}?print=true`} target="_blank">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg border-slate-200 hover:bg-slate-100 text-slate-500 transition-all"
                          title="Хэвлэх (PDF)"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Link href={`/admin/applications/${app.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg border-slate-200 hover:bg-slate-900 hover:text-white transition-all text-slate-700"
                          title="Дэлгэрэнгүй харах"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">
            Нийт {filteredApps.length} анкетнаас {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredApps.length)} харагдаж байна
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg border-slate-200 hover:bg-slate-100 disabled:opacity-30"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  totalPages > 7 &&
                  pageNum !== 1 &&
                  pageNum !== totalPages &&
                  Math.abs(pageNum - currentPage) > 1
                ) {
                  if (pageNum === 2 || pageNum === totalPages - 1)
                    return <span key={pageNum} className="px-1 text-slate-400 text-xs">...</span>;
                  return null;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-8 w-8 rounded-lg transition-all font-bold text-xs p-0",
                      currentPage === pageNum
                        ? "bg-slate-900 border-slate-900 text-white"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg border-slate-200 hover:bg-slate-100 disabled:opacity-30"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
