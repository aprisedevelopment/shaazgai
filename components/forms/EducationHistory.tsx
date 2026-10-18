"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { ApplicationFormValues } from "@/lib/validations/application";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

interface EducationHistoryProps {
  form: UseFormReturn<ApplicationFormValues>;
}

export function EducationHistory({ form }: EducationHistoryProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "educationHistory",
  });

  return (
    <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 p-4 sm:p-6 md:p-10 space-y-6 md:space-y-10 relative overflow-hidden">
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h3 className="text-xl font-bold text-on-surface font-headline uppercase tracking-tight">Боловсролын түүх</h3>
        </div>
        <Button
          type="button"
          onClick={() => append({ schoolName: "", degree: "", major: "", entryYear: "", graduationYear: "" })}
          className="h-12 px-8 rounded-full bg-primary text-on-primary font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 flex items-center gap-2 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Сургууль нэмэх
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
               <GraduationCap className="w-8 h-8 text-on-surface-variant/30" />
            </div>
            <p className="text-on-surface-variant/40 font-bold uppercase tracking-widest text-[10px]">Боловсролын мэдээлэл одоогоор байхгүй байна.</p>
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
                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Сургууль</span>
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
                  name={`educationHistory.${index}.schoolName`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2 space-y-2">
                      <FormLabel className="text-xs font-semibold text-on-surface-variant ml-1">Сургуулийн нэр</FormLabel>
                      <FormControl>
                        <Input placeholder="Сургуулийн бүтэн нэр" {...field} className="h-11 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name={`educationHistory.${index}.degree`}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-semibold text-on-surface-variant ml-1">Зэрэг / Түвшин</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 bg-surface-container-low border-none rounded-lg font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base">
                            <SelectValue placeholder="Сонгоно уу" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-outline-variant/30">
                          <SelectItem value="secondary" className="font-medium">Бүрэн дунд</SelectItem>
                          <SelectItem value="bachelor" className="font-medium">Бакалавр</SelectItem>
                          <SelectItem value="master" className="font-medium">Магистр</SelectItem>
                          <SelectItem value="doctor" className="font-medium">Доктор</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`educationHistory.${index}.major`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2 space-y-2">
                      <FormLabel className="text-xs font-semibold text-on-surface-variant ml-1">Мэргэжил</FormLabel>
                      <FormControl>
                        <Input placeholder="Жишээ: Программ хангамж" {...field} className="h-11 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`educationHistory.${index}.entryYear`}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-semibold text-on-surface-variant ml-1">Элссэн он</FormLabel>
                        <FormControl>
                          <Input placeholder="20xx" {...field} inputMode="numeric" maxLength={4} className="h-11 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-center text-base" />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`educationHistory.${index}.graduationYear`}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-semibold text-on-surface-variant ml-1">Төгссөн он</FormLabel>
                        <FormControl>
                          <Input placeholder="20xx" {...field} inputMode="numeric" maxLength={4} className="h-11 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-center text-base" />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </section>
  );
}
