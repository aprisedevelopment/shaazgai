import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const job = await prisma.jobPosition.findUnique({
      where: { id },
    });

    if (!job) {
      return NextResponse.json({ error: "Ажлын байр олдсонгүй" }, { status: 404 });
    }

    const formatted = {
      ...job,
      is_driver_job: job.title?.toLowerCase().includes("жолооч") || job.title?.toLowerCase().includes("түгээлт"),
      employment_type: job.employmentType,
      salary_range: job.salaryRange,
      image_url: job.imageUrl,
      is_active: job.isActive,
    };

    return NextResponse.json({ data: formatted });
  } catch (error: any) {
    console.error("GET /api/anket/jobs/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();

    const updated = await prisma.jobPosition.update({
      where: { id },
      data: {
        title: data.title,
        department: data.department,
        location: data.location,
        employmentType: data.employmentType || data.employment_type,
        salaryRange: data.salaryRange || data.salary_range,
        description: data.description,
        responsibilities: data.responsibilities,
        requirements: data.requirements,
        benefits: data.benefits,
        imageUrl: data.imageUrl || data.image_url,
        isActive: data.isActive !== undefined ? data.isActive : data.is_active,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("PATCH /api/anket/jobs/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.jobPosition.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/anket/jobs/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
