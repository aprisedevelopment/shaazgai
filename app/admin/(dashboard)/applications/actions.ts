"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { isValidApplicationStatus, requireAdmin } from "@/lib/anket-server";

export async function updateApplicationStatus(id: string, newStatus: string) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return { success: false, error: "Зөвшөөрөлгүй үйлдэл" };
    }

    if (!isValidApplicationStatus(newStatus)) {
      return { success: false, error: "Буруу төлөв байна" };
    }

    await prisma.application.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${id}`);

    return { success: true };
  } catch (err: any) {
    console.error("updateApplicationStatus error:", err);
    return { success: false, error: err.message };
  }
}

export async function updateApplicationNotes(id: string, adminNotes: string) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return { success: false, error: "Зөвшөөрөлгүй үйлдэл" };
    }

    await prisma.application.update({
      where: { id },
      data: { adminNotes },
    });

    revalidatePath(`/admin/applications/${id}`);
    return { success: true };
  } catch (err: any) {
    console.error("updateApplicationNotes error:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteApplication(id: string) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return { success: false, error: "Зөвшөөрөлгүй үйлдэл" };
    }

    await prisma.application.delete({ where: { id } });

    revalidatePath("/admin/applications");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    console.error("deleteApplication error:", err);
    return { success: false, error: err.message };
  }
}
