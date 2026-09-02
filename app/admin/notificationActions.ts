'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createNotification(title: string, message: string, type: string = 'info', link?: string) {
  try {
    await prisma.notification.create({
      data: {
        title,
        message,
        type,
        link,
      }
    })
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

export async function getNotifications() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { id: 'desc' },
      take: 20
    })
    return notifications
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function markAsRead(id: number) {
  try {
    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    })
    revalidatePath('/admin', 'layout')
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

export async function markAllAsRead() {
  try {
    await prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true }
    })
    revalidatePath('/admin', 'layout')
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
