"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function updateApplicationStatus(id: string, newStatus: string) {
  try {
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
