import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createNotification } from "@/app/admin/notificationActions";
import { applicationSchema } from "@/lib/validations/application";
import { formatApplication, createReceiptToken, requireAdmin } from "@/lib/anket-server";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Зөвшөөрөлгүй хандалт" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limitParam = searchParams.get("limit");
    const limit =
      limitParam === "all"
        ? 5000
        : Math.min(5000, Math.max(1, parseInt(limitParam || "500", 10) || 500));
    const status = searchParams.get("status");
    const position = searchParams.get("position");
    const gender = searchParams.get("gender");
    const search = searchParams.get("search")?.trim();

    const skip = (page - 1) * limit;
    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }
    if (position && position !== "all") {
      where.applyingFor = position;
    }
    if (gender && gender !== "all") {
      where.gender = gender;
    }
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { registerNumber: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { phoneMobile: { contains: search } },
      ];
    }

    const [total, applications] = await Promise.all([
      prisma.application.count({ where }),
      prisma.application.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          familyMembers: true,
          educationHistory: true,
          workExperience: true,
          skills: true,
          extendedRelatives: true,
          referencePersons: true,
        },
      }),
    ]);

    return NextResponse.json({
      data: applications.map(formatApplication),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("GET /api/anket/applications error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function normalizeIncomingApplication(raw: any) {
  const birthDateRaw = String(raw.birthDate || raw.birth_date || "");
  const birthParts = birthDateRaw.split("-");
  const birthYear = String(raw.birthYear || raw.birth_year || birthParts[0] || "");
  const birthMonth = String(raw.birthMonth || raw.birth_month || birthParts[1] || "");
  const birthDay = String(raw.birthDay || raw.birth_day || birthParts[2] || "");

  const emergencyContacts = Array.isArray(raw.emergencyContacts)
    ? raw.emergencyContacts
    : Array.isArray(raw.emergency_contact)
    ? raw.emergency_contact
    : [];

  const familyMembers = (raw.familyMembers || raw.family_members || []).map((m: any) => ({
    relation: m.relation || "",
    lastName: m.lastName || m.last_name || "",
    firstName: m.firstName || m.first_name || "",
    birthYear: String(m.birthYear ?? m.birth_year ?? ""),
    age: m.age ? String(m.age) : undefined,
    occupation: m.occupation || "",
    workplaceSchool: m.workplaceSchool || m.workplace_school || "",
    phone: m.phone || "",
    registerNumber: m.registerNumber || m.register_number || "",
  }));

  const educationHistory = (raw.educationHistory || raw.education_history || []).map((e: any) => ({
    schoolName: e.schoolName || e.school_name || "",
    schoolType: e.schoolType || e.school_type || "",
    degree: e.degree || "",
    major: e.major || "",
    entryYear: String(e.entryYear ?? e.entry_year ?? ""),
    graduationYear: String(e.graduationYear ?? e.graduation_year ?? ""),
    gpa: e.gpa || "",
  }));

  const workExperience = (raw.workExperience || raw.work_experience || []).map((w: any) => ({
    companyName: w.companyName || w.company_name || "",
    position: w.position || "",
    startDate: w.startDate || w.start_date || "",
    endDate: w.endDate || w.end_date || "",
    salary: w.salary || "",
    reasonForLeaving: w.reasonForLeaving || w.reason_for_leaving || "",
    referencePerson: w.referencePerson || w.reference_person || "",
  }));

  const extendedRelatives = (raw.extendedRelatives || raw.extended_relatives || []).map((r: any) => ({
    relation: r.relation || "",
    fullName: r.fullName || r.full_name || "",
    occupation: r.occupation || "",
    workplace: r.workplace || "",
    contactInfo: r.contactInfo || r.contact_info || "",
  }));

  const referencePersons = (raw.referencePersons || raw.reference_persons || []).map((p: any) => ({
    fullName: p.fullName || p.full_name || "",
    occupation: p.occupation || "",
    workplace: p.workplace || "",
    contactInfo: p.contactInfo || p.contact_info || "",
  }));

  const languageSkills = raw.languageSkills || raw.skills?.language_matrix || raw.skills?.languageMatrix || [];
  const pcSkills = raw.pcSkills || raw.skills?.pc_matrix || raw.skills?.pcMatrix || {
    windows: "none",
    msOffice: "none",
    adobe: "none",
    others: "none",
  };

  return {
    applyingFor: raw.applyingFor || raw.applying_for || "",
    surname: raw.surname || "",
    lastName: raw.lastName || raw.last_name || "",
    firstName: raw.firstName || raw.first_name || "",
    gender: raw.gender || "",
    birthYear,
    birthMonth,
    birthDay,
    birthPlace: raw.birthPlace || raw.birth_place || "",
    registerNumber: String(raw.registerNumber || raw.register_number || "").toUpperCase().trim(),
    maritalStatus: raw.maritalStatus || raw.marital_status || "",
    email: raw.email || "",
    facebookUrl: raw.facebookUrl || raw.facebook_url || "",
    addressCurrent: raw.addressCurrent || raw.address_current || "",
    addressTemp: raw.addressTemp || raw.temp_address || "",
    phoneHome: raw.phoneHome || raw.phone_home || "",
    phoneMobile: raw.phoneMobile || raw.phone_mobile || raw.phone || "",
    phoneWork: raw.phoneWork || raw.phone_work || "",
    unemploymentReason: raw.unemploymentReason || raw.unemployment_reason || "",
    emergencyContacts,
    internalReferral: Boolean(raw.internalReferral ?? raw.internal_referral),
    internalReferralDetails: raw.internalReferralDetails || raw.internal_referral_details || "",
    familyMembers,
    educationHistory,
    workExperience,
    languageSkills,
    pcSkills,
    photoUrl: raw.photoUrl || raw.photo_url || "",
    diplomaUrl: raw.diplomaUrl || raw.diploma_url || "",
    idCardUrl: raw.idCardUrl || raw.id_card_url || "",
    videoUrl: raw.videoUrl || raw.video_url || "",
    healthInfo: raw.healthInfo || raw.health_info || { illnesses: "", badHabits: "" },
    extendedRelatives,
    referencePersons,
    futureGoals: raw.futureGoals || raw.future_goals || "",
    referralSource: raw.referralSource || raw.referral_source || "",
    referralSourceDetails: raw.referralSourceDetails || raw.referral_source_details || "",
    additionalDetails: raw.additionalDetails || raw.additional_details || "",
    criminalRecord: Boolean(raw.criminalRecord ?? raw.criminal_record),
    criminalRecordDetails: raw.criminalRecordDetails || raw.criminal_record_details || "",
    desiredSalary: raw.desiredSalary || raw.desired_salary || "",
    availableDate: raw.availableDate || raw.available_date || "",
    strengths: raw.strengths || "",
    weaknesses: raw.weaknesses || "",
    hobbies: raw.hobbies || "",
    militaryStatus: raw.militaryStatus || raw.military_status || "",
    driverLicense: Array.isArray(raw.driverLicense ?? raw.driver_license)
      ? raw.driverLicense ?? raw.driver_license
      : [],
    termsAccepted: Boolean(raw.termsAccepted ?? true),
    truckDetails: raw.truckDetails || raw.truck_details || "",
    proLicenseUrl: raw.proLicenseUrl || raw.pro_license_url || "",
    truckPhotos: Array.isArray(raw.truckPhotos ?? raw.truck_photos)
      ? raw.truckPhotos ?? raw.truck_photos
      : [],
  };
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const normalized = normalizeIncomingApplication(raw);

    const parsed = applicationSchema.safeParse(normalized);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        {
          error: firstIssue?.message || "Маягтын мэдээлэл дутуу эсвэл буруу байна",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const birthDateString = `${data.birthYear}-${data.birthMonth.padStart(2, "0")}-${data.birthDay.padStart(2, "0")}`;

    const created = await prisma.application.create({
      data: {
        surname: data.surname,
        lastName: data.lastName,
        firstName: data.firstName,
        registerNumber: data.registerNumber,
        birthDate: birthDateString,
        birthYear: data.birthYear,
        birthPlace: data.birthPlace,
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        email: data.email || "",
        facebookUrl: data.facebookUrl || "",
        phone: data.phoneMobile,
        phoneMobile: data.phoneMobile,
        phoneHome: data.phoneHome || "",
        phoneWork: data.phoneWork || "",
        addressCurrent: data.addressCurrent,
        addressTemp: data.addressTemp || "",
        applyingFor: data.applyingFor,
        photoUrl: data.photoUrl || "",
        idCardUrl: data.idCardUrl || "",
        diplomaUrl: data.diplomaUrl || "",
        proLicenseUrl: data.proLicenseUrl || "",
        videoUrl: data.videoUrl || "",
        truckDetails: data.truckDetails || "",
        truckPhotos: data.truckPhotos?.length ? data.truckPhotos : undefined,
        healthInfo: data.healthInfo,
        criminalRecord: data.criminalRecord,
        criminalRecordDetails: data.criminalRecordDetails || "",
        militaryStatus: data.militaryStatus || "",
        driverLicense: data.driverLicense?.length ? data.driverLicense : undefined,
        additionalDetails: data.additionalDetails || "",
        desiredSalary: data.desiredSalary,
        availableDate: data.availableDate,
        futureGoals: data.futureGoals,
        strengths: data.strengths || "",
        weaknesses: data.weaknesses || "",
        referralSource: data.referralSource,
        referralSourceDetails: data.referralSourceDetails || "",
        internalReferral: data.internalReferral,
        internalReferralDetails: data.internalReferralDetails || "",
        unemploymentReason: data.unemploymentReason || "",
        hobbies: data.hobbies || "",
        emergencyContact: data.emergencyContacts,
        status: "pending",

        familyMembers: data.familyMembers.length
          ? {
              create: data.familyMembers.map((m) => ({
                relation: m.relation,
                lastName: m.lastName,
                firstName: m.firstName,
                birthYear: String(m.birthYear),
                occupation: m.occupation,
                workplaceSchool: m.workplaceSchool || "",
                phone: m.phone,
                registerNumber: m.registerNumber || "",
              })),
            }
          : undefined,

        educationHistory: data.educationHistory.length
          ? {
              create: data.educationHistory.map((e) => ({
                schoolName: e.schoolName,
                schoolType: e.schoolType || "",
                degree: e.degree,
                major: e.major,
                entryYear: String(e.entryYear),
                graduationYear: String(e.graduationYear),
                gpa: e.gpa || "",
              })),
            }
          : undefined,

        workExperience: data.workExperience.length
          ? {
              create: data.workExperience.map((w) => ({
                companyName: w.companyName,
                position: w.position,
                startDate: w.startDate,
                endDate: w.endDate,
                salary: w.salary || "",
                reasonForLeaving: w.reasonForLeaving || "",
                referencePerson: w.referencePerson || "",
              })),
            }
          : undefined,

        skills: {
          create: {
            languageMatrix: data.languageSkills,
            pcMatrix: data.pcSkills,
          },
        },

        extendedRelatives: data.extendedRelatives.length
          ? {
              create: data.extendedRelatives.map((r) => ({
                relation: r.relation,
                fullName: r.fullName,
                occupation: r.occupation,
                workplace: r.workplace,
                contactInfo: r.contactInfo,
              })),
            }
          : undefined,

        referencePersons: data.referencePersons.length
          ? {
              create: data.referencePersons.map((p) => ({
                fullName: p.fullName,
                occupation: p.occupation,
                workplace: p.workplace,
                contactInfo: p.contactInfo,
              })),
            }
          : undefined,
      },
      include: {
        familyMembers: true,
        educationHistory: true,
        workExperience: true,
        skills: true,
        extendedRelatives: true,
        referencePersons: true,
      },
    });

    try {
      await createNotification(
        "Шинэ ажилд орох анкет ирлээ",
        `${created.firstName} ${created.lastName} — ${created.applyingFor || "Ажилд орох"}`,
        "info",
        `/admin/applications/${created.id}`
      );
    } catch (notifErr) {
      console.error("Failed to push notification:", notifErr);
    }

    const receiptToken = createReceiptToken(created.id);

    return NextResponse.json({
      success: true,
      data: formatApplication(created),
      id: created.id,
      receiptToken,
    });
  } catch (error: any) {
    console.error("POST /api/anket/applications error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
