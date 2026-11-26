import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { formatJobPosition, requireAdmin } from "@/lib/anket-server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const job = await prisma.jobPosition.findUnique({
      where: { id },
    });

    if (!job) {
      return NextResponse.json({ error: "Ажлын байр олдсонгүй" }, { status: 404 });
    }

    if (!job.isActive) {
      const admin = await requireAdmin();
      if (!admin) {
        return NextResponse.json({ error: "Ажлын байр олдсонгүй" }, { status: 404 });
      }
    }

    return NextResponse.json({ data: formatJobPosition(job) });
  } catch (error: any) {
    console.error("GET /api/anket/jobs/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Зөвшөөрөлгүй хандалт" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();

    if (data.title !== undefined && !String(data.title).trim()) {
      return NextResponse.json({ error: "Ажлын байрны нэр хоосон байж болохгүй" }, { status: 400 });
    }

    const isDriverJobInput =
      data.isDriverJob !== undefined
        ? Boolean(data.isDriverJob)
        : data.is_driver_job !== undefined
        ? Boolean(data.is_driver_job)
        : undefined;

    const isActiveInput =
      data.isActive !== undefined
        ? Boolean(data.isActive)
        : data.is_active !== undefined
        ? Boolean(data.is_active)
        : undefined;

    const updated = await prisma.jobPosition.update({
      where: { id },
      data: {
        title: data.title !== undefined ? String(data.title).trim() : undefined,
        department: data.department,
        location: data.location,
        employmentType: data.employmentType ?? data.employment_type,
        salaryRange: data.salaryRange ?? data.salary_range,
        description: data.description,
        responsibilities: data.responsibilities,
        requirements: data.requirements,
        benefits: data.benefits,
        imageUrl: data.imageUrl ?? data.image_url,
        isDriverJob: isDriverJobInput,
        isActive: isActiveInput,
      },
    });

    return NextResponse.json({ success: true, data: formatJobPosition(updated) });
  } catch (error: any) {
    console.error("PATCH /api/anket/jobs/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Зөвшөөрөлгүй хандалт" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.jobPosition.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/anket/jobs/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
