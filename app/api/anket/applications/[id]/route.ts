import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  formatApplication,
  isValidApplicationStatus,
  requireAdmin,
  verifyReceiptToken,
} from "@/lib/anket-server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const admin = await requireAdmin();
    const token = req.nextUrl.searchParams.get("token");

    if (!admin && !verifyReceiptToken(id, token)) {
      return NextResponse.json({ error: "Зөвшөөрөлгүй хандалт" }, { status: 401 });
    }

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

    return NextResponse.json({ data: formatApplication(app) });
  } catch (error: any) {
    console.error("GET /api/anket/applications/[id] error:", error);
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
    const body = await req.json();

    if (body.status !== undefined && !isValidApplicationStatus(body.status)) {
      return NextResponse.json({ error: "Буруу төлөв байна" }, { status: 400 });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: body.status !== undefined ? body.status : undefined,
        desiredSalary: body.desiredSalary !== undefined ? body.desiredSalary : undefined,
        applyingFor: body.applyingFor !== undefined ? body.applyingFor : undefined,
        adminNotes: body.adminNotes !== undefined ? body.adminNotes : undefined,
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
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Зөвшөөрөлгүй хандалт" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.application.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/anket/applications/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
