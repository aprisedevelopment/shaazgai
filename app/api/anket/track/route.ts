import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { phone, register_number } = await req.json();

    if (!phone && !register_number) {
      return NextResponse.json({ error: "Утасны дугаар эсвэл регистрийн дугаараа оруулна уу" }, { status: 400 });
    }

    const where: any = {};
    if (phone) {
      where.phone = { contains: phone.trim() };
    }
    if (register_number) {
      where.registerNumber = { contains: register_number.trim(), mode: "insensitive" };
    }

    const applications = await prisma.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        applyingFor: true,
        status: true,
        createdAt: true,
        registerNumber: true,
        phone: true,
      },
    });

    const formatted = applications.map(app => ({
      id: app.id,
      first_name: app.firstName,
      last_name: app.lastName,
      applying_for: app.applyingFor,
      status: app.status,
      created_at: app.createdAt,
      register_number: app.registerNumber,
      phone: app.phone,
    }));

    return NextResponse.json({ data: formatted });
  } catch (error: any) {
    console.error("POST /api/anket/track error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
