"use client";

import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ApplicationFormValues } from "@/lib/validations/application";
import { Truck, CreditCard, Camera, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface DriverInfoProps {
  form: UseFormReturn<ApplicationFormValues>;
}

export function DriverInfo({ form }: DriverInfoProps) {
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: "proLicenseUrl" | "truckPhotos") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingField(fieldName);
    
    try {
      if (fieldName === "truckPhotos") {
        const currentPhotos = form.getValues("truckPhotos") || [];
        if (currentPhotos.length + files.length > 4) {
          alert("Хамгийн ихдээ 4 зураг оруулах боломжтой (4 талаас авсан).");
          return;
        }

        const newPhotoUrls = [...currentPhotos];
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/anket/api/upload-local", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) throw new Error("Truck photo upload failed");

          const result = await response.json();
          newPhotoUrls.push(result.url);
        }
        
        form.setValue("truckPhotos", newPhotoUrls);
      } else {
        const file = files[0];
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/anket/api/upload-local", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("License upload failed");

        const result = await response.json();
        form.setValue(fieldName, result.url);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Файл хуулахад алдаа гарлаа.");
    } finally {
      setUploadingField(null);
    }
  };

  const removePhoto = (index: number) => {
    const currentPhotos = form.getValues("truckPhotos") || [];
    const newPhotos = currentPhotos.filter((_, i) => i !== index);
    form.setValue("truckPhotos", newPhotos);
  };

  return (
    <div className="space-y-12">
      {/* 1. Truck Information */}
      <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 p-8 md:p-10 space-y-8 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h3 className="text-xl font-bold text-on-surface font-headline uppercase tracking-tight">Ачааны машины мэдээлэл</h3>
        </div>

        <div className="grid grid-cols-1 relative z-10">
          <FormField
            control={form.control}
            name="truckDetails"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-on-surface ml-1">Машины марк, улсын дугаар, даац гм</FormLabel>
                <FormControl>
                  <textarea 
                    placeholder="Жишээ: Hyundai Trago, 12-34 УБА, 25 тонн..." 
                    className="w-full min-h-[140px] rounded-xl border-none bg-surface-container-low p-8 focus:ring-2 focus:ring-primary/20 font-medium text-lg outline-variant outline outline-1 focus:outline-primary resize-none placeholder:text-on-surface-variant/30"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      {/* 2. Professional License & Truck Photos */}
      <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 p-8 md:p-10 space-y-10 relative">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h3 className="text-xl font-bold text-on-surface font-headline uppercase tracking-tight">Бичиг баримт & Зураг</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Pro License Upload */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><CreditCard className="w-5 h-5" /></div>
               <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest leading-none">Мэргэшсэн үнэмлэх</label>
            </div>
            
            <div className="relative aspect-[1.6/1] bg-surface-container-low/50 rounded-xl border-2 border-dashed border-outline-variant/30 flex items-center justify-center overflow-hidden group hover:border-primary/40 transition-all duration-300">
               {form.watch("proLicenseUrl") ? (
                 <>
                   <img src={form.getValues("proLicenseUrl")} alt="Pro License" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <Button variant="ghost" size="icon" onClick={() => form.setValue("proLicenseUrl", "")} className="h-12 w-12 bg-error text-white rounded-xl shadow-xl hover:bg-error-container transition-transform active:scale-90">
                        <X className="w-6 h-6" />
                      </Button>
                   </div>
                 </>
               ) : (
                 <div className="text-center space-y-4 p-8">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                       <CreditCard className="w-6 h-6 text-on-surface-variant/30" />
                    </div>
                    <Button type="button" variant="ghost" className="relative font-bold h-10 px-6 rounded-full bg-white shadow-sm hover:bg-primary/5 hover:text-primary transition-all uppercase text-[8px] tracking-widest border border-outline-variant/10">
                       {uploadingField === "proLicenseUrl" ? "Хуулж байна..." : "Файл сонгох"}
                       <input 
                         type="file" 
                         accept="image/*" 
                         className="absolute inset-0 opacity-0 cursor-pointer" 
                         onChange={(e) => handleFileUpload(e, "proLicenseUrl")}
                         disabled={!!uploadingField}
                       />
                    </Button>
                 </div>
               )}
               {uploadingField === "proLicenseUrl" && (
                 <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                 </div>
               )}
            </div>
          </div>

          {/* Truck Photos Upload */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Truck className="w-5 h-5" /></div>
               <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest leading-none">Машины зураг (4 талаас)</label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <AnimatePresence mode="popLayout">
                 {form.watch("truckPhotos")?.map((url, idx) => (
                   <motion.div 
                    key={url} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative aspect-square bg-surface-container-low/50 rounded-xl overflow-hidden group shadow-sm border border-outline-variant/10"
                   >
                      <img src={url} alt={`Truck ${idx}`} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-error text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110"
                      >
                        <X className="w-3 h-3" />
                      </button>
                   </motion.div>
                 ))}
               </AnimatePresence>
               
               {(form.watch("truckPhotos")?.length || 0) < 4 && (
                 <div key="add-button" className="relative aspect-square bg-surface-container-low/50 rounded-xl border-2 border-dashed border-outline-variant/30 flex items-center justify-center group hover:border-primary/40 transition-all duration-300">
                    <div className="text-center space-y-2 opacity-20 group-hover:opacity-100 transition-all">
                       <Camera className="w-6 h-6 text-primary mx-auto" />
                       <span className="text-[8px] font-bold text-on-surface uppercase tracking-widest block">Нэмэх</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={(e) => handleFileUpload(e, "truckPhotos")}
                      disabled={!!uploadingField}
                    />
                 </div>
               )}
            </div>
            
            <div className="p-4 bg-primary/5 rounded-xl flex gap-3 items-start">
               <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
               <p className="text-[10px] font-bold uppercase tracking-wider text-primary/60 leading-relaxed italic">
                 Машинаа урд, ард, 2 хажуу талаас нь тодорхой авсан 4 зураг оруулна уу.
               </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
