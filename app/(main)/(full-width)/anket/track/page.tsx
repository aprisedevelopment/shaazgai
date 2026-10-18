"use client";

import { useState } from "react";
import { trackApi } from "@/lib/anket-client";
import {
  Search,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  CheckCircle,
  LayoutGrid,
  User,
  Briefcase,
  Sparkles,
  ShieldCheck,
  SendHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "pending", title: "Анкет илгээгдсэн", desc: "Таны анкет системд бүртгэгдсэн.", icon: Clock, color: "bg-blue-600" },
  { id: "reviewed", title: "Хянагдаж байна", desc: "Хүний нөөцийн хэлтэс танилцаж байна.", icon: AlertCircle, color: "bg-amber-500" },
  { id: "decision", title: "Хариу гарсан", desc: "Шалгаруулалтын шийдвэр гарсан.", icon: CheckCircle2, color: "bg-green-600" },
];

export default function TrackApplicationPage() {
  const [phone, setPhone] = useState("");
  const [registerNo, setRegisterNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState<any | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !registerNo) {
      toast.error("Утасны дугаар болон регистрийн дугаараа бүрэн оруулна уу.");
      return;
    }

    setLoading(true);
    setApplication(null);

    try {
      const response = await trackApi.search(phone.trim(), registerNo.trim());
      if (response.data) {
        setApplication(response.data);
        toast.success("Таны анкет олдлоо.");
      }
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("not found") || error.message?.includes("404")) {
        toast.error("Ийм мэдээлэлтэй анкет олдсонгүй. Мэдээллээ дахин шалгана уу.");
      } else {
        toast.error("Алдаа гарлаа: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepId: string, currentStatus: string) => {
    if (stepId === "pending") return "completed";
    if (stepId === "reviewed") {
      if (currentStatus === "pending") return "current";
      return "completed";
    }
    if (stepId === "decision") {
      if (currentStatus === "accepted" || currentStatus === "rejected") return "completed";
      if (currentStatus === "reviewed") return "current";
      return "upcoming";
    }
    return "upcoming";
  };

  return (
    <div className="min-h-screen py-4 md:py-8 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top back navigation */}
      <div className="flex items-center justify-between mb-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-wider bg-slate-100 hover:bg-blue-50 px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Ажлын байрууд
        </Link>
        <Link href="/anket">
          <Button variant="outline" className="text-xs font-bold rounded-xl border-slate-200">
            Шинэ анкет бөглөх
          </Button>
        </Link>
      </div>

      {!application ? (
        <div className="max-w-xl mx-auto space-y-8 my-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
              <Search className="w-3.5 h-3.5" />
              Application Status
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Анкетын явц <span className="text-blue-600">хянах</span>
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
              Анкет илгээхэд бүртгүүлсэн утасны дугаар болон регистрийн дугаараа оруулан шалгаруулалтын явцыг харна уу.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-lg border border-slate-200/80">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Утасны дугаар
                </Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Жишээ: 88112233"
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 text-base font-semibold px-4 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Регистрийн дугаар
                </Label>
                <Input
                  value={registerNo}
                  onChange={(e) => setRegisterNo(e.target.value)}
                  placeholder="Жишээ: УШ90010111"
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 text-base font-semibold px-4 uppercase focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase tracking-wider shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Шалгах
                    <SendHorizontal className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-8 my-8">
          {/* Candidate Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg text-center relative overflow-hidden">
            <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden mb-4 border-2 border-slate-200 bg-slate-50 flex items-center justify-center">
              {application.photo_url ? (
                <img src={application.photo_url} alt="Photo" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-slate-300" />
              )}
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              {application.last_name} {application.first_name}
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold uppercase">
                <Briefcase className="w-3.5 h-3.5" />
                {application.applying_for}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase border",
                  application.status === "accepted"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : application.status === "rejected"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : application.status === "reviewed"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                )}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {application.status === "accepted"
                  ? "Зөвшөөрсөн"
                  : application.status === "rejected"
                  ? "Сонгогдоогүй"
                  : application.status === "reviewed"
                  ? "Хянагдсан"
                  : "Хүлээгдэж буй"}
              </span>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Илгээсэн: {application.created_at ? format(new Date(application.created_at), "yyyy-MM-dd") : "—"}</span>
              <button
                onClick={() => setApplication(null)}
                className="text-blue-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Өөр анкет шалгах
              </button>
            </div>
          </div>

          {/* Decision Status Callout */}
          {(application.status === "accepted" || application.status === "rejected") && (
            <div
              className={cn(
                "p-6 sm:p-8 rounded-2xl border text-center space-y-2 shadow-sm",
                application.status === "accepted"
                  ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                  : "bg-rose-50/70 border-rose-200 text-rose-900"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-white mb-3",
                  application.status === "accepted" ? "bg-emerald-600" : "bg-rose-600"
                )}
              >
                {application.status === "accepted" ? <Sparkles className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">
                {application.status === "accepted" ? "БАЯР ХҮРГЭЕ! ТА ТЭНЦЛЭЭ 🎉" : "ШАЛГАРУУЛАЛТЫН ХАРИУ 📋"}
              </h3>
              <p className="text-sm font-medium leading-relaxed max-w-lg mx-auto opacity-90">
                {application.status === "accepted"
                  ? `Та "${application.applying_for}" ажлын байрны эхний шалгаруулалтад тэнцлээ. Манай хүний нөөцийн баг тантай удахгүй холбогдож, дараагийн шатны мэдээллийг өгөх болно.`
                  : `Таны "${application.applying_for}" ажлын байранд илгээсэн анкеттай бид анхааралтай танилцлаа. Харамсалтай нь энэ удаад өөр нэр дэвшигчийг сонгохоор шийдвэрлэлээ. Танд амжилт хүсье.`}
              </p>
            </div>
          )}

          {/* Stepper Timeline */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Шалгаруулалтын шатууд</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STEPS.map((step) => {
                const status = getStepStatus(step.id, application.status);
                const isCompleted = status === "completed";
                const isCurrent = status === "current";
                const StepIcon = step.icon;

                return (
                  <div
                    key={step.id}
                    className={cn(
                      "p-5 rounded-2xl border transition-all flex flex-col gap-3",
                      isCompleted
                        ? "bg-slate-50 border-slate-200"
                        : isCurrent
                        ? "bg-blue-50/50 border-blue-300 ring-2 ring-blue-100"
                        : "bg-white border-slate-100 opacity-40"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-white",
                        isCompleted ? step.color : isCurrent ? "bg-blue-600 animate-pulse" : "bg-slate-300"
                      )}
                    >
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sm text-slate-800">
                        <span>{step.title}</span>
                        {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-snug">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
