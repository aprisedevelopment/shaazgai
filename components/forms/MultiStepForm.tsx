"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { applicationSchema, type ApplicationFormValues } from "@/lib/validations/application";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { applicationsApi, jobsApi } from "@/lib/mysql-client";
import { User, School, FileText, CheckCircle, Printer, Loader2, Sparkles, Send, ArrowRight, ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { PersonalInfo } from "./PersonalInfo";
import { FamilyMembers } from "./FamilyMembers";
import { EducationHistory } from "./EducationHistory";
import { WorkExperience } from "./WorkExperience";
import { SkillsMatrix } from "./SkillsMatrix";
import { OtherInfo } from "./OtherInfo";
import { DriverInfo } from "./DriverInfo";

const STEPS = [
  { id: 1, title: "Хувийн мэдээлэл", icon: <User className="w-5 h-5" /> },
  { id: 2, title: "Гэр бүл", icon: <UsersIcon className="w-5 h-5" /> },
  { id: 3, title: "Туршлага", icon: <School className="w-5 h-5" /> },
  { id: 4, title: "Ур чадвар", icon: <Sparkles className="w-5 h-5" /> },
  { id: 5, title: "Бусад", icon: <FileText className="w-5 h-5" /> },
];

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
}

export default function MultiStepForm() {
  const searchParams = useSearchParams();
  const defaultJobTitle = searchParams.get('jobTitle') || "";

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [isDriverJob, setIsDriverJob] = useState(false);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema) as any,
    defaultValues: {
      applyingFor: defaultJobTitle,
      surname: "",
      lastName: "",
      firstName: "",
      gender: "male",
      birthYear: "",
      birthMonth: "",
      birthDay: "",
      birthPlace: "",
      registerNumber: "",
      maritalStatus: "single",
      email: "",
      facebookUrl: "",
      addressCurrent: "",
      addressTemp: "",
      phoneHome: "",
      phoneMobile: "",
      phoneWork: "",
      emergencyContacts: [{ details: "" }, { details: "" }, { details: "" }],
      internalReferral: false,
      internalReferralDetails: "",
      familyMembers: [],
      educationHistory: [],
      workExperience: [],
      languageSkills: [
        { language: "Англи", listening: "none", speaking: "none", reading: "none", writing: "none" },
        { language: "Орос", listening: "none", speaking: "none", reading: "none", writing: "none" },
        { language: "Бусад", listening: "none", speaking: "none", reading: "none", writing: "none" },
      ],
      pcSkills: { windows: "none", msOffice: "none", adobe: "none", others: "none" },
      unemploymentReason: "",
      strengths: "",
      weaknesses: "",
      hobbies: "",
      desiredSalary: "",
      photoUrl: "",
      healthInfo: { illnesses: "", badHabits: "" },
      extendedRelatives: [],
      referencePersons: [
        { fullName: "", occupation: "", workplace: "", contactInfo: "" },
        { fullName: "", occupation: "", workplace: "", contactInfo: "" },
        { fullName: "", occupation: "", workplace: "", contactInfo: "" },
      ],
      futureGoals: "",
      referralSource: "",
      referralSourceDetails: "",
      additionalDetails: "",
      criminalRecord: false,
      criminalRecordDetails: "",
      availableDate: "",
      diplomaUrl: "",
      idCardUrl: "",
      termsAccepted: false,
      truckDetails: "",
      proLicenseUrl: "",
      truckPhotos: [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    const savedStep = localStorage.getItem("tugeelt_anket_step");
    if (savedStep) setCurrentStep(parseInt(savedStep));
    const savedData = localStorage.getItem("tugeelt_anket_data");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        form.reset(parsedData);
      } catch (e) { console.error(e); }
    }
  }, []);

  const formData = form.watch();
  useEffect(() => {
    if (currentStep < 7) {
      localStorage.setItem("tugeelt_anket_step", currentStep.toString());
      localStorage.setItem("tugeelt_anket_data", JSON.stringify(formData));
    }
  }, [formData, currentStep]);

  useEffect(() => {
    if (defaultJobTitle) {
      const checkInitialJob = async () => {
        try {
          const jobs = await jobsApi.list();
          const job = jobs.data?.find((j: any) => j.title === defaultJobTitle);
          if (job?.is_driver_job) setIsDriverJob(true);
        } catch (err) {
          console.error("Failed to check driver job:", err);
        }
      };
      checkInitialJob();
    }
  }, [defaultJobTitle]);

  const onSubmit = async (data: ApplicationFormValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Илгээж байна...");
    try {
      const birthDateString = `${data.birthYear}-${data.birthMonth.padStart(2, '0')}-${data.birthDay.padStart(2, '0')}`;

      const payload = {
        surname: data.surname,
        last_name: data.lastName,
        first_name: data.firstName,
        register_number: data.registerNumber,
        birth_date: birthDateString,
        birth_year: data.birthYear,
        birth_place: data.birthPlace,
        gender: data.gender,
        email: data.email,
        facebook_url: data.facebookUrl,
        address_current: data.addressCurrent,
        temp_address: data.addressTemp,
        phone: data.phoneMobile,
        phone_home: data.phoneHome,
        phone_mobile: data.phoneMobile,
        phone_work: data.phoneWork,
        marital_status: data.maritalStatus,
        applying_for: data.applyingFor,
        emergency_contact: data.emergencyContacts,
        internal_referral: data.internalReferral,
        internal_referral_details: data.internalReferralDetails,
        unemployment_reason: data.unemploymentReason,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        hobbies: data.hobbies,
        desired_salary: data.desiredSalary,
        photo_url: data.photoUrl,
        health_info: data.healthInfo,
        future_goals: data.futureGoals,
        referral_source: data.referralSource,
        referral_source_details: data.referralSourceDetails,
        additional_details: data.additionalDetails,
        criminal_record: data.criminalRecord,
        criminal_record_details: data.criminalRecordDetails,
        available_date: data.availableDate,
        diploma_url: data.diplomaUrl,
        id_card_url: data.idCardUrl,
        video_url: (data as any).videoUrl,
        truck_details: data.truckDetails,
        pro_license_url: data.proLicenseUrl,
        truck_photos: data.truckPhotos,
        status: 'pending',
        family_members: data.familyMembers.map((m: any) => ({
          relation: m.relation,
          last_name: m.lastName,
          first_name: m.firstName,
          birth_year: m.age ? parseInt(m.age) : null,
          occupation: m.occupation,
          workplace_school: m.workplaceSchool,
          phone: m.phone,
          register_number: m.registerNumber,
        })),
        education_history: data.educationHistory.map((e: any) => ({
          school_name: e.schoolName,
          major: e.major,
          entry_year: parseInt(e.entryYear),
          graduation_year: parseInt(e.graduationYear),
          degree: e.degree,
        })),
        work_experience: data.workExperience.map((w: any) => ({
          company_name: w.companyName,
          position: w.position,
          start_date: w.startDate,
          end_date: w.endDate,
          salary: w.salary,
          reason_for_leaving: w.reasonForLeaving,
        })),
        skills: {
          language_matrix: data.languageSkills,
          pc_matrix: data.pcSkills,
        },
        extended_relatives: data.extendedRelatives.map((r: any) => ({
          full_name: r.fullName,
          occupation: r.occupation,
          workplace: r.workplace,
          contact_info: r.contactInfo,
        })),
        reference_persons: data.referencePersons.map((r: any) => ({
          full_name: r.fullName,
          occupation: r.occupation,
          workplace: r.workplace,
          contact_info: r.contactInfo,
        })),
      };

      const result = await applicationsApi.create(payload);
      const appId = result.id;

      toast.success("Амжилттай илгээгдлээ!", { id: toastId });
      localStorage.removeItem("tugeelt_anket_data");
      localStorage.removeItem("tugeelt_anket_step");
      setSubmittedId(appId);
      setCurrentStep(totalSteps + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      toast.error(`Алдаа: ${e.message}`, { id: toastId });
    } finally { setIsSubmitting(false); }
  };

  const nextStep = async () => {
    const fieldsByStep: (keyof ApplicationFormValues)[][] = [
      ["applyingFor", "surname", "lastName", "firstName", "gender", "birthYear", "birthMonth", "birthDay", "birthPlace", "registerNumber", "maritalStatus", "email", "facebookUrl", "addressCurrent", "phoneMobile", "emergencyContacts", "internalReferral"],
      ["familyMembers"],
      ["educationHistory", "workExperience"],
      ["languageSkills", "pcSkills"],
      ["healthInfo", "extendedRelatives", "referencePersons", "futureGoals", "referralSource", "criminalRecord", "desiredSalary", "availableDate", "termsAccepted"]
    ];
    const isValid = await form.trigger(fieldsByStep[currentStep - 1] as any);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else { toast.error("Шаардлагатай мэдээллийг гүйцэд бөглөнө үү."); }
  };

  const totalSteps = isDriverJob ? 6 : 5;
  const displaySteps = [...STEPS, ...(isDriverJob ? [{ id: 6, title: "Жолооч", icon: <BriefcaseIcon className="w-5 h-5" /> }] : [])];

  if (currentStep > totalSteps) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-12 text-center space-y-8 border border-outline-variant/20">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto animate-bounce">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-black font-headline text-on-surface uppercase tracking-tight">Амжилттай илгээгдлээ</h1>
            <p className="text-on-surface-variant font-medium leading-relaxed">Таны анкетыг бид хүлээн авлаа. Хүний нөөцийн баг таны мэдээллийг хянаад хариу мэдэгдэх болно.</p>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center font-headline">
            {submittedId && (
              <Link href={`/receipt/${submittedId}?print=true`} target="_blank">
                <Button className="w-full sm:w-auto h-14 px-8 rounded-full bg-surface-container-high text-on-surface-variant font-bold hover:bg-surface-container transition-all">
                  <Printer className="w-5 h-5 mr-3" /> Хэвлэх (PDF)
                </Button>
              </Link>
            )}
            <Button onClick={() => window.location.href = '/anket/'} className="w-full sm:w-auto h-14 px-10 rounded-full bg-primary text-on-primary font-bold shadow-lg shadow-primary/20 hover:bg-primary-container active:scale-95 transition-all">
              Дуусгах
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <header className="space-y-4 text-center">
        <h1 className="font-headline font-extrabold text-4xl text-on-surface tracking-tight">Анкет бөглөх</h1>
        <p className="text-on-surface-variant body-md leading-relaxed mx-auto max-w-xl">Хамтдаа ирээдүйг бүтээцгээе. Та доорх мэдээллийг үнэн зөв бөглөнө үү.</p>
      </header>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 overflow-hidden">
        {/* TalentStream Progress Indicator */}
        <div className="bg-surface-container-low px-8 py-6 border-b border-outline-variant/30">
          <div className="flex justify-between items-center relative overflow-x-auto pb-2 scrollbar-hide">
            <div className="absolute top-5 left-0 w-full h-0.5 bg-outline-variant/30 -z-0"></div>
            {displaySteps.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <div key={step.id} className="flex flex-col items-center gap-2 relative z-10 min-w-20">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isActive ? "bg-primary text-on-primary ring-4 ring-primary/20 scale-110" : 
                    isCompleted ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant"
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5 text-on-primary" /> : step.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? "text-primary" : "text-on-surface-variant/50"}`}>
                    {step.title.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8 md:space-y-12">
              <AnimatePresence mode="wait">
                <motion.div key={currentStep} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }}>
                  {currentStep === 1 && <PersonalInfo form={form as any} onPositionChange={setIsDriverJob} />}
                  {currentStep === 2 && <FamilyMembers form={form as any} />}
                  {currentStep === 3 && <div className="space-y-8 md:space-y-12"><EducationHistory form={form as any} /><WorkExperience form={form as any} /></div>}
                  {currentStep === 4 && <SkillsMatrix form={form as any} />}
                  {currentStep === 5 && <OtherInfo form={form as any} />}
                  {currentStep === 6 && isDriverJob && <DriverInfo form={form as any} />}
                </motion.div>
              </AnimatePresence>

              <div className="pt-6 md:pt-8 border-t border-outline-variant/30 flex flex-col sm:flex-row-reverse gap-4 font-headline">
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={nextStep} className="w-full sm:w-auto h-14 px-10 rounded-full bg-primary text-on-primary font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center gap-2">
                    Үргэлжлүүлэх <ArrowRight className="w-5 h-5" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto h-14 px-10 rounded-full bg-primary text-on-primary font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Илгээж байна...</> : <>Илгээх <Send className="w-5 h-5" /> </>}
                  </Button>
                )}
                
                {currentStep > 1 && (
                  <Button type="button" onClick={() => setCurrentStep(prev => prev - 1)} disabled={isSubmitting} className="w-full sm:w-auto h-14 px-10 rounded-full bg-surface-container-low text-on-surface-variant font-bold hover:bg-surface-container transition-all">
                    Буцах
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
