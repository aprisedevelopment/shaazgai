import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    const jobs = await prisma.jobPosition.findMany({
      where: all ? {} : { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    const formatted = jobs.map(j => ({
      ...j,
      is_driver_job: j.title?.toLowerCase().includes("жолооч") || j.title?.toLowerCase().includes("түгээлт"),
      employment_type: j.employmentType,
      salary_range: j.salaryRange,
      image_url: j.imageUrl,
      is_active: j.isActive,
      created_at: j.createdAt,
      updated_at: j.updatedAt,
    }));

    return NextResponse.json({ data: formatted });
  } catch (error: any) {
    console.error("GET /api/anket/jobs error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const created = await prisma.jobPosition.create({
      data: {
        title: data.title,
        department: data.department || "Түгээлт / Логистик",
        location: data.location || "Улаанбаатар",
        employmentType: data.employmentType || data.employment_type || "Бүтэн цаг",
        salaryRange: data.salaryRange || data.salary_range || "",
        description: data.description || "",
        responsibilities: data.responsibilities || "",
        requirements: data.requirements || "",
        benefits: data.benefits || "",
        imageUrl: data.imageUrl || data.image_url || "",
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error("POST /api/anket/jobs error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
