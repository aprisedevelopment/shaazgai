"use client";

import { useState } from "react";
import { jobsApi } from "@/lib/anket-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, X, Image as ImageIcon, Briefcase, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    employment_type: "Бүтэн цаг",
    location: "Улаанбаатар",
    salary_range: "",
    description: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
    image_url: "",
    is_driver_job: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const toastId = toast.loading("Зураг хуулж байна...");

    try {
      const data = new FormData();
      data.append("file", file);

      const response = await fetch("/api/upload-local", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      setFormData((prev) => ({ ...prev, image_url: result.url }));
      toast.success("Зураг амжилттай орлоо", { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error("Зураг хуулахад алдаа гарлаа: " + error.message, { id: toastId });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Ажлын байрны нэр заавал шаардлагатай");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Хадгалж байна...");

    try {
      await jobsApi.create({
        title: formData.title.trim(),
        department: formData.department.trim(),
        employment_type: formData.employment_type,
        location: formData.location.trim(),
        salary_range: formData.salary_range.trim(),
        description: formData.description.trim(),
        responsibilities: formData.responsibilities.trim(),
        requirements: formData.requirements.trim(),
        benefits: formData.benefits.trim(),
        image_url: formData.image_url,
        is_driver_job: formData.is_driver_job,
        is_active: true,
      });

      toast.success("Шинэ ажлын байр амжилттай нэмэгдлээ!", { id: toastId });
      router.push("/admin/jobs");
    } catch (err: any) {
      console.error(err);
      toast.error("Алдаа гарлаа: " + err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Header with Global Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/jobs">
            <Button variant="outline" className="h-10 w-10 p-0 rounded-xl border-slate-200 hover:bg-slate-50 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="h-6 w-[1px] bg-slate-200" />
          <div>
            <h1 className="text-lg font-bold text-slate-900 uppercase tracking-tight leading-none">
              Шинэ ажлын байр нэмэх
            </h1>
            <p className="text-slate-400 font-semibold text-[10px] mt-1 uppercase tracking-wider">
              Create Job Position
            </p>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading || uploadingImage}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-6 rounded-xl shadow-sm transition-all text-xs uppercase tracking-wider cursor-pointer"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Хадгалж байна..." : "Хадгалах"}
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-10 shadow-sm">
        {/* Cover Image */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900">Ковер зураг</h3>
          </div>

          <div className="w-full h-64 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center relative overflow-hidden group">
            {formData.image_url ? (
              <>
                <img src={formData.image_url} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setFormData({ ...formData, image_url: "" })}
                    className="font-bold rounded-xl px-4 h-9 shadow-lg text-xs"
                  >
                    <X className="w-3.5 h-3.5 mr-1.5" /> Зургийг устгах
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-3 p-6">
                <div className="w-12 h-12 bg-white text-slate-300 rounded-xl flex items-center justify-center mx-auto border border-slate-200 shadow-sm">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Зураг оруулах</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Санал болгох хэмжээ: 1200x600 px</p>
                </div>
                <label className="inline-flex items-center justify-center cursor-pointer font-bold border border-slate-200 bg-white hover:bg-slate-50 rounded-xl px-4 h-9 text-xs transition-all shadow-sm">
                  {uploadingImage ? "Хуулж байна..." : "Файл сонгох"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </section>

        {/* Basic Info */}
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <Briefcase className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900">Үндсэн мэдээлэл</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 col-span-2">
              <Label className="font-bold uppercase text-[10px] tracking-wider text-slate-400">
                Ажлын байрны нэр *
              </Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Жишээ: Маркетингийн менежер, Хүргэлтийн жолооч..."
                className="h-11 rounded-xl bg-white border-slate-200 font-semibold text-sm px-4 shadow-sm focus:ring-2 focus:ring-blue-100 outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold uppercase text-[10px] tracking-wider text-slate-400">
                Хэлтэс / Алба
              </Label>
              <Input
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Жишээ: Тээвэр ложистик, Борлуулалт..."
                className="h-11 rounded-xl bg-white border-slate-200 font-semibold px-4 shadow-sm focus:ring-2 focus:ring-blue-100 outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold uppercase text-[10px] tracking-wider text-slate-400">
                Цагийн нөхцөл
              </Label>
              <Select
                onValueChange={(v) => handleSelectChange("employment_type", v || "")}
                value={formData.employment_type}
              >
                <SelectTrigger className="h-11 rounded-xl bg-white border-slate-200 font-semibold px-4 shadow-sm outline-none text-xs">
                  <SelectValue placeholder="Сонгох" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                  <SelectItem value="Бүтэн цаг" className="text-xs">Бүтэн цаг</SelectItem>
                  <SelectItem value="Хагас цаг" className="text-xs">Хагас цаг</SelectItem>
                  <SelectItem value="Гэрээт" className="text-xs">Гэрээт</SelectItem>
                  <SelectItem value="Дадлагажигч" className="text-xs">Дадлагажигч</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold uppercase text-[10px] tracking-wider text-slate-400">
                Цалингийн хэмжээ
              </Label>
              <Input
                name="salary_range"
                value={formData.salary_range}
                onChange={handleChange}
                placeholder="Жишээ: 1.8M - 2.5M ₮"
                className="h-11 rounded-xl bg-white border-slate-200 font-semibold px-4 shadow-sm focus:ring-2 focus:ring-blue-100 outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold uppercase text-[10px] tracking-wider text-slate-400">
                Байршил
              </Label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Жишээ: Улаанбаатар"
                className="h-11 rounded-xl bg-white border-slate-200 font-semibold px-4 shadow-sm focus:ring-2 focus:ring-blue-100 outline-none text-xs"
              />
            </div>

            <div className="flex items-center gap-3 pt-2 col-span-2">
              <input
                type="checkbox"
                id="is_driver_job"
                checked={formData.is_driver_job}
                onChange={(e) => setFormData({ ...formData, is_driver_job: e.target.checked })}
                className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <Label htmlFor="is_driver_job" className="font-bold text-xs text-slate-800 uppercase tracking-tight cursor-pointer">
                Жолоочийн ажлын байр мөн эсэх (Машин, мэргэшсэн үнэмлэхийн талбар идэвхжинэ)
              </Label>
            </div>
          </div>
        </section>

        {/* Detailed Descriptions */}
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900">Дэлгэрэнгүй мэдээлэл</h3>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label className="font-bold uppercase text-[10px] tracking-wider text-slate-400">
                Ажлын ерөнхий тайлбар
              </Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Тухайн ажлын байрны үндсэн зорилго, танилцуулгыг бичнэ үү."
                className="min-h-[100px] rounded-xl bg-white border-slate-200 font-medium p-4 shadow-sm focus:ring-2 focus:ring-blue-100 outline-none text-xs leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="font-bold uppercase text-[10px] tracking-wider text-slate-400">
                  Гүйцэтгэх үндсэн үүрэг
                </Label>
                <span className="text-[10px] text-slate-400">Мөр бүрээр цувуулж бичнэ</span>
              </div>
              <Textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                placeholder="- Борлуулалтын төлөвлөгөө гаргах&#10;- Түгээлтийн үйл ажиллагааг зохион байгуулах"
                className="min-h-[120px] rounded-xl bg-white border-slate-200 font-medium p-4 shadow-sm focus:ring-2 focus:ring-blue-100 outline-none text-xs leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="font-bold uppercase text-[10px] tracking-wider text-slate-400">
                  Тавигдах шаардлага
                </Label>
                <span className="text-[10px] text-slate-400">Мөр бүрээр цувуулж бичнэ</span>
              </div>
              <Textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="- 2-оос доошгүй жил ажилласан туршлагатай&#10;- Харилцааны өндөр соёлтой"
                className="min-h-[120px] rounded-xl bg-white border-slate-200 font-medium p-4 shadow-sm focus:ring-2 focus:ring-blue-100 outline-none text-xs leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="font-bold uppercase text-[10px] tracking-wider text-slate-400">
                  Нэмэлт урамшуулал / Хангамж
                </Label>
                <span className="text-[10px] text-slate-400">Мөр бүрээр цувуулж бичнэ</span>
              </div>
              <Textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                placeholder="- Улирлын гүйцэтгэлийн урамшуулал&#10;- Өдрийн хоолны хангамж"
                className="min-h-[100px] rounded-xl bg-white border-slate-200 font-medium p-4 shadow-sm focus:ring-2 focus:ring-blue-100 outline-none text-xs leading-relaxed"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
