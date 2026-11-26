"use client";

import { useEffect, useState, use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { applicationsApi } from "@/lib/anket-client";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft, AlertCircle, Lock } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

const MARITAL_STATUS_LABELS: Record<string, string> = {
  single: "Ганц бие",
  married: "Гэрлэсэн",
  widowed: "Бэлэвсэн",
  divorced: "Салсан",
};

const DEGREE_LABELS: Record<string, string> = {
  secondary: "Бүрэн дунд",
  bachelor: "Бакалавр",
  master: "Магистр",
  doctor: "Доктор",
};

function ReceiptContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || undefined;
  const shouldAutoPrint = searchParams.get("print") === "true";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  const fetchFullDetails = async () => {
    setLoading(true);
    setUnauthorized(false);
    try {
      const response = await applicationsApi.get(id, token);
      if (response.data) {
        setData(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching details:", error.message);
      if (error.message?.includes("Зөвшөөрөлгүй")) {
        setUnauthorized(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFullDetails();
  }, [id, token]);

  useEffect(() => {
    if (data && typeof window !== "undefined" && shouldAutoPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [data, shouldAutoPrint]);

  const translateLevel = (level: string) => {
    const map: Record<string, string> = {
      bad: "Муу",
      medium: "Дунд",
      good: "Сайн",
      excellent: "Маш сайн",
      none: "Мэдэхгүй",
    };
    return map[level] || level || "—";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Ачааллаж байна...</p>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-4">
        <Lock className="w-12 h-12 text-amber-500" />
        <p className="text-lg font-bold text-slate-900">Анкетын мэдээллийг харах эрх баталгаажуулна уу</p>
        <p className="text-sm text-slate-500 max-w-md">
          Хувийн мэдээллийг хамгаалах үүднээс &quot;Анкетын явц шалгах&quot; хуудсаар утас болон регистрийн дугаараа баталгаажуулан хэвлэх холбоосоо авна уу.
        </p>
        <Link href="/anket/track">
          <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl">Анкетын явц шалгах руу очих</Button>
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <p className="text-lg font-bold text-slate-900">Анкет олдсонгүй.</p>
        <Link href="/anket">
          <Button variant="outline">Анкет руу буцах</Button>
        </Link>
      </div>
    );
  }

  const isDriverJob = !!(data?.truck_details || data?.pro_license_url || (data?.truck_photos?.length ?? 0) > 0);
  const skillsObj = Array.isArray(data.skills) ? data.skills[0] : data.skills;
  const languageMatrix = skillsObj?.language_matrix || [];
  const pcMatrix = skillsObj?.pc_matrix || {};
  const emergencyContacts = Array.isArray(data.emergency_contacts) ? data.emergency_contacts : [];

  return (
    <div className="min-h-screen bg-slate-50 pb-24 print:min-h-0 print:bg-white print:pb-0 font-sans">
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 h-16 flex items-center justify-between print:hidden mb-6 rounded-2xl shadow-sm">
        <Link href="/jobs">
          <Button variant="ghost" size="sm" className="font-bold gap-2 text-slate-600 hover:text-blue-600">
            <ArrowLeft className="w-4 h-4" /> Буцах
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
            Албан ёсны маягт
          </span>
          <Button
            onClick={() => window.print()}
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 px-6 rounded-xl shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4 mr-2" /> Хэвлэх / PDF
          </Button>
        </div>
      </div>

      <div className="max-w-[210mm] mx-auto mb-16 px-2 md:px-0 print:m-0 print:max-w-none print:px-0">
        <div className="bg-white p-6 sm:p-10 md:p-[12mm] border border-slate-300 shadow-sm print:p-0 print:border-none print:shadow-none min-h-[297mm] print:min-h-0">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 mb-8 pb-4 border-b-2 border-slate-900">
            <div className="col-span-3">
              <div className="border border-slate-400 p-2 text-[9px] space-y-1">
                <p><b>Байгууллага:</b> Tugeelt.mn</p>
                <p><b>Огноо:</b> {data.created_at ? format(new Date(data.created_at), "yyyy-MM-dd") : "—"}</p>
              </div>
            </div>
            <div className="col-span-6 text-center pt-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                АЖИЛД ОРОХЫГ ХҮСЭГЧИЙН АНКЕТ
              </h1>
              <p className="text-[9px] font-bold text-blue-600 mt-2 uppercase tracking-wider">
                Албан тушаал: {data.applying_for}
              </p>
              <p className="text-[8px] font-mono text-slate-400 uppercase">
                Код: {data.id?.slice(0, 8)}
              </p>
            </div>
            <div className="col-span-3 flex justify-end">
              <div className="w-[28mm] h-[36mm] border-2 border-slate-900 flex items-center justify-center overflow-hidden bg-slate-50">
                {data.photo_url ? (
                  <img src={data.photo_url} alt="Photo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[8px] p-2 text-center text-slate-400 font-bold uppercase">3x4 PHOTO</span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 print:space-y-4">
            {/* 1. Хувийн мэдээлэл */}
            <section>
              <h3 className="text-xs font-black uppercase mb-2 px-2 border-l-4 border-slate-900">
                Нэг. Хувийн мэдээлэл
              </h3>
              <table className="w-full border-collapse border border-slate-900 text-[10px]">
                <tbody>
                  <tr className="border-b border-slate-900">
                    <td className="p-2 border-r border-slate-900 bg-slate-50 font-bold w-[16%]">Ургийн овог:</td>
                    <td className="p-2 border-r border-slate-900 w-[18%]">{data.surname || "—"}</td>
                    <td className="p-2 border-r border-slate-900 bg-slate-50 font-bold w-[16%]">Эцэг/Эхийн нэр:</td>
                    <td className="p-2 border-r border-slate-900 w-[18%]">{data.last_name}</td>
                    <td className="p-2 border-r border-slate-900 bg-slate-50 font-bold w-[16%]">Өөрийн нэр:</td>
                    <td className="p-2 w-[16%] font-bold">{data.first_name}</td>
                  </tr>
                  <tr className="border-b border-slate-900">
                    <td className="p-2 border-r border-slate-900 bg-slate-50 font-bold">Регистрийн дугаар:</td>
                    <td className="p-2 border-r border-slate-900 font-mono font-bold">{data.register_number}</td>
                    <td className="p-2 border-r border-slate-900 bg-slate-50 font-bold">Төрсөн огноо:</td>
                    <td className="p-2 border-r border-slate-900">{data.birth_date || data.birth_year || "—"}</td>
                    <td className="p-2 border-r border-slate-900 bg-slate-50 font-bold">Хүйс / Нас:</td>
                    <td className="p-2">
                      {data.gender === "male" ? "Эр" : data.gender === "female" ? "Эм" : "—"} /{" "}
                      {data.birth_year ? new Date().getFullYear() - parseInt(data.birth_year, 10) : "—"}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-900">
                    <td className="p-2 border-r border-slate-900 bg-slate-50 font-bold">Утас (Гар):</td>
                    <td className="p-2 border-r border-slate-900 font-bold">{data.phone_mobile || data.phone}</td>
                    <td className="p-2 border-r border-slate-900 bg-slate-50 font-bold">Утас (Бусад):</td>
                    <td className="p-2 border-r border-slate-900">{data.phone_home || data.phone_work || "—"}</td>
                    <td className="p-2 border-r border-slate-900 bg-slate-50 font-bold">Имэйл хаяг:</td>
                    <td className="p-2">{data.email || "—"}</td>
                  </tr>
                  <tr className="border-b border-slate-900">
                    <td className="p-2 border-r border-slate-900 bg-slate-50 font-bold">Facebook:</td>
                    <td colSpan={2} className="p-2 border-r border-slate-900">{data.facebook_url || "—"}</td>
                    <td className="p-2 border-r border-slate-900 bg-slate-50 font-bold">Гэрлэлтийн байдал:</td>
                    <td colSpan={2} className="p-2">
                      {MARITAL_STATUS_LABELS[data.marital_status] || data.marital_status || "—"}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-900">
                    <td className="p-2 border-r border-slate-900 bg-slate-50 font-bold">Байнгын хаяг:</td>
                    <td colSpan={5} className="p-2">{data.address_current || "—"}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-900 bg-slate-50 font-bold">Түр хаяг:</td>
                    <td colSpan={5} className="p-2">{data.address_temp || data.temp_address || "—"}</td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* 2. Яаралтай үед холбоо барих */}
            {emergencyContacts.length > 0 && (
              <section>
                <h3 className="text-xs font-black uppercase mb-2 px-2 border-l-4 border-slate-900">
                  Хоёр. Яаралтай үед холбоо барих
                </h3>
                <table className="w-full border-collapse border border-slate-900 text-[10px]">
                  <tbody>
                    {emergencyContacts.map((c: any, i: number) => (
                      <tr key={i} className="border-b border-slate-300 last:border-b-0">
                        <td className="p-2 border-r border-slate-900 bg-slate-50 font-bold w-[20%]">Холбоо барих {i + 1}:</td>
                        <td className="p-2">{typeof c === "string" ? c : c.details || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {/* 3. Гэр бүл & Садан төрөл */}
            <section>
              <h3 className="text-xs font-black uppercase mb-2 px-2 border-l-4 border-slate-900">
                Гурав. Гэр бүлийн байдал (Хамт амьдардаг)
              </h3>
              <table className="w-full border-collapse border border-slate-900 text-[9px]">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-900 font-bold">
                    <th className="p-2 border-r border-slate-900 text-left">Таны хэн болох</th>
                    <th className="p-2 border-r border-slate-900 text-left">Овог нэр</th>
                    <th className="p-2 border-r border-slate-900 text-center">Төрсөн он</th>
                    <th className="p-2 border-r border-slate-900 text-left">Ажил, албан тушаал /Сургууль/</th>
                    <th className="p-2 text-left">Утас</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {data.family_members?.length > 0 ? (
                    data.family_members.map((m: any, i: number) => (
                      <tr key={i}>
                        <td className="p-2 border-r border-slate-900">{m.relation}</td>
                        <td className="p-2 border-r border-slate-900 font-bold">{m.last_name || ""} {m.first_name}</td>
                        <td className="p-2 border-r border-slate-900 text-center">{m.birth_year || "—"}</td>
                        <td className="p-2 border-r border-slate-900">{m.occupation} {m.workplace_school ? `@ ${m.workplace_school}` : ""}</td>
                        <td className="p-2">{m.phone || "—"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-3 text-center text-slate-400 italic">Мэдээлэл ороогүй</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {data.extended_relatives?.length > 0 && (
                <>
                  <h4 className="text-[10px] font-black uppercase mt-4 mb-2 text-slate-600">
                    3.2 Садан төрлийн байдал (Тусдаа амьдардаг)
                  </h4>
                  <table className="w-full border-collapse border border-slate-900 text-[9px]">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-900 font-bold">
                        <th className="p-2 border-r border-slate-900 text-left">Таны хэн болох</th>
                        <th className="p-2 border-r border-slate-900 text-left">Овог нэр</th>
                        <th className="p-2 border-r border-slate-900 text-left">Ажил төрөл</th>
                        <th className="p-2 text-left">Байгууллага / Утас</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300">
                      {data.extended_relatives.map((rel: any, i: number) => (
                        <tr key={i}>
                          <td className="p-2 border-r border-slate-900">{rel.relation || "—"}</td>
                          <td className="p-2 border-r border-slate-900 font-bold">{rel.full_name}</td>
                          <td className="p-2 border-r border-slate-900">{rel.occupation}</td>
                          <td className="p-2">{rel.workplace} / {rel.contact_info}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </section>

            {/* 4. Боловсрол & Туршлага */}
            <div className="grid grid-cols-2 gap-4 print:block print:space-y-4">
              <section>
                <h3 className="text-xs font-black uppercase mb-2 px-2 border-l-4 border-slate-900">
                  Дөрөв. Боловсролын байдал
                </h3>
                <table className="w-full border-collapse border border-slate-900 text-[9px]">
                  <thead className="bg-slate-50 font-bold">
                    <tr className="border-b border-slate-900">
                      <th className="p-2 border-r border-slate-900 text-left">Сургууль</th>
                      <th className="p-2 text-left">Огноо / Мэргэжил / Зэрэг</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {data.education_history?.length > 0 ? (
                      data.education_history.map((e: any, i: number) => (
                        <tr key={i}>
                          <td className="p-2 border-r border-slate-900 font-bold">
                            {e.school_name}
                            {e.school_type ? <span className="block text-[8px] font-normal text-slate-500">{e.school_type}</span> : null}
                          </td>
                          <td className="p-2">
                            {e.entry_year}-{e.graduation_year} / {e.major} / {DEGREE_LABELS[e.degree] || e.degree}
                            {e.gpa ? ` (GPA: ${e.gpa})` : ""}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={2} className="p-2 text-center text-slate-400">Мэдээлэл ороогүй</td></tr>
                    )}
                  </tbody>
                </table>
              </section>

              <section>
                <h3 className="text-xs font-black uppercase mb-2 px-2 border-l-4 border-slate-900">
                  Тав. Ажилласан туршлага
                </h3>
                <table className="w-full border-collapse border border-slate-900 text-[9px]">
                  <thead className="bg-slate-50 font-bold">
                    <tr className="border-b border-slate-900">
                      <th className="p-2 border-r border-slate-900 text-left">Байгууллага</th>
                      <th className="p-2 text-left">Хугацаа / Албан тушаал</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {data.work_experience?.length > 0 ? (
                      data.work_experience.map((w: any, i: number) => (
                        <tr key={i}>
                          <td className="p-2 border-r border-slate-900 font-bold">{w.company_name}</td>
                          <td className="p-2">
                            <p>{w.start_date}-{w.end_date || "ОДОО"} / {w.position}</p>
                            {w.reason_for_leaving && (
                              <p className="text-[8px] italic text-slate-500">Шалтгаан: {w.reason_for_leaving}</p>
                            )}
                            {w.reference_person && (
                              <p className="text-[8px] text-slate-500">Тодорхойлогч: {w.reference_person}</p>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={2} className="p-2 text-center text-slate-400">Мэдээлэл ороогүй</td></tr>
                    )}
                  </tbody>
                </table>
              </section>
            </div>

            {/* 5. Ур чадвар */}
            <section>
              <h3 className="text-xs font-black uppercase mb-2 px-2 border-l-4 border-slate-900">
                Зургаа. Ур чадварын байдал
              </h3>
              <div className="border border-slate-900 text-[9px]">
                <div className="grid grid-cols-2">
                  <div className="border-r border-slate-900">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-900 font-bold">
                          <th className="p-2 border-r border-slate-900 text-left">Гадаад хэл</th>
                          <th className="p-2 border-r border-slate-900">Сонсох</th>
                          <th className="p-2 border-r border-slate-900">Ярих</th>
                          <th className="p-2 border-r border-slate-900">Унших</th>
                          <th className="p-2">Бичих</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {languageMatrix.length > 0 ? (
                          languageMatrix.map((l: any, i: number) => (
                            <tr key={i}>
                              <td className="p-2 border-r border-slate-900 font-bold">{l.language}</td>
                              <td className="p-2 border-r border-slate-900 text-center">{translateLevel(l.listening)}</td>
                              <td className="p-2 border-r border-slate-900 text-center">{translateLevel(l.speaking)}</td>
                              <td className="p-2 border-r border-slate-900 text-center">{translateLevel(l.reading)}</td>
                              <td className="p-2 text-center">{translateLevel(l.writing)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={5} className="p-2 text-center text-slate-400">Мэдээлэл ороогүй</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 space-y-1.5 bg-slate-50/30">
                    <p className="font-bold border-b border-slate-200 pb-1 mb-1 uppercase text-[8px]">Компьютерийн мэдлэг:</p>
                    <p><b>Windows:</b> {translateLevel(pcMatrix.windows)}</p>
                    <p><b>MS Office:</b> {translateLevel(pcMatrix.msOffice)}</p>
                    <p><b>Adobe Suite:</b> {translateLevel(pcMatrix.adobe)}</p>
                    <p><b>Бусад:</b> {translateLevel(pcMatrix.others)} {pcMatrix.otherDetails ? `(${pcMatrix.otherDetails})` : ""}</p>
                  </div>
                </div>
                <div className="border-t border-slate-900 p-3 grid grid-cols-3 gap-4 bg-slate-50/50">
                  <div>
                    <p className="font-bold text-[8px] uppercase text-slate-500 mb-0.5">Давуу тал:</p>
                    <p className="italic">{data.strengths || "—"}</p>
                  </div>
                  <div>
                    <p className="font-bold text-[8px] uppercase text-slate-500 mb-0.5">Сул тал:</p>
                    <p className="italic">{data.weaknesses || "—"}</p>
                  </div>
                  <div>
                    <p className="font-bold text-[8px] uppercase text-slate-500 mb-0.5">Хобби:</p>
                    <p className="italic">{data.hobbies || "—"}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Тодорхойлох хүмүүс */}
            {data.reference_persons?.length > 0 && (
              <section>
                <h3 className="text-xs font-black uppercase mb-2 px-2 border-l-4 border-slate-900">
                  Долоо. Тодорхойлох 3 хүний мэдээлэл
                </h3>
                <table className="w-full border-collapse border border-slate-900 text-[9px]">
                  <thead className="bg-slate-50 font-bold">
                    <tr className="border-b border-slate-900">
                      <th className="p-2 border-r border-slate-900 text-left">Овог нэр</th>
                      <th className="p-2 border-r border-slate-900 text-left">Албан тушаал / Байгууллага</th>
                      <th className="p-2 text-left">Холбоо барих утас</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {data.reference_persons.map((ref: any, i: number) => (
                      <tr key={i}>
                        <td className="p-2 border-r border-slate-900 font-bold">{ref.full_name}</td>
                        <td className="p-2 border-r border-slate-900">{ref.occupation} @ {ref.workplace}</td>
                        <td className="p-2">{ref.contact_info}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {/* 7. Жолоочийн мэдээлэл */}
            {isDriverJob && (
              <section className="border border-slate-900 p-3 bg-blue-50/10">
                <h3 className="text-xs font-black uppercase mb-3 underline decoration-blue-600 underline-offset-4">
                  Найм. Жолоочийн тээврийн хэрэгслийн мэдээлэл
                </h3>
                <div className="grid grid-cols-2 gap-4 text-[9px]">
                  <div className="space-y-2">
                    <p className="font-bold text-blue-600 uppercase text-[8px]">Дэлгэрэнгүй:</p>
                    <p className="whitespace-pre-wrap">{data.truck_details || "—"}</p>
                    {data.pro_license_url && (
                      <div className="pt-2">
                        <p className="font-bold text-blue-600 mb-1">Мэргэшсэн үнэмлэх:</p>
                        <img src={data.pro_license_url} alt="License" className="max-w-[140px] border shadow-sm" />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {data.truck_photos?.map((url: string, i: number) => (
                      <div key={i} className="aspect-square border border-slate-300 bg-white p-1">
                        <img src={url} alt="Truck" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 8. Бусад */}
            <section className="break-inside-avoid">
              <h3 className="text-xs font-black uppercase mb-2 px-2 border-l-4 border-slate-900">
                Ес. Бусад нэмэлт мэдээлэл
              </h3>
              <table className="w-full border-collapse border border-slate-900 text-[10px]">
                <tbody>
                  <tr className="border-b border-slate-900">
                    <td className="p-2 border-r border-slate-900 bg-slate-50 font-bold w-[25%]">Эрүүл мэндийн байдал:</td>
                    <td className="p-2">
                      <p><b>Архаг өвчин:</b> {data.health_info?.illnesses || "Үгүй"}</p>
                      <p><b>Хорт зуршил:</b> {data.health_info?.badHabits || "Үгүй"}</p>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-900">
                    <td className="p-2 border-r border-slate-900 bg-slate-50 font-bold">Цэргийн алба / Ангилал:</td>
                    <td className="p-2">
                      <b>Цэрэг:</b> {data.military_status || "—"} &nbsp;|&nbsp;{" "}
                      <b>Жолоо:</b> {data.driver_license?.length ? data.driver_license.join(", ") : "—"}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-900">
                    <td className="p-2 border-r border-slate-900 bg-slate-50 font-bold">Ирээдүйн зорилго:</td>
                    <td className="p-2 italic">{data.future_goals || "—"}</td>
                  </tr>
                  {data.additional_details && (
                    <tr className="border-b border-slate-900">
                      <td className="p-2 border-r border-slate-900 bg-slate-50 font-bold">Нэмэлт мэдээлэл:</td>
                      <td className="p-2">{data.additional_details}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="p-2 border-r border-slate-900 bg-slate-50 font-bold">Хүсэж буй цалин:</td>
                    <td className="p-2 font-bold text-blue-600">
                      {data.desired_salary || "Тохиролцоно"} / Ажилд орох боломжтой:{" "}
                      {data.available_date ? format(new Date(data.available_date), "yyyy-MM-dd") : "Шууд"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* Signature Block */}
            <div className="pt-16 print:pt-8 flex justify-between items-end break-inside-avoid">
              <div className="max-w-xs space-y-2">
                <p className="text-[7px] font-bold text-slate-400 italic uppercase leading-relaxed">
                  ТАНЫ БӨГЛӨСӨН МЭДЭЭЛЛИЙН ҮНЭН ЗӨВИЙГ ТА ӨӨРӨӨ БҮРЭН ХАРИУЦНА. ЭНЭХҮҮ АНКЕТ НЬ TUGEELT.MN СИСТЕМД ХАДГАЛАГДСАН БОЛНО.
                </p>
              </div>
              <div className="text-right space-y-8">
                <p className="text-[10px] font-bold">...................................... / ...................................... /</p>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">(ГАРЫН ҮСЭГ / ТАЙЛАЛ)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background-color: white !important; margin: 0 !important; padding: 0 !important; }
          .min-h-screen { min-height: auto !important; }
          .max-w-\\[210mm\\] { max-width: none !important; width: 100% !important; margin: 0 !important; }
          @page { size: A4; margin: 8mm; }
        }
      `}</style>
    </div>
  );
}

export default function ReceiptView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Ачааллаж байна...</p>
        </div>
      }
    >
      <ReceiptContent id={resolvedParams.id} />
    </Suspense>
  );
}
