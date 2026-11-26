import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createReceiptToken } from "@/lib/anket-server";

export async function POST(req: NextRequest) {
  try {
    const { phone, register_number } = await req.json();
    const cleanPhone = String(phone || "").replace(/[\s-]/g, "").trim();
    const cleanReg = String(register_number || "").trim();

    if (!cleanPhone || !cleanReg) {
      return NextResponse.json(
        { error: "Утасны дугаар болон регистрийн дугаараа хоёуланг нь оруулна уу" },
        { status: 400 }
      );
    }

    const applications = await prisma.application.findMany({
      where: {
        registerNumber: { equals: cleanReg, mode: "insensitive" },
        OR: [
          { phone: cleanPhone },
          { phoneMobile: cleanPhone },
        ],
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        applyingFor: true,
        status: true,
        createdAt: true,
        photoUrl: true,
      },
    });

    if (applications.length === 0) {
      return NextResponse.json(
        { error: "Ийм мэдээлэлтэй анкет олдсонгүй. Утас болон регистрийн дугаараа шалгана уу." },
        { status: 404 }
      );
    }

    const formatted = applications.map((app) => ({
      id: app.id,
      first_name: app.firstName,
      last_name: app.lastName,
      applying_for: app.applyingFor,
      status: app.status,
      created_at: app.createdAt ? app.createdAt.toISOString() : null,
      photo_url: app.photoUrl || "",
      receipt_token: createReceiptToken(app.id),
    }));

    return NextResponse.json({ data: formatted });
  } catch (error: any) {
    console.error("POST /api/anket/track error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
