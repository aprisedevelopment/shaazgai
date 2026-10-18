import * as z from "zod";

export const familyMemberSchema = z.object({
  relation: z.string().min(1, "Хамаарал сонгоно уу"),
  lastName: z.string().min(1, "Овог оруулна уу"),
  firstName: z.string().min(1, "Нэр оруулна уу"),
  birthYear: z.string().regex(/^\d{4}$/, "Төрсөн он алдаатай"),
  age: z.string().optional(),
  occupation: z.string().min(1, "Ажил эрхлэлт оруулна уу"),
  workplaceSchool: z.string().optional(),
  phone: z.string().min(8, "Утасны дугаар алдаатай"),
  registerNumber: z.string().optional(),
});

export const educationSchema = z.object({
  schoolName: z.string().min(1, "Сургуулийн нэр оруулна уу"),
  major: z.string().min(1, "Мэргэжил оруулна уу"),
  entryYear: z.string().regex(/^\d{4}$/, "Эхэлсэн он алдаатай"),
  graduationYear: z.string().regex(/^\d{4}$/, "Төгссөн он алдаатай"),
  degree: z.string().min(1, "Зэрэг сонгоно уу"),
  gpa: z.string().optional(),
});

export const workExperienceSchema = z.object({
  companyName: z.string().min(1, "Байгууллагын нэр оруулна уу"),
  position: z.string().min(1, "Албан тушаал оруулна уу"),
  startDate: z.string().min(1, "Орсон огноо"),
  endDate: z.string().min(1, "Гарсан огноо"),
  salary: z.string().optional(),
  reasonForLeaving: z.string().optional(),
  referencePerson: z.string().optional(),
});

export const extendedRelativeSchema = z.object({
  fullName: z.string().min(1, "Овог нэр оруулна уу"),
  occupation: z.string().min(1, "Ажил эрхлэлт оруулна уу"),
  workplace: z.string().min(1, "Ажлын газар оруулна уу"),
  contactInfo: z.string().min(1, "Холбоо барих мэдээлэл оруулна уу"),
});

export const referencePersonSchema = z.object({
  fullName: z.string().min(1, "Овог нэр оруулна уу"),
  occupation: z.string().min(1, "Ажил эрхлэлт оруулна уу"),
  workplace: z.string().min(1, "Ажлын газар оруулна уу"),
  contactInfo: z.string().min(1, "Холбоо барих мэдээлэл оруулна уу"),
});

const ratingSchema = z.enum(["good", "medium", "bad", "none"], {
  message: "Үнэлгээ сонгоно уу",
});

export const applicationSchema = z.object({
  // Section 1: Personal
  applyingFor: z.string().min(1, "Сонирхож буй ажлын байр"),
  surname: z.string().min(1, "Ургийн овог оруулна уу"),
  lastName: z.string().min(1, "Эцгийн нэр оруулна уу"),
  firstName: z.string().min(1, "Өөрийн нэр оруулна уу"),
  gender: z.enum(["male", "female"], { message: "Хүйс сонгоно уу" }),
  
  birthYear: z.string().min(1, "Он"),
  birthMonth: z.string().min(1, "Сар"),
  birthDay: z.string().min(1, "Өдөр"),
  birthPlace: z.string().min(1, "Төрсөн газар оруулна уу"),
  registerNumber: z.string().regex(/^[А-ЯӨҮЁ]{2}\d{8}$/, "Регистрийн дугаар алдаатай"),
  maritalStatus: z.enum(["married", "single", "widowed", "divorced"], { message: "Гэрлэлтийн байдал сонгоно уу" }),
  
  email: z.string().email("Имэйл хаяг алдаатай").optional().or(z.literal("")),
  facebookUrl: z.string().optional(),
  
  addressCurrent: z.string().min(1, "Байнгын хаяг оруулна уу"),
  addressTemp: z.string().optional(),
  
  phoneHome: z.string().optional(),
  phoneMobile: z.string().min(8, "Гар утас оруулна уу"),
  phoneWork: z.string().optional(),
  unemploymentReason: z.string().optional(),
  
  // Emergency contacts
  emergencyContacts: z.array(z.object({
    details: z.string().min(1, "Мэдээлэл оруулна уу"),
  })).min(1, "Ядаж нэг холбоо барих хүн оруулна уу"),

  internalReferral: z.boolean().default(false),
  internalReferralDetails: z.string().optional(),

  // Section 2: Family
  familyMembers: z.array(familyMemberSchema),

  // Section 3: Education & Work
  educationHistory: z.array(educationSchema),
  workExperience: z.array(workExperienceSchema),

  // Section 4: Skills Matrix
  languageSkills: z.array(z.object({
    language: z.string(),
    listening: ratingSchema,
    speaking: ratingSchema,
    reading: ratingSchema,
    writing: ratingSchema,
  })),
  
  pcSkills: z.object({
    windows: ratingSchema,
    msOffice: ratingSchema,
    adobe: ratingSchema,
    others: ratingSchema,
    otherDetails: z.string().optional(),
  }),

  // Section 5: Documents & Media
  photoUrl: z.string().optional(),
  diplomaUrl: z.string().optional(),
  idCardUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  
  // Health Status
  healthInfo: z.object({
    illnesses: z.string().optional(),
    badHabits: z.string().optional(),
  }),

  // Lists
  extendedRelatives: z.array(extendedRelativeSchema),
  referencePersons: z.array(referencePersonSchema).length(3, "3 хүнийг заавал оруулна уу"),

  futureGoals: z.string().min(1, "Ирээдүйн зорилгоо бичнэ үү"),
  
  referralSource: z.string().min(1, "Эх сурвалж сонгоно уу"),
  referralSourceDetails: z.string().optional(),
  
  additionalDetails: z.string().optional(),
  
  criminalRecord: z.boolean().default(false),
  criminalRecordDetails: z.string().optional(),
  
  desiredSalary: z.string().min(1, "Хүсч буй цалин оруулна уу"),
  availableDate: z.string().min(1, "Ажилд орох боломжтой хугацаа оруулна уу"),

  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  hobbies: z.string().optional(),
  militaryStatus: z.string().optional(),
  driverLicense: z.array(z.string()).optional(),
  termsAccepted: z.boolean().refine(val => val === true, "Заавал зөвшөөрөх шаардлагатай"),
  
  // Driver Specific
  truckDetails: z.string().optional(),
  proLicenseUrl: z.string().optional(),
  truckPhotos: z.array(z.string()).optional(),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;
