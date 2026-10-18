"use client";

import { useEffect, useState } from "react";
import { jobsApi } from "@/lib/anket-client";
import Link from "next/link";
import { ArrowRight, MapPin, Building2, Clock, Users, Sparkles, Briefcase, Search, FileEdit } from "lucide-react";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDepartment, setFilterDepartment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await jobsApi.list();
        if (response.data) {
          // Only show active positions on public portal
          setJobs(response.data.filter((j: any) => j.is_active !== false));
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const departments = Array.from(new Set(jobs.map((j) => j.department).filter(Boolean)));

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      (job.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = !filterDepartment || job.department === filterDepartment;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen py-4 md:py-8 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3.5 py-2 rounded-xl">
            <Sparkles className="w-4 h-4" />
            Хүний нөөцийн сонгон шалгаруулалт
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/anket/track"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm"
          >
            <Search className="w-3.5 h-3.5 text-blue-600" />
            Анкетын явц шалгах
          </Link>
          <Link
            href="/anket"
            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-md shadow-blue-500/20"
          >
            <FileEdit className="w-3.5 h-3.5" />
            Шууд анкет илгээх
          </Link>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 sm:p-14 mb-12 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              <Users className="w-3.5 h-3.5" />
              Join Our Growing Team
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Ирээдүйгээ хамтдаа <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                бүтээцгээе.
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Бид хамгийн шилдэг залуусыг өөрсдийн эгнээндээ нэгтгэж, хамтдаа цахим худалдаа, түгээлтийн дэвшилтэт ирээдүйг цогцлоож байна.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-blue-600/30 flex items-center justify-center text-blue-300 font-bold">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{jobs.length}+</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Нээлттэй ажлын байр</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
          <button
            onClick={() => setFilterDepartment("")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              filterDepartment === ""
                ? "bg-slate-900 text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Бүгд ({jobs.length})
          </button>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setFilterDepartment(dept)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                filterDepartment === dept
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Хайх (албан тушаал, түлхүүр үг)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Job Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((sk) => (
            <div key={sk} className="h-80 bg-white animate-pulse rounded-2xl border border-slate-200 shadow-sm" />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
          <div className="w-16 h-16 bg-slate-100 mx-auto rounded-2xl flex items-center justify-center mb-4 text-slate-400">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Одоогоор ажлын байр олдсонгүй</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            Та ерөнхий анкет бөглөн хүний нөөцийн санд өөрийн мэдээллээ бүртгүүлэх боломжтой.
          </p>
          <Link
            href="/anket"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
          >
            Ерөнхий анкет бөглөх <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`} className="group h-full">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 overflow-hidden">
                {/* Visual Cover Header */}
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                  {job.image_url ? (
                    <img
                      src={job.image_url}
                      alt={job.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-slate-100">
                      <Briefcase className="w-12 h-12 text-blue-300 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  )}

                  {job.department && (
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-blue-600 uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                      <Building2 className="w-3 h-3" />
                      {job.department}
                    </div>
                  )}

                  {job.salary_range && (
                    <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-amber-300 tracking-wide shadow-sm">
                      {job.salary_range}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                    {job.title}
                  </h3>

                  <div className="space-y-2 text-xs text-slate-500 font-medium flex-grow">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.location || "Улаанбаатар"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.employment_type || "Бүтэн цаг"}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                    <span className="group-hover:translate-x-1 transition-transform">Дэлгэрэнгүй харах</span>
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
