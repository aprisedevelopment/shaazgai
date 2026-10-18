import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const app = await prisma.application.findUnique({
      where: { id },
      include: {
        familyMembers: true,
        educationHistory: true,
        workExperience: true,
        skills: true,
        extendedRelatives: true,
        referencePersons: true,
      },
    });

    if (!app) {
      return NextResponse.json({ error: "Анкет олдсонгүй" }, { status: 404 });
    }

    const formatted = {
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
      family_members: app.familyMembers,
      education_history: app.educationHistory,
      work_experience: app.workExperience,
      skills: app.skills,
      extended_relatives: app.extendedRelatives,
      reference_persons: app.referencePersons,
    };

    return NextResponse.json({ data: formatted });
  } catch (error: any) {
    console.error("GET /api/anket/applications/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: body.status || undefined,
        desiredSalary: body.desiredSalary || undefined,
        applyingFor: body.applyingFor || undefined,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("PATCH /api/anket/applications/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.application.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/anket/applications/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
