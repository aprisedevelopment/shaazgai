import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createNotification } from "@/app/admin/notificationActions";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const status = searchParams.get("status");
    const position = searchParams.get("position");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;
    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }
    if (position && position !== "all") {
      where.applyingFor = position;
    }
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { registerNumber: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
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

    // Format fields so existing components expecting snake_case or counts work seamlessly
    const formatted = applications.map((app) => ({
      ...app,
      last_name: app.lastName,
      first_name: app.firstName,
      register_number: app.registerNumber,
      birth_date: app.birthDate,
      birth_year: app.birthYear,
      birth_place: app.birthPlace,
      marital_status: app.maritalStatus,
      phone_mobile: app.phoneMobile,
      phone_home: app.phoneHome,
      phone_work: app.phoneWork,
      address_current: app.addressCurrent,
      temp_address: app.addressTemp,
      applying_for: app.applyingFor,
      photo_url: app.photoUrl,
      id_card_url: app.idCardUrl,
      diploma_url: app.diplomaUrl,
      pro_license_url: app.proLicenseUrl,
      video_url: app.videoUrl,
      truck_details: app.truckDetails,
      truck_photos: app.truckPhotos,
      health_info: app.healthInfo,
      criminal_record: app.criminalRecord,
      military_status: app.militaryStatus,
      desired_salary: app.desiredSalary,
      available_date: app.availableDate,
      future_goals: app.futureGoals,
      family_count: app.familyMembers?.length || 0,
      education_count: app.educationHistory?.length || 0,
      work_count: app.workExperience?.length || 0,
      created_at: app.createdAt ? app.createdAt.toISOString() : null,
      updated_at: app.updatedAt ? app.updatedAt.toISOString() : null,
    }));

    return NextResponse.json({
      data: formatted,
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

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const created = await prisma.application.create({
      data: {
        id: data.id || undefined,
        surname: data.surname || "",
        lastName: data.lastName || data.last_name || "",
        firstName: data.firstName || data.first_name || "",
        registerNumber: data.registerNumber || data.register_number || "",
        birthDate: data.birthDate || data.birth_date || "",
        birthYear: data.birthYear || data.birth_year || "",
        birthPlace: data.birthPlace || data.birth_place || "",
        gender: data.gender || "",
        maritalStatus: data.maritalStatus || data.marital_status || "",
        email: data.email || "",
        facebookUrl: data.facebookUrl || data.facebook_url || "",
        phone: data.phoneMobile || data.phone || "",
        phoneMobile: data.phoneMobile || data.phone_mobile || "",
        phoneHome: data.phoneHome || data.phone_home || "",
        phoneWork: data.phoneWork || data.phone_work || "",
        addressCurrent: data.addressCurrent || data.address_current || "",
        addressTemp: data.addressTemp || data.temp_address || "",
        applyingFor: data.applyingFor || data.applying_for || "",
        photoUrl: data.photoUrl || data.photo_url || "",
        idCardUrl: data.idCardUrl || data.id_card_url || "",
        diplomaUrl: data.diplomaUrl || data.diploma_url || "",
        proLicenseUrl: data.proLicenseUrl || data.pro_license_url || "",
        videoUrl: data.videoUrl || data.video_url || "",
        truckDetails: data.truckDetails || data.truck_details || "",
        truckPhotos: data.truckPhotos || undefined,
        healthInfo: data.healthInfo || undefined,
        criminalRecord: !!data.criminalRecord,
        criminalRecordDetails: data.criminalRecordDetails || "",
        militaryStatus: data.militaryStatus || "",
        desiredSalary: data.desiredSalary || data.desired_salary || "",
        availableDate: data.availableDate || data.available_date || "",
        futureGoals: data.futureGoals || data.future_goals || "",
        strengths: data.strengths || "",
        weaknesses: data.weaknesses || "",
        referralSource: data.referralSource || data.referral_source || "",
        referralSourceDetails: data.referralSourceDetails || "",
        internalReferral: !!data.internalReferral,
        internalReferralDetails: data.internalReferralDetails || "",
        unemploymentReason: data.unemploymentReason || "",
        hobbies: data.hobbies || "",
        emergencyContact: data.emergencyContacts || data.emergency_contact || undefined,
        status: "pending",

        // Nested relations creation
        familyMembers: data.familyMembers?.length ? {
          create: data.familyMembers.map((m: any) => ({
            relation: m.relation || "",
            lastName: m.lastName || m.last_name || "",
            firstName: m.firstName || m.first_name || "",
            birthYear: String(m.birthYear || m.birth_year || ""),
            occupation: m.occupation || "",
            workplaceSchool: m.workplaceSchool || m.workplace_school || "",
            phone: m.phone || "",
            registerNumber: m.registerNumber || m.register_number || "",
          }))
        } : undefined,

        educationHistory: data.educationHistory?.length ? {
          create: data.educationHistory.map((e: any) => ({
            schoolName: e.schoolName || e.school_name || "",
            schoolType: e.schoolType || e.school_type || "",
            degree: e.degree || "",
            major: e.major || "",
            entryYear: String(e.entryYear || e.entry_year || ""),
            graduationYear: String(e.graduationYear || e.graduation_year || ""),
            gpa: e.gpa || "",
          }))
        } : undefined,

        workExperience: data.workExperience?.length ? {
          create: data.workExperience.map((w: any) => ({
            companyName: w.companyName || w.company_name || "",
            position: w.position || "",
            startDate: w.startDate || w.start_date || "",
            endDate: w.endDate || w.end_date || "",
            salary: w.salary || "",
            reasonForLeaving: w.reasonForLeaving || w.reason_for_leaving || "",
          }))
        } : undefined,

        skills: (data.languageSkills || data.pcSkills) ? {
          create: {
            languageMatrix: data.languageSkills || undefined,
            pcMatrix: data.pcSkills || undefined,
          }
        } : undefined,

        extendedRelatives: data.extendedRelatives?.length ? {
          create: data.extendedRelatives.map((r: any) => ({
            relation: r.relation || "",
            fullName: r.fullName || r.full_name || "",
            occupation: r.occupation || "",
            workplace: r.workplace || "",
            contactInfo: r.contactInfo || r.contact_info || "",
          }))
        } : undefined,

        referencePersons: data.referencePersons?.length ? {
          create: data.referencePersons.map((p: any) => ({
            fullName: p.fullName || p.full_name || "",
            occupation: p.occupation || "",
            workplace: p.workplace || "",
            contactInfo: p.contactInfo || p.contact_info || "",
          }))
        } : undefined,
      },
      include: {
        familyMembers: true,
        educationHistory: true,
        workExperience: true,
        skills: true,
      }
    });

    // Send real-time notification to Admin NotificationCenter
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

    return NextResponse.json({
      success: true,
      data: created,
      id: created.id,
    });
  } catch (error: any) {
    console.error("POST /api/anket/applications error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
