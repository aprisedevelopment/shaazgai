"use client";

import { useEffect, useState, use } from "react";
import { applicationsApi } from "@/lib/anket-client";
import { Button } from "@/components/ui/button";
import {
  Printer,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Briefcase,
  Globe,
  GraduationCap,
  Users as FamilyIcon,
  Star,
  ShieldAlert,
  Heart,
  Target,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Truck,
  FileText,
  Award,
  Info,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { updateApplicationStatus } from "../actions";

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  pending: { label: "Хүлээгдэж буй", icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
  reviewed: { label: "Хянагдсан", icon: AlertCircle, color: "text-blue-600", bg: "bg-blue-100" },
  accepted: { label: "Зөвшөөрсөн", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
  rejected: { label: "Татгалзсан", icon: XCircle, color: "text-rose-600", bg: "bg-rose-100" },
};

export default function ApplicationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchFullDetails();
  }, [resolvedParams.id]);

  useEffect(() => {
    if (data && typeof window !== "undefined" && window.location.search.includes("print=true")) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [data]);

  const fetchFullDetails = async () => {
    setLoading(true);
    try {
      const response = await applicationsApi.get(resolvedParams.id);
      setData(response.data);
    } catch (error: any) {
      console.error(error);
      toast.error("Дэлгэрэнгүй татахад алдаа гарлаа: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const result = await updateApplicationStatus(resolvedParams.id, newStatus);
      if (!result.success) throw new Error(result.error);
      setData({ ...data, status: newStatus });
      toast.success("Төлөв амжилттай шинэчлэгдлээ");
    } catch (error: any) {
      toast.error("Алдаа гарлаа: " + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const translateLevel = (level: string) => {
    const map: any = {
      bad: "Муу",
      medium: "Дунд",
      good: "Сайн",
      excellent: "Маш сайн",
      none: "Мэдэхгүй",
    };
    return map[level] || level;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Уншиж байна...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <p className="text-lg font-bold text-slate-900">Анкет олдсонгүй.</p>
        <Link href="/admin/applications">
          <Button variant="outline">Анкетууд руу буцах</Button>
        </Link>
      </div>
    );
  }

  const statusInfo = STATUS_CONFIG[data.status || "pending"] || STATUS_CONFIG.pending;
  const isDriverJob = !!(data?.truck_details || data?.pro_license_url);

  return (
    <div className="min-h-screen pb-20 font-sans selection:bg-blue-100">
      {/* 1. INTERACTIVE TABBED VIEW (On-screen) */}
      <div className="space-y-6 print:hidden">
        {/* Navigation & Status Header */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Link href="/admin/applications">
              <Button variant="outline" className="h-10 w-10 p-0 rounded-xl border-slate-200 hover:bg-slate-50 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="h-8 w-[1px] bg-slate-200" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden shrink-0">
                {data.photo_url ? (
                  <img src={data.photo_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-slate-900 leading-tight uppercase tracking-tight truncate">
                  {data.last_name} {data.first_name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{data.applying_for}</p>
                  <Badge variant="outline" className="text-[8px] h-4 font-bold border-slate-200 bg-slate-50 text-slate-400 uppercase tracking-tighter px-1.5">
                    ID: {data.id.slice(0, 8)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-slate-50 px-3 py-1.5 rounded-xl flex items-center flex-1 sm:flex-none border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase px-2 shrink-0 tracking-wider">Төлөв:</span>
              <Select disabled={updating} value={data.status || "pending"} onValueChange={updateStatus}>
                <SelectTrigger className={cn("flex-1 sm:w-40 h-8 border-none bg-white font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-sm outline-none px-3", statusInfo.color)}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-slate-200 shadow-xl">
                  {Object.entries(STATUS_CONFIG).map(([val, info]) => (
                    <SelectItem key={val} value={val} className="text-[10px] font-bold uppercase py-2 outline-none cursor-pointer hover:bg-slate-50">
                      <div className="flex items-center gap-2">
                        <info.icon className="w-3.5 h-3.5" /> {info.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handlePrint}
              className="bg-slate-900 text-white font-bold h-11 px-5 rounded-xl shadow-sm hover:bg-slate-800 transition-all border-none text-xs uppercase tracking-wider cursor-pointer"
            >
              <Printer className="w-4 h-4 mr-2" /> Хэвлэх / PDF
            </Button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full justify-start bg-slate-50 p-1.5 h-auto rounded-xl gap-1 mb-8 overflow-x-auto no-scrollbar flex-nowrap shrink-0 border border-slate-200">
              <TabTrigger value="general" icon={Info} label="Ерөнхий" />
              <TabTrigger value="family" icon={FamilyIcon} label="Гэр бүл" />
              <TabTrigger value="history" icon={Briefcase} label="Түүх" />
              <TabTrigger value="skills" icon={Award} label="Ур чадвар" />
              {isDriverJob && <TabTrigger value="driver" icon={Truck} label="Жолооч" />}
              <TabTrigger value="other" icon={Star} label="Бусад" />
              <TabTrigger value="files" icon={FileText} label="Файлууд" />
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="outline-none space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <SectionTitle title="Хувийн мэдээлэл" icon={User} />
                  <div className="bg-slate-50/60 border border-slate-200 rounded-2xl p-6 grid grid-cols-2 gap-6 shadow-sm">
                    <DataField label="Ургийн овог" value={data.surname} />
                    <DataField label="Эцэг/Эх" value={data.last_name} />
                    <DataField label="Өөрийн нэр" value={data.first_name} />
                    <DataField label="Регистр" value={data.register_number} mono />
                    <DataField label="Төрсөн огноо" value={data.birth_date || `${data.birth_year}.${data.birth_month}.${data.birth_day}`} />
                    <DataField label="Төрсөн газар" value={data.birth_place} />
                    <DataField label="Хүйс" value={data.gender === "male" ? "Эрэгтэй" : "Эмэгтэй"} />
                    <DataField label="Гэрлэлт" value={data.marital_status === "single" ? "Ганц бие" : "Гэрлэсэн"} />
                  </div>
                </div>

                <div className="space-y-4">
                  <SectionTitle title="Холбоо барих" icon={Phone} />
                  <div className="bg-slate-50/60 border border-slate-200 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 shadow-sm">
                    <DataField label="Гар утас" value={data.phone_mobile || data.phone} highlight />
                    <DataField label="Имэйл" value={data.email} />
                    <div className="col-span-1 sm:col-span-2 space-y-6">
                      <DataField label="Байнгын хаяг" value={data.address_current || data.address} />
                      <DataField label="Түр хаяг" value={data.temp_address || data.address_temp} />
                      <DataField label="Facebook" value={data.facebook_url} />
                      <div className="space-y-3 pt-4 border-t border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Яаралтай холбоо барих</p>
                        {Array.isArray(data.emergency_contacts) ? (
                          data.emergency_contacts.map((ec: any, i: number) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 w-6 h-6 rounded-md flex items-center justify-center shrink-0">
                                {i + 1}
                              </span>
                              <p className="text-xs font-semibold text-slate-700">{typeof ec === "string" ? ec : ec.details || ec.name || "—"}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs font-semibold text-slate-700">
                            {data.emergency_contact?.name} / {data.emergency_contact?.phone} ({data.emergency_contact?.relation})
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Family Tab */}
            <TabsContent value="family" className="outline-none space-y-8">
              <div className="space-y-4">
                <SectionTitle title="Гэр бүл (Хамт амьдардаг)" icon={FamilyIcon} />
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3.5">Төрөл</th>
                        <th className="px-5 py-3.5">Овог нэр</th>
                        <th className="px-5 py-3.5 text-center">Төрсөн он</th>
                        <th className="px-5 py-3.5">Ажил / Сургууль</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold">
                      {data.family_members?.map((m: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-3.5 text-[10px] font-bold uppercase text-blue-600 tracking-wider">{m.relation}</td>
                          <td className="px-5 py-3.5 text-slate-900">{m.last_name} {m.first_name}</td>
                          <td className="px-5 py-3.5 text-center text-slate-500 tabular-nums">{m.birth_year}</td>
                          <td className="px-5 py-3.5 text-slate-600">{m.occupation} @ {m.workplace_school}</td>
                        </tr>
                      ))}
                      {(!data.family_members || data.family_members.length === 0) && (
                        <tr>
                          <td colSpan={4} className="px-5 py-8 text-center text-slate-400 font-medium text-xs">
                            Мэдээлэл ороогүй
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4">
                <SectionTitle title="Садан төрөл (Тусдаа)" icon={Globe} />
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3.5">Хамаарал</th>
                        <th className="px-5 py-3.5">Овог нэр</th>
                        <th className="px-5 py-3.5">Ажил</th>
                        <th className="px-5 py-3.5">Холбоо барих</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold">
                      {data.extended_relatives?.map((rel: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-3.5 text-[10px] font-bold uppercase text-blue-600 tracking-wider">{rel.relation}</td>
                          <td className="px-5 py-3.5 text-slate-900">{rel.full_name}</td>
                          <td className="px-5 py-3.5 text-slate-600">{rel.occupation}</td>
                          <td className="px-5 py-3.5 text-slate-500">{rel.workplace} / {rel.contact_info}</td>
                        </tr>
                      ))}
                      {(!data.extended_relatives || data.extended_relatives.length === 0) && (
                        <tr>
                          <td colSpan={4} className="px-5 py-8 text-center text-slate-400 font-medium text-xs">
                            Мэдээлэл ороогүй
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="outline-none space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <SectionTitle title="Ажлын туршлага" icon={Briefcase} />
                  <div className="space-y-6 pl-6 border-l-2 border-slate-200 ml-3">
                    {data.work_experience?.map((w: any, i: number) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-white border-3 border-blue-600 shadow-sm" />
                        <p className="text-sm font-bold text-slate-900 leading-tight mb-0.5">{w.company_name}</p>
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-wider mb-2">
                          <span>{w.position}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-slate-400 tabular-nums">{w.start_date} — {w.end_date || "Одоо"}</span>
                        </div>
                        {w.reason_for_leaving && (
                          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-600 italic">
                            "{w.reason_for_leaving}"
                          </div>
                        )}
                      </div>
                    ))}
                    {(!data.work_experience || data.work_experience.length === 0) && (
                      <div className="py-8 text-center text-slate-400 text-xs">Мэдээлэл ороогүй</div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <SectionTitle title="Боловсрол" icon={GraduationCap} />
                  <div className="space-y-3">
                    {data.education_history?.map((e: any, i: number) => (
                      <div key={i} className="bg-slate-50/60 border border-slate-200 p-4 rounded-xl shadow-sm flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-tight mb-0.5">{e.school_name}</p>
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">{e.degree} — {e.major}</p>
                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                            <Calendar className="w-3 h-3" /> {e.entry_year} — {e.graduation_year}
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!data.education_history || data.education_history.length === 0) && (
                      <div className="py-8 text-center text-slate-400 text-xs">Мэдээлэл ороогүй</div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="outline-none space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <SectionTitle title="Хэлний мэдлэг" icon={Globe} />
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                        <tr>
                          <th className="px-5 py-3.5 text-left">Хэл</th>
                          <th className="px-5 py-3.5 text-center">Сонсох</th>
                          <th className="px-5 py-3.5 text-center">Ярих</th>
                          <th className="px-5 py-3.5 text-center">Бичих</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {data.skills?.[0]?.language_matrix?.map((l: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-5 py-3.5 font-bold text-slate-800 uppercase text-[11px]">{l.language}</td>
                            <td className="px-5 py-3.5 text-center"><SkillBadge value={translateLevel(l.listening)} /></td>
                            <td className="px-5 py-3.5 text-center"><SkillBadge value={translateLevel(l.speaking)} /></td>
                            <td className="px-5 py-3.5 text-center"><SkillBadge value={translateLevel(l.writing)} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-4">
                  <SectionTitle title="Компьютер / Програм хангамж" icon={Target} />
                  <div className="grid grid-cols-2 gap-4">
                    <SkillCard label="Windows" value={translateLevel(data.skills?.[0]?.pc_matrix?.windows)} />
                    <SkillCard label="MS Office" value={translateLevel(data.skills?.[0]?.pc_matrix?.msOffice)} />
                    <SkillCard label="Adobe Suite" value={translateLevel(data.skills?.[0]?.pc_matrix?.adobe)} />
                    <SkillCard label="Бусад" value={data.skills?.[0]?.pc_matrix?.others || "Байхгүй"} />
                  </div>
                  {data.skills?.[0]?.pc_matrix?.otherDetails && (
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl italic text-xs text-slate-600 leading-relaxed font-medium">
                      "{data.skills[0].pc_matrix.otherDetails}"
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Driver Tab */}
            {isDriverJob && (
              <TabsContent value="driver" className="outline-none space-y-6">
                <div className="bg-slate-50/60 border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Тээврийн хэрэгслийн дэлгэрэнгүй</h4>
                        <div className="p-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed font-semibold whitespace-pre-wrap">
                          {data.truck_details}
                        </div>
                      </div>
                      {data.pro_license_url && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Мэргэшсэн үнэмлэх</p>
                          <img src={data.pro_license_url} className="w-full max-w-xs rounded-xl border border-slate-200 shadow-sm" alt="License" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Тээврийн хэрэгслийн зургууд</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {data.truck_photos?.map((p: string, i: number) => (
                          <img key={i} src={p} className="w-full aspect-square object-cover rounded-xl border border-slate-200 shadow-sm" alt="Truck" />
                        ))}
                        {(!data.truck_photos || data.truck_photos.length === 0) && (
                          <div className="col-span-2 py-8 text-center text-slate-400 text-xs font-bold uppercase">Зураг ороогүй</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}

            {/* Other Tab */}
            <TabsContent value="other" className="outline-none space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <OtherItem icon={Heart} label="Эрүүл мэнд" value={data.health_info?.illnesses || "Хэвийн"} subValue={`Зуршил: ${data.health_info?.badHabits || "Байхгүй"}`} />
                <OtherItem icon={Target} label="Хүсэж буй цалин" value={data.desired_salary || "Тохиролцоно"} subValue={`Ажилд орох огноо: ${data.available_date || "Шууд"}`} />
                <OtherItem icon={Star} label="Давуу & Сул тал" value={data.strengths || "—"} subValue={`Сул тал: ${data.weaknesses || "—"}`} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <SectionTitle title="Ирээдүйн зорилго" icon={Target} />
                  <div className="p-6 bg-slate-50/60 border border-slate-200 rounded-2xl shadow-sm text-xs text-slate-700 leading-relaxed font-medium">
                    {data.future_goals || "Тодорхойлоогүй"}
                  </div>
                </div>

                <div className="space-y-4">
                  <SectionTitle title="Дотоод зуучлал / Санал нэгдсэн" icon={ShieldAlert} />
                  <div className="p-6 bg-slate-50/60 border border-slate-200 rounded-2xl shadow-sm space-y-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-0.5">Хамтран ажилладаг хүн бий юу?</p>
                      <p className="font-bold text-blue-600 text-sm uppercase">{data.internal_referral ? `Тийм (${data.internal_referral_details})` : "Үгүй"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-0.5">Ял шийтгэлтэй эсэх</p>
                      <p className="font-bold text-slate-800 text-sm">{data.criminal_record ? `Тийм (${data.criminal_record_details})` : "Үгүй"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <SectionTitle title="Тодорхойлох 3 хүн" icon={FamilyIcon} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.reference_persons?.map((r: any, i: number) => (
                    <div key={i} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-500 transition-all">
                      <p className="text-xs font-bold uppercase text-slate-900">{r.full_name}</p>
                      <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-0.5 mb-3">{r.occupation} @ {r.workplace}</p>
                      <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-slate-500 font-bold text-xs">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {r.contact_info}
                      </div>
                    </div>
                  ))}
                  {(!data.reference_persons || data.reference_persons.length === 0) && (
                    <div className="col-span-3 py-8 text-center text-slate-400 text-xs">Мэдээлэл ороогүй</div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Files Tab */}
            <TabsContent value="files" className="outline-none">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <FileCard href={data.photo_url} label="Цээж зураг" />
                <FileCard href={data.id_card_url} label="Иргэний үнэмлэх" />
                <FileCard href={data.diploma_url} label="Диплом" />
                {data.pro_license_url && <FileCard href={data.pro_license_url} label="Мэргэшсэн үнэмлэх" />}
                <FileCard href={data.video_url} label="Видео танилцуулга" isVideo />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media print {
          .print\\:hidden { display: none !important; }
          body { background-color: white !important; }
          @page { size: A4; margin: 5mm; }
        }
      `}</style>
    </div>
  );
}

// ----------------------------------------------------------------------------
// REUSABLE UI COMPONENTS
// ----------------------------------------------------------------------------

function TabTrigger({ value, icon: Icon, label }: { value: string; icon: any; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider text-slate-500 transition-all shrink-0 border-none outline-none cursor-pointer"
    >
      <Icon className="w-3.5 h-3.5" /> {label}
    </TabsTrigger>
  );
}

function SectionTitle({ title, icon: Icon }: { title: string; icon?: any }) {
  return (
    <div className="flex items-center gap-2.5">
      {Icon && (
        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{title}</h3>
    </div>
  );
}

function DataField({ label, value, mono = false, highlight = false }: { label: string; value: any; mono?: boolean; highlight?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">{label}</p>
      <p className={cn("text-xs font-semibold leading-tight", highlight ? "text-blue-600 font-bold" : "text-slate-900", mono && "font-mono")}>
        {value || "—"}
      </p>
    </div>
  );
}

function SkillBadge({ value }: { value: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[9px] font-bold uppercase px-2.5 py-0.5 border whitespace-nowrap",
        value === "Сайн" || value === "Маш сайн"
          ? "text-emerald-700 bg-emerald-50 border-emerald-200"
          : "text-slate-500 bg-slate-50 border-slate-200"
      )}
    >
      {value}
    </Badge>
  );
}

function SkillCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col items-center text-center">
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xs font-bold text-slate-800 uppercase">{value || "—"}</p>
    </div>
  );
}

function OtherItem({ icon: Icon, label, value, subValue }: any) {
  return (
    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col gap-4">
      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
        <h4 className="text-xs font-bold text-slate-900 uppercase leading-snug">{value || "Байхгүй"}</h4>
        {subValue && <p className="text-[10px] font-medium text-slate-400 mt-2 border-t border-slate-100 pt-2">{subValue}</p>}
      </div>
    </div>
  );
}

function FileCard({ href, label, isVideo = false }: { href: string; label: string; isVideo?: boolean }) {
  if (!href) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-200 aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 opacity-50 p-3 text-center">
        <XCircle className="w-5 h-5 text-slate-300" />
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{label} байхгүй</span>
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="bg-white border border-slate-200 p-4 aspect-square rounded-2xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 relative group text-center"
    >
      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
        {isVideo ? <Clock className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 leading-tight">{label}</span>
      <div className="absolute top-2.5 right-2.5 text-slate-300 group-hover:text-blue-600 transition-colors">
        <ExternalLink className="w-3.5 h-3.5" />
      </div>
    </a>
  );
}
