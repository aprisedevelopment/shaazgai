import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { formatJobPosition, requireAdmin } from "@/lib/anket-server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    if (all) {
      const admin = await requireAdmin();
      if (!admin) {
        return NextResponse.json({ error: "Зөвшөөрөлгүй хандалт" }, { status: 401 });
      }
    }

    const jobs = await prisma.jobPosition.findMany({
      where: all ? {} : { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    let countMap: Record<string, number> = {};
    if (all && jobs.length > 0) {
      const grouped = await prisma.application.groupBy({
        by: ["applyingFor"],
        _count: { _all: true },
      });
      countMap = Object.fromEntries(
        grouped.filter((g) => g.applyingFor).map((g) => [g.applyingFor as string, g._count._all])
      );
    }

    const formatted = jobs.map((j) => formatJobPosition(j, countMap[j.title] || 0));

    return NextResponse.json({ data: formatted });
  } catch (error: any) {
    console.error("GET /api/anket/jobs error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Зөвшөөрөлгүй хандалт" }, { status: 401 });
    }

    const data = await req.json();
    const title = String(data.title || "").trim();
    if (!title) {
      return NextResponse.json({ error: "Ажлын байрны нэр шаардлагатай" }, { status: 400 });
    }

    const created = await prisma.jobPosition.create({
      data: {
        title,
        department: String(data.department || "Түгээлт / Логистик").trim(),
        location: String(data.location || "Улаанбаатар").trim(),
        employmentType: data.employmentType || data.employment_type || "Бүтэн цаг",
        salaryRange: data.salaryRange || data.salary_range || "",
        description: data.description || "",
        responsibilities: data.responsibilities || "",
        requirements: data.requirements || "",
        benefits: data.benefits || "",
        imageUrl: data.imageUrl || data.image_url || "",
        isDriverJob: Boolean(data.isDriverJob ?? data.is_driver_job ?? false),
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : data.is_active !== undefined ? Boolean(data.is_active) : true,
      },
    });

    return NextResponse.json({ success: true, data: formatJobPosition(created) });
  } catch (error: any) {
    console.error("POST /api/anket/jobs error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
