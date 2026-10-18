"use client";

import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ApplicationFormValues } from "@/lib/validations/application";
import { User, MapPin, Phone, Globe, Info, Users, Briefcase } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { jobsApi } from "@/lib/mysql-client";
import { motion } from "framer-motion";

interface PersonalInfoProps {
  form: UseFormReturn<ApplicationFormValues>;
  onPositionChange?: (isDriver: boolean) => void;
}

export function PersonalInfo({ form, onPositionChange }: PersonalInfoProps) {
  const [positions, setPositions] = useState<any[]>([]);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await jobsApi.list();
        if (response.data) {
          setPositions(response.data);
        }
      } catch (err) {
        console.error("Failed to load job positions:", err);
      }
    };
    fetchPositions();
  }, []);

  const years = Array.from({ length: 60 }, (_, i) => (2010 - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"));

  return (
    <div className="space-y-12">
      {/* 1. Employment Information */}
      <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h3 className="text-xl font-bold text-on-surface font-headline uppercase tracking-tight">Ажлын мэдээлэл</h3>
        </div>
        
        <FormField
          control={form.control}
          name="applyingFor"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-on-surface ml-1">Сонирхож буй ажлын байр</FormLabel>
              <Select 
                onValueChange={(val) => {
                  field.onChange(val);
                  const pos = positions.find(p => p.title === val);
                  if (onPositionChange) onPositionChange(!!pos?.is_driver_job);
                }} 
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger className="h-12 w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base">
                    <SelectValue placeholder="Жагсаалтаас сонгох..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl border-outline-variant/30 shadow-2xl">
                  {positions.map((pos) => (
                    <SelectItem key={pos.id} value={pos.title} className="font-medium">{pos.title}</SelectItem>
                  ))}
                  {positions.length === 0 && (
                    <SelectItem value="none" disabled>Нээлттэй ажлын байр байхгүй байна</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs font-medium" />
            </FormItem>
          )}
        />
      </section>

      {/* 2. Personal Identity Section */}
      <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 p-4 sm:p-6 md:p-10 space-y-8 md:space-y-10 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h3 className="text-xl font-bold text-on-surface font-headline uppercase tracking-tight">Иргэний мэдээлэл</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <FormField
            control={form.control}
            name="surname"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-on-surface ml-1">Ургийн овог</FormLabel>
                <FormControl>
                  <Input placeholder="Жишээ: Боржигон" {...field} className="h-12 w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
                </FormControl>
                <FormMessage className="text-xs font-medium" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-on-surface ml-1">Эцгийн нэр</FormLabel>
                <FormControl>
                  <Input placeholder="Жишээ: Бат" {...field} className="h-12 w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
                </FormControl>
                <FormMessage className="text-xs font-medium" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-on-surface ml-1">Өөрийн нэр</FormLabel>
                <FormControl>
                  <Input placeholder="Жишээ: Дорж" {...field} className="h-12 w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
                </FormControl>
                <FormMessage className="text-xs font-medium" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-sm font-semibold text-on-surface ml-1">Хүйс</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex gap-8 pt-1 pl-1"
                  >
                    <div className="flex items-center space-x-3 group cursor-pointer">
                      <RadioGroupItem value="male" id="male" className="w-5 h-5 border-2 border-outline-variant text-primary" />
                      <label htmlFor="male" className="text-sm font-bold text-on-surface-variant cursor-pointer group-hover:text-primary transition-colors">Эрэгтэй</label>
                    </div>
                    <div className="flex items-center space-x-3 group cursor-pointer">
                      <RadioGroupItem value="female" id="female" className="w-5 h-5 border-2 border-outline-variant text-primary" />
                      <label htmlFor="female" className="text-sm font-bold text-on-surface-variant cursor-pointer group-hover:text-primary transition-colors">Эмэгтэй</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-xs font-medium" />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <label className="text-sm font-semibold text-on-surface ml-1">Төрсөн огноо <span className="text-red-500">*</span></label>
            <Input 
              type="date"
              className="h-12 w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base"
              value={(form.watch("birthYear") && form.watch("birthMonth") && form.watch("birthDay")) ? `${form.watch("birthYear")}-${form.watch("birthMonth")?.padStart(2,'0')}-${form.watch("birthDay")?.padStart(2,'0')}` : ""}
              onChange={(e) => {
                const [y, m, d] = e.target.value.split('-');
                if(y && m && d) {
                  form.setValue("birthYear", y, { shouldValidate: true });
                  form.setValue("birthMonth", m, { shouldValidate: true });
                  form.setValue("birthDay", d, { shouldValidate: true });
                }
              }}
            />
          </div>

          <FormField
            control={form.control}
            name="birthPlace"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-on-surface ml-1">Төрсөн газар</FormLabel>
                <FormControl>
                  <Input placeholder="Хот, аймаг, сум" {...field} className="h-12 w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
                </FormControl>
                <FormMessage className="text-xs font-medium" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="registerNumber"
            render={({ field }) => (
              <FormItem className="md:col-span-2 space-y-2">
                <FormLabel className="text-sm font-semibold text-on-surface ml-1">Регистрийн дугаар</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Жишээ: АА00000000" 
                    {...field}
                    className="h-12 w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-bold text-lg text-primary tracking-widest transition-all outline-variant outline outline-1 focus:outline-primary uppercase"
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                </FormControl>
                <FormMessage className="text-xs font-medium" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maritalStatus"
            render={({ field }) => (
              <FormItem className="md:col-span-2 space-y-6 pt-6 border-t border-outline-variant/20">
                <FormLabel className="text-sm font-semibold text-on-surface ml-1">Гэрлэлтийн байдал</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-wrap gap-x-10 gap-y-4 pl-1"
                  >
                    {[
                      { label: "Гэрлэсэн", value: "married" },
                      { label: "Ганц бие", value: "single" },
                      { label: "Бэлэвсэн", value: "widowed" },
                      { label: "Салсан", value: "divorced" },
                    ].map((opt) => (
                      <div key={opt.value} className="flex items-center space-x-3 group cursor-pointer">
                        <RadioGroupItem value={opt.value} id={`ms-${opt.value}`} className="w-5 h-5 border-2 border-outline-variant text-primary" />
                        <label htmlFor={`ms-${opt.value}`} className="text-sm font-bold text-on-surface-variant cursor-pointer group-hover:text-primary transition-colors">{opt.label}</label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-xs font-medium" />
              </FormItem>
            )}
          />
        </div>
      </section>

      {/* 3. Online & Address Section */}
      <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h3 className="text-xl font-bold text-on-surface font-headline uppercase tracking-tight">Хаяг ба Холбоо барих</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-on-surface ml-1">И-мэйл хаяг</FormLabel>
                <FormControl><Input placeholder="example@mail.mn" {...field} className="h-12 w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" inputMode="email" /></FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="facebookUrl"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-on-surface ml-1">Фэйсбүүк хаяг</FormLabel>
                <FormControl><Input placeholder="Facebook profile link" {...field} className="h-12 w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" inputMode="url" /></FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addressCurrent"
            render={({ field }) => (
              <FormItem className="md:col-span-2 space-y-2">
                <FormLabel className="text-sm font-semibold text-on-surface ml-1">Одоогийн оршин суугаа хаяг /Байнгын/</FormLabel>
                <FormControl><Input placeholder="Дүүрэг, хороо, гудамж, байр тоот" {...field} className="h-12 w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" /></FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addressTemp"
            render={({ field }) => (
              <FormItem className="md:col-span-2 space-y-2">
                <FormLabel className="text-sm font-semibold text-on-surface ml-1">Оршин суугаа хаяг /Түр, Түрээс/</FormLabel>
                <FormControl><Input placeholder="Түр хаяг" {...field} className="h-12 w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" /></FormControl>
              </FormItem>
            )}
          />
        </div>
      </section>

      {/* 4. Phone Section */}
      <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8 relative">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h3 className="text-xl font-bold text-on-surface font-headline uppercase tracking-tight">Утасны дугаарууд</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="phoneHome"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Гэрийн утас</FormLabel>
                <FormControl><Input placeholder="70******" {...field} inputMode="tel" className="h-11 w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" /></FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneMobile"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs font-bold text-on-surface uppercase tracking-widest ml-1">Гар утас </FormLabel>
                <FormControl><Input placeholder="88******" {...field} inputMode="tel" className="h-11 w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-bold text-primary transition-all outline-variant outline outline-1 focus:outline-primary text-base tracking-widest" /></FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneWork"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Ажлын утас</FormLabel>
                <FormControl><Input placeholder="Байхгүй бол хоосон" {...field} inputMode="tel" className="h-11 w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" /></FormControl>
              </FormItem>
            )}
          />
        </div>
      </section>

      {/* 5. Emergency Contacts */}
      <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8 relative">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h3 className="text-xl font-bold text-on-surface font-headline uppercase tracking-tight">Яаралтай үед холбоо барих</h3>
        </div>
        
        <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest pl-1 italic">Бидэнтэй холбоо барих 3 хүний мэдээлэл (Нэр, Утас, Таны хэн болох):</p>
        
        <div className="space-y-6">
          {[0, 1, 2].map((idx) => (
            <FormField
              key={idx}
              control={form.control}
              name={`emergencyContacts.${idx}.details`}
              render={({ field }) => (
                <div className="flex items-center gap-4 group">
                  <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface font-black group-focus-within:bg-primary group-focus-within:text-on-primary transition-all duration-300 shadow-sm">
                     {idx + 1}
                  </div>
                  <FormItem className="flex-1 space-y-0">
                    <FormControl>
                      <Input placeholder="Жишээ: Аав Бат, 99******" {...field} className="h-11 w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
                    </FormControl>
                  </FormItem>
                </div>
              )}
            />
          ))}
        </div>
      </section>

      {/* 6. Internal Referral */}
      <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h3 className="text-xl font-bold text-on-surface font-headline uppercase tracking-tight">Танил талын мэдээлэл</h3>
        </div>

        <div className="space-y-10 relative z-10">
          <FormField
            control={form.control}
            name="internalReferral"
            render={({ field }) => (
              <FormItem className="space-y-6">
                <FormLabel className="text-sm font-semibold text-on-surface leading-relaxed ml-1">
                  Таны найз, эсвэл төрөл садан манай байгууллагад ажилладаг эсэх?
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(val) => field.onChange(val === "yes")}
                    value={field.value ? "yes" : "no"}
                    className="flex gap-10 pl-1"
                  >
                    <div className="flex items-center space-x-3 group cursor-pointer">
                      <RadioGroupItem value="yes" id="ir-yes" className="w-5 h-5 border-2 border-outline-variant text-primary" />
                      <label htmlFor="ir-yes" className="text-sm font-bold uppercase tracking-widest cursor-pointer group-hover:text-primary transition-colors">Тийм</label>
                    </div>
                    <div className="flex items-center space-x-3 group cursor-pointer">
                      <RadioGroupItem value="no" id="ir-no" className="w-5 h-5 border-2 border-outline-variant text-primary" />
                      <label htmlFor="ir-no" className="text-sm font-bold uppercase tracking-widest cursor-pointer group-hover:text-primary transition-colors">Үгүй</label>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("internalReferral") && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <FormField
                control={form.control}
                name="internalReferralDetails"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-on-surface ml-1">Тийм бол хэн, аль салбар/хэлтэст:</FormLabel>
                    <FormControl>
                      <Input placeholder="Жишээ: Салбар-1, Бат (найз)" {...field} className="h-12 w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
