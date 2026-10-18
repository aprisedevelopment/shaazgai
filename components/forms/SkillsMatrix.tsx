"use client";

import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { ApplicationFormValues } from "@/lib/validations/application";
import { Languages, Monitor, CheckCircle2 } from "lucide-react";

interface SkillsMatrixProps {
  form: UseFormReturn<ApplicationFormValues>;
}

const RATING_OPTIONS = [
  { value: "good", label: "Сайн" },
  { value: "medium", label: "Дунд" },
  { value: "bad", label: "Муу" },
  { value: "none", label: "Үгүй" },
];

export function SkillsMatrix({ form }: SkillsMatrixProps) {
  const languages = ["Англи", "Орос", "Бусад"];
  const pcApplications = [
    { key: "windows", label: "Windows" },
    { key: "msOffice", label: "MS Office" },
    { key: "adobe", label: "Adobe" },
    { key: "others", label: "Бусад" },
  ];

  return (
    <div className="space-y-12">
      {/* 1. Language Matrix */}
      <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 p-4 sm:p-6 md:p-10 space-y-6 md:space-y-10 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h3 className="text-xl font-bold text-on-surface font-headline uppercase tracking-tight">Хэлний мэдлэг</h3>
        </div>

        <div className="overflow-x-auto relative z-10 -mx-4 sm:-mx-6 md:-mx-10 px-4 sm:px-6 md:px-10">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] border-b border-outline-variant/20">
                <th className="text-left py-4 px-4">Гадаад хэл</th>
                <th className="py-4">Сонсох</th>
                <th className="py-4">Ярих</th>
                <th className="py-4">Унших</th>
                <th className="py-4">Бичих</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {languages.map((lang, langIdx) => (
                <tr key={lang} className="hover:bg-primary/5 transition-colors duration-300">
                  <td className="py-6 px-4 font-bold text-on-surface font-headline uppercase tracking-tight">{lang}</td>
                  {["listening", "speaking", "reading", "writing"].map((skill) => (
                    <td key={skill} className="py-6 px-2">
                      <FormField
                        control={form.control}
                        name={`languageSkills.${langIdx}.${skill}` as any}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex justify-center gap-3"
                              >
                                {RATING_OPTIONS.map((opt) => (
                                  <div key={opt.value} className="flex flex-col items-center gap-1.5 group/opt cursor-pointer">
                                    <RadioGroupItem 
                                       value={opt.value} 
                                       id={`lang-${langIdx}-${skill}-${opt.value}`} 
                                       className="w-4 h-4 border-2 border-outline-variant text-primary" 
                                    />
                                    <label 
                                      htmlFor={`lang-${langIdx}-${skill}-${opt.value}`} 
                                      className="text-[8px] font-bold uppercase text-on-surface-variant/40 tracking-wider cursor-pointer group-hover/opt:text-primary transition-colors"
                                    >
                                      {opt.label}
                                    </label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. PC Matrix */}
      <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 p-4 sm:p-6 md:p-10 space-y-6 md:space-y-10 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h3 className="text-xl font-bold text-on-surface font-headline uppercase tracking-tight">Компьютерийн мэдлэг</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {pcApplications.map((pc) => (
            <div key={pc.key} className="bg-surface-container-low/50 border border-outline-variant/10 p-6 rounded-xl space-y-8 flex flex-col items-center text-center hover:border-primary/30 transition-all duration-300">
              <div className="space-y-2">
                 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto shadow-sm">
                    <Monitor className="w-5 h-5" />
                 </div>
                 <p className="text-sm font-bold text-on-surface uppercase tracking-tight font-headline">{pc.label}</p>
              </div>
              
              <FormField
                control={form.control}
                name={`pcSkills.${pc.key}` as any}
                render={({ field }) => (
                  <FormItem className="w-full space-y-0">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col items-center gap-3 w-full"
                      >
                        {RATING_OPTIONS.map((opt) => (
                          <div key={opt.value} className="flex items-center justify-between w-full group/pc cursor-pointer px-2 py-1.5 rounded-lg hover:bg-white/50 transition-colors">
                            <label 
                              htmlFor={`pc-${pc.key}-${opt.value}`} 
                              className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest cursor-pointer group-hover/pc:text-on-surface"
                            >
                              {opt.label}
                            </label>
                            <RadioGroupItem value={opt.value} id={`pc-${pc.key}-${opt.value}`} className="w-4 h-4 border-2 border-outline-variant text-primary" />
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
