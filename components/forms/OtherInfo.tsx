"use client";

import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { ApplicationFormValues } from "@/lib/validations/application";
import { Plus, Trash2, Upload, X, ShieldAlert, Users, Activity, Target, Search, FileText, Calendar, CheckSquare, FileUp, CreditCard, GraduationCap, Video, Sparkles } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface OtherInfoProps {
  form: UseFormReturn<ApplicationFormValues>;
}

export function OtherInfo({ form }: OtherInfoProps) {
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const { fields: relativeFields, append: appendRelative, remove: removeRelative } = useFieldArray({
    control: form.control,
    name: "extendedRelatives",
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: "photoUrl" | "diplomaUrl" | "idCardUrl" | "videoUrl") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    try {
      const maxSize = fieldName === "videoUrl" ? 25 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`Файл хэтэрхий том байна. Зөвшөөрөгдөх дээд хэмжээ: ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/anket/api/upload-local", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();
      form.setValue(fieldName, result.url);
    } catch (error: any) {
      console.error(error);
      alert("Файл хуулахад алдаа гарлаа: " + error.message);
    } finally {
      setUploadingField(null);
    }
  };

  const UploadBlock = ({ fieldName, label, icon: Icon, description, accept }: { fieldName: "photoUrl" | "diplomaUrl" | "idCardUrl" | "videoUrl", label: string, icon: any, description: string, accept: string }) => {
    const value = form.watch(fieldName);
    const isUploading = uploadingField === fieldName;

    return (
      <div className="flex flex-col items-center gap-4 p-6 bg-surface-container-low/50 rounded-xl border border-outline-variant/10 flex-1 hover:border-primary/30 transition-all duration-300">
        <label className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">{label}</label>
        
        <div className="w-full aspect-square max-w-[120px] bg-white rounded-lg flex items-center justify-center overflow-hidden relative border-2 border-dashed border-outline-variant/30 group/frame">
          {value ? (
            <>
              {fieldName === "photoUrl" ? (
                <img src={value} alt={label} className="w-full h-full object-cover" />
              ) : fieldName === "videoUrl" ? (
                <div className="flex flex-col items-center gap-2">
                  <Video className="w-8 h-8 text-primary animate-pulse" />
                  <span className="text-[8px] font-bold text-primary uppercase">Уншигдсан</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <FileText className="w-8 h-8 text-primary" />
                  <span className="text-[8px] font-bold text-primary uppercase">Уншигдсан</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => form.setValue(fieldName, "")}
                className="absolute top-1 right-1 bg-error/90 text-white p-1 rounded-md opacity-0 group-hover/frame:opacity-100 transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <div className="text-center space-y-2 opacity-20">
              <Icon className="w-8 h-8 mx-auto" />
              <p className="text-[7px] font-bold uppercase tracking-widest px-2">{description}</p>
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        
        <input 
          type="file" 
          accept={accept} 
          {...(accept.includes("image/*") ? { capture: "environment" } : {})}
          className="hidden" 
          id={`upload-${fieldName}`} 
          onChange={(e) => handleFileUpload(e, fieldName)} 
          disabled={isUploading} 
        />
        <Button 
          type="button" 
          variant="ghost"
          onClick={() => document.getElementById(`upload-${fieldName}`)?.click()} 
          disabled={isUploading} 
          className={cn(
            "h-9 w-full rounded-full font-bold uppercase tracking-widest text-[8px] transition-all",
            value ? "bg-primary/5 text-primary" : "bg-surface-container-low text-on-surface-variant/40 hover:bg-primary/5 hover:text-primary"
          )}
        >
          {value ? "Солих" : "Сонгох"}
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* 1. File Uploads Section */}
      <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h3 className="text-xl font-bold text-on-surface font-headline uppercase tracking-tight">Бичиг баримт хавсаргах</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          <UploadBlock fieldName="photoUrl" label="Цээж зураг" icon={Upload} description="3X4 хэмжээтэй зураг" accept="image/*" />
          <UploadBlock fieldName="idCardUrl" label="Иргэний үнэмлэх" icon={CreditCard} description="Хуулбар" accept="image/*,application/pdf" />
          <UploadBlock fieldName="diplomaUrl" label="Диплом" icon={GraduationCap} description="Хуулбар" accept="image/*,application/pdf" />
          <UploadBlock fieldName="videoUrl" label="Видео" icon={Video} description="30 сек бичлэг" accept="video/*" />
        </div>
      </section>

      {/* 2. Health Status Layer */}
      <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h3 className="text-xl font-bold text-on-surface font-headline uppercase tracking-tight">Эрүүл мэнд</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="healthInfo.illnesses"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-on-surface ml-1">Сүүлийн 5 жилд өвдөж байсан өвчин</FormLabel>
                <FormControl>
                  <textarea placeholder="Байхгүй бол хоосон орхиж болно" className="w-full min-h-[120px] rounded-xl border-none bg-surface-container-low p-6 focus:ring-2 focus:ring-primary/20 font-medium text-base outline-variant outline outline-1 focus:outline-primary resize-none placeholder:text-on-surface-variant/30" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="healthInfo.badHabits"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-on-surface ml-1">Муу зуршил / Архи, тамхи /</FormLabel>
                <FormControl>
                  <textarea placeholder="Тайлбарлана уу" className="w-full min-h-[120px] rounded-xl border-none bg-surface-container-low p-6 focus:ring-2 focus:ring-primary/20 font-medium text-base outline-variant outline outline-1 focus:outline-primary resize-none placeholder:text-on-surface-variant/30" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </section>

      {/* 3. Detailed Relatives Section */}
      <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            <h3 className="text-xl font-bold text-on-surface font-headline uppercase tracking-tight">Хамаатан садан</h3>
          </div>
          <Button
            type="button"
            onClick={() => appendRelative({ fullName: "", occupation: "", workplace: "", contactInfo: "" })}
            className="h-11 px-6 rounded-full bg-primary text-on-primary font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 flex items-center gap-2 group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            Нэмэх
          </Button>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {relativeFields.map((field, index) => (
              <motion.div 
                key={field.id} 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white/50 p-6 rounded-xl border border-outline-variant/20 relative"
              >
                <FormField
                  control={form.control}
                  name={`extendedRelatives.${index}.fullName`}
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[10px] font-bold text-on-surface-variant/60 uppercase ml-1">Овог нэр</FormLabel>
                      <FormControl><Input placeholder="Бүтэн нэр" className="h-10 bg-surface-container-low border-none rounded-lg px-4 font-medium text-base" {...field} /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`extendedRelatives.${index}.occupation`}
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[10px] font-bold text-on-surface-variant/60 uppercase ml-1">Албан тушаал</FormLabel>
                      <FormControl><Input placeholder="Албан тушаал" className="h-10 bg-surface-container-low border-none rounded-lg px-4 font-medium text-base" {...field} /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`extendedRelatives.${index}.workplace`}
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[10px] font-bold text-on-surface-variant/60 uppercase ml-1">Ажлын газар</FormLabel>
                      <FormControl><Input placeholder="Ажлын газар" className="h-10 bg-surface-container-low border-none rounded-lg px-4 font-medium text-base" {...field} /></FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex items-end gap-3">
                  <FormField
                    control={form.control}
                    name={`extendedRelatives.${index}.contactInfo`}
                    render={({ field }) => (
                      <FormItem className="flex-1 space-y-1">
                        <FormLabel className="text-[10px] font-bold text-on-surface-variant/60 uppercase ml-1">Утас</FormLabel>
                        <FormControl><Input placeholder="Холбоо барих" inputMode="tel" className="h-10 bg-surface-container-low border-none rounded-lg px-4 font-medium text-base" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeRelative(index)} className="h-10 w-10 text-on-surface-variant/20 hover:text-error hover:bg-error/5 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {relativeFields.length === 0 && (
             <p className="text-center py-6 text-[10px] font-bold text-on-surface-variant/20 uppercase tracking-widest">Нэмэлт гишүүн байхгүй</p>
          )}
        </div>
      </section>

      {/* 4. Professional References Section */}
      <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8 relative">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h3 className="text-xl font-bold text-on-surface font-headline uppercase tracking-tight">Тодорхойлох 3 хүн</h3>
        </div>

        <div className="space-y-4">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white/50 p-6 rounded-xl border border-outline-variant/10">
              <FormField
                control={form.control}
                name={`referencePersons.${idx}.fullName`}
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[10px] font-bold text-on-surface-variant/60 uppercase ml-1">Овог нэр</FormLabel>
                    <FormControl><Input placeholder="Овог нэр" className="h-10 bg-surface-container-low border-none rounded-lg px-4 font-bold text-primary text-base" {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`referencePersons.${idx}.occupation`}
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[10px] font-bold text-on-surface-variant/60 uppercase ml-1">Албан тушаал</FormLabel>
                    <FormControl><Input placeholder="Албан тушаал" className="h-10 bg-surface-container-low border-none rounded-lg px-4 font-medium text-base" {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`referencePersons.${idx}.workplace`}
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[10px] font-bold text-on-surface-variant/60 uppercase ml-1">Ажлын газар</FormLabel>
                    <FormControl><Input placeholder="Ажлын газар" className="h-10 bg-surface-container-low border-none rounded-lg px-4 font-medium text-base" {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`referencePersons.${idx}.contactInfo`}
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[10px] font-bold text-on-surface-variant/60 uppercase ml-1">Утас</FormLabel>
                    <FormControl><Input placeholder="Утасны дугаар" inputMode="tel" className="h-10 bg-surface-container-low border-none rounded-lg px-4 font-bold text-primary text-base" {...field} /></FormControl>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 5. Future Goals Section */}
      <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h3 className="text-xl font-bold text-on-surface font-headline uppercase tracking-tight">Ирээдүйн зорилго</h3>
        </div>
        
        <FormField
          control={form.control}
          name="futureGoals"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <textarea placeholder="Та манай байгууллагад орсноор өөрийгөө хэрхэн хөгжүүлж, ямар амжилтад хүрэх зорилготой вэ?" className="w-full min-h-[160px] rounded-xl border-none bg-surface-container-low p-6 md:p-8 text-base md:text-lg font-medium leading-relaxed outline-variant outline outline-1 focus:outline-primary resize-none placeholder:text-on-surface-variant/30" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </section>

      {/* 6. Referral Source Section */}
      <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8 relative">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h3 className="text-xl font-bold text-on-surface font-headline uppercase tracking-tight">Мэдээллийн эх сурвалж</h3>
        </div>

        <div className="space-y-8">
          <FormField
            control={form.control}
            name="referralSource"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { label: "Сургууль дээрээс", value: "school" },
                      { label: "Зараас", value: "newspaper" },
                      { label: "Найз, төрөл садангаас", value: "friends" },
                      { label: "Facebook, Website", value: "social" },
                      { label: "Өөрөө ирж уулзаж", value: "direct" },
                      { label: "Бусад", value: "others" },
                    ].map((opt) => (
                      <div key={opt.value} className="flex items-center justify-between bg-surface-container-low/50 p-5 rounded-xl border border-outline-variant/10 group cursor-pointer hover:border-primary/40 transition-colors">
                        <label htmlFor={`src-${opt.value}`} className="text-xs font-bold uppercase tracking-widest cursor-pointer text-on-surface-variant group-hover:text-primary transition-colors">{opt.label}</label>
                        <RadioGroupItem value={opt.value} id={`src-${opt.value}`} className="w-5 h-5 border-2 border-outline-variant text-primary" />
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("referralSource") === "others" && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <FormField
                control={form.control}
                name="referralSourceDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Манайхыг өөр хаанаас олж мэдсэн бэ?" {...field} className="h-12 rounded-xl bg-surface-container-low border-none px-6 font-medium outline-variant outline outline-1 focus:outline-primary text-base" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* 8. Criminal Record Section (Warning Style) */}
      <section className="bg-error/5 rounded-2xl p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8 border border-error/20 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-error rounded-full" />
          <h3 className="text-xl font-bold text-error font-headline uppercase tracking-tight">Ял шийтгэл</h3>
        </div>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="criminalRecord"
            render={({ field }) => (
              <FormItem className="space-y-6">
                <FormLabel className="text-sm font-medium text-on-surface-variant leading-relaxed block ml-1 italic">
                  Та урьд өмнө ял шийтгэл эдэлж байсан уу? Эсвэл ямар нэг гэмт хэрэгт татагдан шалгагдаж байсан уу?
                </FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={(val) => field.onChange(val === "yes")} value={field.value ? "yes" : "no"} className="flex gap-10 pl-1">
                    <div className="flex items-center space-x-3 group cursor-pointer">
                      <RadioGroupItem value="no" id="cr-no" className="w-5 h-5 border-2 border-outline-variant text-primary" />
                      <label htmlFor="cr-no" className="text-sm font-bold uppercase tracking-widest cursor-pointer group-hover:text-primary transition-colors">Үгүй</label>
                    </div>
                    <div className="flex items-center space-x-3 group cursor-pointer">
                      <RadioGroupItem value="yes" id="cr-yes" className="w-5 h-5 border-2 border-outline-variant text-primary" />
                      <label htmlFor="cr-yes" className="text-sm font-bold uppercase tracking-widest cursor-pointer group-hover:text-primary transition-colors">Тийм</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("criminalRecord") && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <FormField
                control={form.control}
                name="criminalRecordDetails"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-bold text-on-surface-variant/60 uppercase ml-1">Дэлгэрэнгүй тайлбар:</FormLabel>
                    <FormControl>
                      <textarea placeholder="Ял шийтгэл эдэлсэн эсвэл шалгагдсан шалтгаан..." className="w-full min-h-[120px] rounded-xl border-none bg-white p-6 font-medium text-base outline-error/30 outline outline-1 focus:outline-error resize-none" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* 9. Final Row: Salary & Availability */}
      <section className="bg-primary/5 rounded-2xl p-4 sm:p-6 md:p-10 space-y-6 md:space-y-10 border border-primary/20 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 relative z-10">
          <FormField
            control={form.control}
            name="desiredSalary"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-4 bg-primary rounded-full" />
                  <FormLabel className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Цалингийн хүлээлт:</FormLabel>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="Жишээ: 2,500,000" inputMode="numeric" className="bg-white border-none h-16 rounded-xl px-6 text-xl md:text-2xl font-black text-primary placeholder:text-primary/10 tracking-tight shadow-sm" {...field} />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-primary/40 text-lg md:text-xl">₮</span>
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availableDate"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-4 bg-primary rounded-full" />
                  <FormLabel className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Ажилд орох боломжтой:</FormLabel>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full bg-white border-none h-16 rounded-xl px-6 flex items-center justify-between text-left font-bold text-lg hover:bg-white active:scale-[0.99] transition-all shadow-sm",
                          !field.value && "text-on-surface-variant/20"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "yyyy оны MM-р сарын dd")
                        ) : (
                          <span>Огноо сонгох...</span>
                        )}
                        <Calendar className="h-5 w-5 opacity-30" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-xl" align="end">
                    <CalendarComponent
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString())}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      className="p-4"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>
      </section>

      {/* 10. Declaration & Signature (Editorial Style) */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 md:p-14 space-y-8 md:space-y-10 border border-outline-variant/20 relative overflow-hidden shadow-2xl">
        <div className="space-y-6 md:space-y-10 relative z-10">
          <div className="flex items-center gap-4">
             <div className="w-1.5 h-8 bg-primary rounded-full" />
             <h3 className="text-2xl font-bold uppercase tracking-tight text-on-surface font-headline">Баталгаажуулалт</h3>
          </div>

          <div className="space-y-8 text-sm font-medium text-on-surface-variant/60 leading-relaxed italic max-w-2xl border-l-[3px] border-primary/20 pl-8">
            <p className="flex gap-4"><span className="text-primary font-bold not-italic">01.</span> Ажилд орохыг хүссэн миний талаарх мэдээллийг холбогдох хувь хүн, албан байгууллагаас тодруулах эрхийг хүлээн зөвшөөрч байна. Мөн худал мэдээлэл өгч эсвэл нуун дарагдуулж ажилд орсноор ажлаас халагдана гэдгийг хүлээн зөвшөөрч байгаа бөгөөд гомдол гаргахгүй байх болно.</p>
            <p className="flex gap-4"><span className="text-primary font-bold not-italic">02.</span> Ажлын 5 хоногийн дотор хариу мэдэгдэхгүй бол анкетын шаардлага хангаагүй гэж ойлгож байна.</p>
          </div>

          <div className="bg-surface-container-low/50 p-8 rounded-xl space-y-6">
            <div className="flex items-center gap-3">
               <ShieldAlert className="w-5 h-5 text-primary" />
               <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Чухал санамж</h4>
            </div>
            <ul className="space-y-3 text-xs font-medium text-on-surface-variant/70">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary/40" />Их дээд сургуулийн диплом, иргэний үнэмлэхний хуулбар хавсаргана.</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary/40" />Дээрх хуулбар болон энэхүү өргөдлийн маягтыг буцаан олгохгүй.</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary/40" />Шаардлагатай тохиолдолд миний болон анкетад бичигдсэн холбогдох этгээдүүдийн Монгол банкны мэдээллийн санг авахыг зөвшөөрч байна.</li>
            </ul>
          </div>
        </div>

        <FormField
          control={form.control}
          name="termsAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-4 md:space-x-6 space-y-0 p-4 sm:p-6 md:p-8 bg-primary/5 rounded-2xl border border-primary/10 group cursor-pointer relative z-10 transition-all hover:bg-primary/10">
              <FormControl>
                <Checkbox
                  id="final-terms"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="w-7 h-7 rounded-lg border-2 border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </FormControl>
              <div className="space-y-1 cursor-pointer">
                <label htmlFor="final-terms" className="text-base md:text-lg font-bold text-on-surface cursor-pointer tracking-tight">
                  Бүх мэдээллийг үнэн зөв бөглөсөн болохыг зөвшөөрч байна.
                </label>
                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest leading-none mt-1">
                   Хууль эрх зүйн зөвшөөрөл шаардлагатай
                </p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </section>
    </div>
  );
}
