"use client";

import { useEffect, useState, use } from "react";
import { jobsApi } from "@/lib/anket-client";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Building2,
  Clock,
  CheckCircle2,
  Info,
  Shield,
  Briefcase,
  Trophy,
  Zap,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      if (!id) return;
      try {
        const response = await jobsApi.get(id);
        if (response.data) {
          setJob(response.data);
        }
      } catch (err) {
        console.error("Fetch job error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Ачааллаж байна...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
          <Briefcase className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-2xl font-bold text-slate-900">Ажлын байр олдсонгүй</h1>
          <p className="text-sm text-slate-500">
            Энэ ажлын байр хаагдсан эсвэл устгагдсан байж болзошгүй тул нээлттэй ажлын байруудын жагсаалт руу буцна уу.
          </p>
        </div>
        <Link href="/jobs">
          <Button className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ажлын байрууд руу буцах
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 md:py-8 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top back navigation */}
      <div className="flex items-center justify-between mb-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-wider bg-slate-100 hover:bg-blue-50 px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Бүх ажлын байр
        </Link>
        <Link href={`/anket?jobTitle=${encodeURIComponent(job.title)}`}>
          <button className="text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer">
            Яг одоо анкет бөглөх
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-10 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Нээлттэй ажлын байр
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {job.department && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-200">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{job.department}</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{job.location || "Улаанбаатар"}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-200">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>{job.employment_type || "Бүтэн цаг"}</span>
              </div>
              {job.salary_range && (
                <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 px-3.5 py-1.5 rounded-xl text-xs font-bold text-amber-300">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>{job.salary_range}</span>
                </div>
              )}
            </div>
          </div>

          {job.image_url && (
            <div className="lg:col-span-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                <img src={job.image_url} alt={job.title} className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Details + Apply Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {job.description && (
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Info className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Ерөнхий тайлбар</h3>
              </div>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </section>
          )}

          {job.responsibilities && (
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Гүйцэтгэх үндсэн үүрэг</h3>
              </div>
              <ul className="space-y-3">
                {job.responsibilities
                  .split("\n")
                  .filter((r: string) => r.trim() !== "")
                  .map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span>{item.replace(/^- /, "")}</span>
                    </li>
                  ))}
              </ul>
            </section>
          )}

          {job.requirements && (
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Тавигдах шаардлага</h3>
              </div>
              <ul className="space-y-3">
                {job.requirements
                  .split("\n")
                  .filter((r: string) => r.trim() !== "")
                  .map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      <span>{item.replace(/^- /, "")}</span>
                    </li>
                  ))}
              </ul>
            </section>
          )}
        </div>

        {/* Sidebar Apply CTA Card */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Шууд бүртгүүлэх</span>
              <h4 className="text-xl font-bold text-slate-900 leading-snug">
                Амжилтаа хамтдаа эхлүүлээрэй
              </h4>
            </div>

            {job.benefits && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Бид юу санал болгох вэ?</p>
                <ul className="space-y-2.5">
                  {job.benefits
                    .split("\n")
                    .filter((b: string) => b.trim() !== "")
                    .map((bnf: string, i: number) => (
                      <li key={i} className="text-xs font-semibold text-slate-700 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{bnf.replace(/^- /, "")}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            <Link href={`/anket?jobTitle=${encodeURIComponent(job.title)}`} className="block">
              <button className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
                Анкет бөглөх
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
