"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { ApplicationFormValues } from "@/lib/validations/application";
import { Plus, Trash2, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FamilyMembersProps {
  form: UseFormReturn<ApplicationFormValues>;
}

export function FamilyMembers({ form }: FamilyMembersProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "familyMembers",
  });

  return (
    <div className="space-y-12">
      <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 p-4 sm:p-6 md:p-10 space-y-6 md:space-y-10 relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            <h3 className="text-xl font-bold text-on-surface font-headline uppercase tracking-tight">Гэр бүлийн байдал</h3>
          </div>
          <Button
            type="button"
            onClick={() => append({ relation: "", lastName: "", firstName: "", birthYear: "", age: "", occupation: "", workplaceSchool: "", phone: "" })}
            className="h-12 px-8 rounded-full bg-primary text-on-primary font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 flex items-center gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Гишүүн нэмэх
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
                 <Users className="w-8 h-8 text-on-surface-variant/30" />
              </div>
              <p className="text-on-surface-variant/40 font-bold uppercase tracking-widest text-[10px]">Гэр бүлийн гишүүдийн мэдээлэл одоогоор байхгүй байна.</p>
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
                      <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Гишүүн</span>
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
                
                <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <FormField
                    control={form.control}
                    name={`familyMembers.${index}.relation`}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-semibold text-on-surface-variant ml-1">Таны хэн болох</FormLabel>
                        <FormControl>
                          <Input placeholder="Жишээ: Эцэг" {...field} className="h-11 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`familyMembers.${index}.lastName`}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-semibold text-on-surface-variant ml-1">Овог / Эцгийн нэр</FormLabel>
                        <FormControl>
                          <Input placeholder="Жишээ: Бат" {...field} className="h-11 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`familyMembers.${index}.firstName`}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-semibold text-on-surface-variant ml-1">Өөрийн нэр</FormLabel>
                        <FormControl>
                          <Input placeholder="Жишээ: Дорж" {...field} className="h-11 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`familyMembers.${index}.age`}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-semibold text-on-surface-variant ml-1">Нас</FormLabel>
                        <FormControl>
                          <Input placeholder="Нас" {...field} inputMode="numeric" className="h-11 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`familyMembers.${index}.birthYear`}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-semibold text-on-surface-variant ml-1">Төрсөн он</FormLabel>
                        <FormControl>
                          <Input placeholder="YYYY" {...field} maxLength={4} inputMode="numeric" className="h-11 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`familyMembers.${index}.occupation`}
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
                    name={`familyMembers.${index}.workplaceSchool`}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2 space-y-2">
                        <FormLabel className="text-xs font-semibold text-on-surface-variant ml-1">Ажлын газар / Сургууль</FormLabel>
                        <FormControl>
                          <Input placeholder="Байгууллагын нэр" {...field} className="h-11 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`familyMembers.${index}.phone`}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2 lg:col-span-1 space-y-2">
                        <FormLabel className="text-xs font-semibold text-on-surface-variant ml-1">Утас</FormLabel>
                        <FormControl>
                          <Input placeholder="Утасны дугаар" {...field} inputMode="tel" className="h-11 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-lg px-4 font-medium transition-all outline-variant outline outline-1 focus:outline-primary text-base" />
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
      </section>
    </div>
  );
}
