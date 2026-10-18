"use client";

import { useEffect, useState } from "react";
import { jobsApi } from "@/lib/anket-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, Edit, Briefcase, Calendar, Power, ExternalLink, MapPin } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminJobsPage() {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const response = await jobsApi.list(true);
      setPositions(response.data || []);
    } catch (error: any) {
      console.error(error);
      toast.error("Мэдээлэл татахад алдаа гарлаа: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    const toastId = toast.loading("Өөрчилж байна...");
    try {
      await jobsApi.update(id, { is_active: !currentStatus });
      toast.success("Төлөв өөрчлөгдлөө!", { id: toastId });
      fetchPositions();
    } catch (err: any) {
      toast.error("Алдаа гарлаа: " + err.message, { id: toastId });
    }
  };

  const deletePosition = async (id: string, title: string) => {
    if (!confirm(`"${title}" ажлын байрыг бүрмөсөн устгах уу?`)) return;

    const toastId = toast.loading("Устгаж байна...");
    try {
      await jobsApi.delete(id);
      toast.success("Амжилттай устгагдлаа!", { id: toastId });
      fetchPositions();
    } catch (err: any) {
      toast.error("Алдаа гарлаа: " + err.message, { id: toastId });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Нээлттэй <span className="text-blue-600">Ажлын Байр</span>
          </h1>
          <p className="text-slate-500 font-semibold text-xs mt-0.5 uppercase tracking-wider">
            Job Positions Management
          </p>
        </div>
        <Link href="/admin/jobs/new">
          <Button className="bg-slate-900 text-white font-bold px-5 h-11 rounded-xl shadow-sm hover:bg-slate-800 transition-all border-none text-xs uppercase tracking-wider cursor-pointer">
            <PlusCircle className="w-4 h-4 mr-2" />
            Шинэ ажлын байр нэмэх
          </Button>
        </Link>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/70">
            <TableRow className="border-b border-slate-200">
              <TableHead className="px-5 h-11 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Ажлын байрны нэр
              </TableHead>
              <TableHead className="h-11 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Байршил / Төрөл
              </TableHead>
              <TableHead className="h-11 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Төлөв
              </TableHead>
              <TableHead className="h-11 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Огноо
              </TableHead>
              <TableHead className="pr-5 h-11 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Үйлдэл
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-none">
                <TableCell colSpan={5} className="text-center py-20">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Уншиж байна...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : positions.length === 0 ? (
              <TableRow className="border-none">
                <TableCell colSpan={5} className="text-center py-24">
                  <div className="flex flex-col items-center gap-3 opacity-40">
                    <Briefcase className="w-10 h-10 text-slate-400" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Ажлын байр бүртгэгдээгүй байна
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              positions.map((pos) => (
                <TableRow
                  key={pos.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors"
                >
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 leading-tight">
                          {pos.title}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mt-0.5">
                          {pos.department || "Хэлтэс тодорхойгүй"} {pos.is_driver_job ? "• Жолооч" : ""}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{pos.location || "Улаанбаатар"}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5">{pos.employment_type || "Бүтэн цаг"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <button
                      onClick={() => toggleStatus(pos.id, pos.is_active)}
                      className="cursor-pointer group"
                      title="Төлөв солих"
                    >
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5",
                          pos.is_active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 border-slate-200 group-hover:bg-slate-200"
                        )}
                      >
                        <Power className="w-2.5 h-2.5" />
                        {pos.is_active ? "Нээлттэй" : "Хаагдсан"}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="tabular-nums">
                        {pos.created_at || (pos as any).createdAt
                          ? new Date(pos.created_at || (pos as any).createdAt).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="pr-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/jobs/${pos.id}`} target="_blank">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg border-slate-200 text-slate-500 hover:bg-slate-100 transition-all"
                          title="Портал дээр харах"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Link href={`/admin/jobs/edit/${pos.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white transition-all"
                          title="Засах"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletePosition(pos.id, pos.title)}
                        className="h-8 w-8 p-0 rounded-lg border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"
                        title="Устгах"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
