"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { ApplicationFormValues } from "@/lib/validations/application";
import { Plus, Trash2, Briefcase, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WorkExperienceProps {
  form: UseFormReturn<ApplicationFormValues>;
}

export function WorkExperience({ form }: WorkExperienceProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workExperience",
  });

  return (
    <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 p-4 sm:p-6 md:p-10 space-y-6 md:space-y-10 relative overflow-hidden">
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h3 className="text-xl font-bold text-on-surface font-headline uppercase tracking-tight">Ажлын туршлага</h3>
        </div>
        <Button
          type="button"
          onClick={() => append({ companyName: "", position: "", startDate: "", endDate: "", salary: "", reasonForLeaving: "", referencePerson: "" })}
          className="h-12 px-8 rounded-full bg-primary text-on-primary font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 flex items-center gap-2 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Туршлага нэмэх
        </Button>
      </div>
      
      <AnimatePresence mode="popLayout">
        {fields.length === 0 && (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-20 bg-surface-container-low/50 rounded-xl border-2 border-dashed border-outline-variant/50"
          >
            <div className="w-16 h-16 bg-surface-container mx-auto rounded-2xl flex items-center justify-center mb-6 shadow-sm">
               <Briefcase className="w-8 h-8 text-on-surface-variant/30" />
            </div>
            <p className="text-on-surface-variant/40 font-bold uppercase tracking-widest text-[10px]">Ажлын туршлага одоогоор байхгүй байна.</p>
          </motion.div>
        )}

        <div key="list-container" className="space-y-10 relative z-10">
          {fields.map((field, index) => (
            <motion.div 
              key={field.id} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="bg-white/50 rounded-xl border border-outline-variant/20 overflow-hidden"
            >
              <div className="bg-surface-container-low px-6 py-4 flex justify-between items-center border-b border-outline-variant/20">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                       {index + 1}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Байгууллага</span>
                 </div>
                 <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="h-8 w-8 rounded-lg text-on-surface-variant/30 hover:text-error hover:bg-error/5 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
              </div>
              
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name={`workExperience.${index}.companyName`}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-semibold text-on-surface-variant ml-1">Байгууллагын нэр</FormLabel>
                      <FormControl>
                        <Input placeholder="Жишээ: Түгээлт Сүлжээ ХХК" {...field} className="h-11 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`workExperience.${index}.position`}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-semibold text-on-surface-variant ml-1">Албан тушаал</FormLabel>
                      <FormControl>
                        <Input placeholder="Жишээ: Нярав" {...field} className="h-11 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`workExperience.${index}.salary`}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-semibold text-on-surface-variant ml-1">Цалин (Сард)</FormLabel>
                      <FormControl>
                        <Input placeholder="₮" {...field} inputMode="numeric" className="h-11 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-bold text-primary transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`workExperience.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-semibold text-on-surface-variant ml-1">Орсон огноо</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="h-11 w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`workExperience.${index}.endDate`}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-semibold text-on-surface-variant ml-1">Гарсан огноо</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="h-11 w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name={`workExperience.${index}.referencePerson`}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-semibold text-on-surface-variant ml-1">Тодорхойлох хүн / Утас</FormLabel>
                      <FormControl>
                        <Input placeholder="Нэр, утасны дугаар" {...field} className="h-11 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`workExperience.${index}.reasonForLeaving`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-3 space-y-2">
                      <FormLabel className="text-xs font-semibold text-on-surface-variant ml-1">Гарсан шалтгаан</FormLabel>
                      <FormControl>
                        <Input placeholder="Шалтгаанаа товч бичнэ үү" {...field} className="h-11 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Unemployment Reason Section */}
      <div className="mt-12 pt-8 border-t border-outline-variant/20 space-y-6 relative">
        <FormField
          control={form.control}
          name="unemploymentReason"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Sparkles className="w-5 h-5" /></div>
                  <label className="text-sm font-semibold text-on-surface leading-relaxed">
                    Та 3 сараас дээш хугацаагаар ажилгүй байсан шалтгаанаа заавал бичнэ үү:
                  </label>
              </div>
              <FormControl>
                <textarea 
                  className="w-full min-h-[140px] rounded-xl border-none bg-surface-container-low p-6 focus:ring-2 focus:ring-primary/20 transition-all font-medium text-base outline-variant outline outline-1 focus:outline-primary resize-none placeholder:text-on-surface-variant/30"
                  placeholder="Шалтгаанаа энд дэлгэрэнгүй бичнэ үү..."
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}
