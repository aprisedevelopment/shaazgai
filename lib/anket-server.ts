import crypto from "crypto";
import { auth } from "@/auth";

const APPLICATION_STATUSES = ["pending", "reviewed", "accepted", "rejected"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export function isValidApplicationStatus(status: string): status is ApplicationStatus {
  return (APPLICATION_STATUSES as readonly string[]).includes(status);
}

/**
 * Verifies the caller has an authenticated admin session.
 */
export async function requireAdmin() {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user || user.role !== "admin") {
    return null;
  }
  return user;
}

function getReceiptSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (secret) return secret;
  return "tugeelt-dev-receipt-secret-change-in-prod";
}

/**
 * Generates a short-lived HMAC-SHA256 token allowing an applicant to view/print their own receipt.
 */
export function createReceiptToken(applicationId: string, ttlSeconds = 7 * 24 * 60 * 60): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${applicationId}.${exp}`;
  const sig = crypto.createHmac("sha256", getReceiptSecret()).update(payload).digest("hex");
  return `${exp}.${sig}`;
}

export function verifyReceiptToken(applicationId: string, token: string | null | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [expStr, sig] = parts;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", getReceiptSecret())
    .update(`${applicationId}.${expStr}`)
    .digest("hex");

  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function normalizeEmergencyContacts(raw: unknown): Array<{ details: string }> {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        if (typeof item === "string") return { details: item };
        if (item && typeof item === "object") {
          const obj = item as Record<string, unknown>;
          const details =
            (obj.details as string) ||
            [obj.name, obj.relation, obj.phone].filter(Boolean).join(" / ");
          return { details: details || "" };
        }
        return { details: "" };
      })
      .filter((x) => x.details.trim() !== "");
  }
  if (typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    const summary = [obj.name, obj.relation ? `(${obj.relation})` : "", obj.phone]
      .filter(Boolean)
      .join(" ");
    return summary ? [{ details: summary }] : [];
  }
  return [];
}

/**
 * Canonical serializer for Application records across list, detail, receipt, and export views.
 */
export function formatApplication(app: any) {
  const familyMembers = (app.familyMembers || []).map((m: any) => ({
    id: m.id,
    relation: m.relation || "",
    last_name: m.lastName || "",
    first_name: m.firstName || "",
    birth_year: m.birthYear || "",
    occupation: m.occupation || "",
    workplace_school: m.workplaceSchool || "",
    phone: m.phone || "",
    register_number: m.registerNumber || "",
  }));

  const educationHistory = (app.educationHistory || []).map((e: any) => ({
    id: e.id,
    school_name: e.schoolName || "",
    school_type: e.schoolType || "",
    degree: e.degree || "",
    major: e.major || "",
    entry_year: e.entryYear || "",
    graduation_year: e.graduationYear || "",
    gpa: e.gpa || "",
  }));

  const workExperience = (app.workExperience || []).map((w: any) => ({
    id: w.id,
    company_name: w.companyName || "",
    position: w.position || "",
    start_date: w.startDate || "",
    end_date: w.endDate || "",
    salary: w.salary || "",
    reason_for_leaving: w.reasonForLeaving || "",
    reference_person: w.referencePerson || "",
  }));

  const extendedRelatives = (app.extendedRelatives || []).map((r: any) => ({
    id: r.id,
    relation: r.relation || "",
    full_name: r.fullName || "",
    occupation: r.occupation || "",
    workplace: r.workplace || "",
    contact_info: r.contactInfo || "",
  }));

  const referencePersons = (app.referencePersons || []).map((p: any) => ({
    id: p.id,
    full_name: p.fullName || "",
    occupation: p.occupation || "",
    workplace: p.workplace || "",
    contact_info: p.contactInfo || "",
  }));

  const normalizedSkills = app.skills
    ? {
        language_matrix: app.skills.languageMatrix || [],
        pc_matrix: app.skills.pcMatrix || {},
      }
    : null;

  const emergencyContacts = normalizeEmergencyContacts(app.emergencyContact);

  return {
    id: app.id,
    surname: app.surname || "",
    last_name: app.lastName || "",
    first_name: app.firstName || "",
    register_number: app.registerNumber || "",
    birth_date: app.birthDate || "",
    birth_year: app.birthYear || "",
    birth_place: app.birthPlace || "",
    gender: app.gender || "",
    marital_status: app.maritalStatus || "",
    email: app.email || "",
    facebook_url: app.facebookUrl || "",
    phone: app.phone || app.phoneMobile || "",
    phone_mobile: app.phoneMobile || app.phone || "",
    phone_home: app.phoneHome || "",
    phone_work: app.phoneWork || "",
    address_current: app.addressCurrent || "",
    address_temp: app.addressTemp || "",
    temp_address: app.addressTemp || "",
    applying_for: app.applyingFor || "",
    photo_url: app.photoUrl || "",
    id_card_url: app.idCardUrl || "",
    diploma_url: app.diplomaUrl || "",
    pro_license_url: app.proLicenseUrl || "",
    video_url: app.videoUrl || "",
    truck_details: app.truckDetails || "",
    truck_photos: Array.isArray(app.truckPhotos) ? app.truckPhotos : [],
    health_info: app.healthInfo || {},
    criminal_record: !!app.criminalRecord,
    criminal_record_details: app.criminalRecordDetails || "",
    military_status: app.militaryStatus || "",
    driver_license: Array.isArray(app.driverLicense) ? app.driverLicense : [],
    additional_details: app.additionalDetails || "",
    admin_notes: app.adminNotes || "",
    desired_salary: app.desiredSalary || "",
    available_date: app.availableDate || "",
    future_goals: app.futureGoals || "",
    strengths: app.strengths || "",
    weaknesses: app.weaknesses || "",
    hobbies: app.hobbies || "",
    referral_source: app.referralSource || "",
    referral_source_details: app.referralSourceDetails || "",
    internal_referral: !!app.internalReferral,
    internal_referral_details: app.internalReferralDetails || "",
    unemployment_reason: app.unemploymentReason || "",
    emergency_contacts: emergencyContacts,
    status: app.status || "pending",
    legacy_id: app.legacyId ?? null,
    family_members: familyMembers,
    family_count: familyMembers.length,
    education_history: educationHistory,
    education_count: educationHistory.length,
    work_experience: workExperience,
    work_count: workExperience.length,
    skills: normalizedSkills,
    extended_relatives: extendedRelatives,
    reference_persons: referencePersons,
    created_at: app.createdAt ? app.createdAt.toISOString() : null,
    updated_at: app.updatedAt ? app.updatedAt.toISOString() : null,
  };
}

export function formatJobPosition(job: any, applicationCount?: number) {
  const isDriverByTitle =
    job.title?.toLowerCase().includes("жолооч") ||
    job.title?.toLowerCase().includes("түгээлт");

  return {
    id: job.id,
    title: job.title,
    department: job.department || "",
    location: job.location || "Улаанбаатар",
    employment_type: job.employmentType || "Бүтэн цаг",
    salary_range: job.salaryRange || "",
    description: job.description || "",
    responsibilities: job.responsibilities || "",
    requirements: job.requirements || "",
    benefits: job.benefits || "",
    image_url: job.imageUrl || "",
    is_driver_job: Boolean(job.isDriverJob ?? isDriverByTitle),
    is_active: job.isActive !== false,
    application_count: applicationCount ?? 0,
    created_at: job.createdAt ? job.createdAt.toISOString() : null,
    updated_at: job.updatedAt ? job.updatedAt.toISOString() : null,
  };
}
