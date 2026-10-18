"use client";

import { Suspense } from "react";
import MultiStepForm from "@/components/forms/MultiStepForm";
import Link from "next/link";
import { Sparkles, ArrowLeft, Search, Briefcase } from "lucide-react";

export default function AnketApplyPage() {
  return (
    <div className="min-h-screen py-4 md:py-8 font-sans selection:bg-blue-600 selection:text-white">
      {/* Sub-header Navigation / Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-wider bg-slate-100 hover:bg-blue-50 px-3.5 py-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Нээлттэй ажлын байрууд
          </Link>
          <span className="text-slate-300">|</span>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl">
            <Sparkles className="w-3.5 h-3.5" />
            Хүний нөөцийн анкет
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/anket/track"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm"
          >
            <Search className="w-3.5 h-3.5 text-blue-600" />
            Анкетын явц шалгах
          </Link>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-10 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            <Briefcase className="w-3 h-3" />
            Career Application Portal
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Ажилд орох <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">мэдүүлэг</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Монголын хамгийн том онлайн худалдааны экосистемд нэгдэж, мэргэжлийн найрсаг хамт олонтой хамт хөгжих боломжийг бүү алдаарай.
          </p>
        </div>
      </div>

      {/* Main Multi-Step Form */}
      <div className="bg-transparent">
        <Suspense
          fallback={
            <div className="h-[500px] w-full flex flex-col items-center justify-center space-y-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Анкетыг ачааллаж байна...</p>
            </div>
          }
        >
          <MultiStepForm />
        </Suspense>
      </div>
    </div>
  );
}
