'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createNotification } from './notificationActions'

export async function updateOrderStatus(orderId: number, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { tolov: status }
    })
    
    // Restore stock if cancelled
    if (status === '2') {
      const orderDetails = await prisma.orderDetail.findMany({ where: { zid: orderId } })
      for (const item of orderDetails) {
        if (item.bid) {
          const product = await prisma.product.findUnique({ where: { id: item.bid } })
          if (product) {
            await prisma.product.update({
              where: { id: product.id },
              data: {
                uldegdel: product.uldegdel + (item.hed || 1),
                duussan: 0 // In case it was out of stock
              }
            })
          }
        }
      }
    }
    
    let tolovNer = status === '1' ? 'Хүргэгдсэн' : status === '2' ? 'Цуцлагдсан' : 'Хүлээгдэж буй'
    await createNotification(
      'Төлөв өөрчлөгдлөө', 
      `#${orderId} дугаартай захиалгын төлөв "${tolovNer}" болж өөрчлөгдлөө`,
      status === '1' ? 'success' : status === '2' ? 'error' : 'info',
      `/admin/orders/${orderId}`
    )
    
    revalidatePath('/admin/orders')
    revalidatePath('/admin/products')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Төлөв өөрчлөхөд алдаа гарлаа' }
  }
}

export async function updateOrderPayment(orderId: number, paymentStatus: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { tolbor_tolson: paymentStatus } // "yes" or "no"
    })
    revalidatePath('/admin/orders')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Төлбөрийн төлөв өөрчлөхөд алдаа гарлаа' }
  }
}

export async function updateOrderDriver(orderId: number, driverId: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { ajiltan: driverId }
    })
    revalidatePath('/admin/orders')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Ажилтан өөрчлөхөд алдаа гарлаа' }
  }
}

export async function toggleProductFlag(productId: number, field: 'publish' | 'duussan' | 'ontsloh', value: number) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { [field]: value }
    })
    revalidatePath('/admin/products')
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

export async function updateProductStock(productId: number, stock: number) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { 
        uldegdel: stock,
        duussan: stock <= 0 ? 1 : 0 
      }
    })
    revalidatePath('/admin/products')
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

export async function bulkUpdateProducts(productIds: number[], actionType: 'delete' | 'publish' | 'unpublish' | 'feature' | 'category', value?: string) {
  try {
    if (actionType === 'delete') {
      await prisma.product.deleteMany({
        where: { id: { in: productIds } }
      })
    } else if (actionType === 'publish') {
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { publish: 1 }
      })
    } else if (actionType === 'unpublish') {
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { publish: 0 }
      })
    } else if (actionType === 'feature') {
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { ontsloh: 1 }
      })
    } else if (actionType === 'category' && value) {
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { catvars: `-${value}-` }
      })
    }
    
    revalidatePath('/admin/products')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Үйлдэл хийхэд алдаа гарлаа' }
  }
}

// Category Actions
export async function createCategory(formData: FormData) {
  try {
    const title = formData.get('title') as string
    const cat = Number(formData.get('cat')) || 0
    const list_order = Number(formData.get('list_order')) || 0

    if (!title) return { success: false, error: 'Ангиллын нэр оруулна уу' }

    await prisma.category.create({
      data: {
        title,
        cat,
        list_order,
        publish: 1,
      }
    })
    revalidatePath('/admin/categories')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Ангилал үүсгэхэд алдаа гарлаа' }
  }
}

export async function deleteCategory(id: number) {
  try {
    await prisma.category.delete({ where: { id } })
    revalidatePath('/admin/categories')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Ангилал устгахад алдаа гарлаа' }
  }
}

export async function toggleCategoryPublish(id: number, publish: number) {
  try {
    await prisma.category.update({
      where: { id },
      data: { publish }
    })
    revalidatePath('/admin/categories')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Ангиллын төлөв өөрчлөхөд алдаа гарлаа' }
  }
}

// Banner Actions
export async function createBanner(formData: FormData) {
  try {
    const title = formData.get('title') as string
    const holboos = formData.get('holboos') as string
    const image = formData.get('image') as string

    await prisma.banner.create({
      data: {
        title,
        holboos,
        image,
        publish: 1,
        cat: 1,
      }
    })
    revalidatePath('/admin/banners')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Баннер нэмэхэд алдаа гарлаа' }
  }
}

export async function deleteBanner(id: number) {
  try {
    await prisma.banner.delete({ where: { id } })
    revalidatePath('/admin/banners')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Баннер устгахад алдаа гарлаа' }
  }
}

export async function toggleBannerPublish(id: number, publish: number) {
  try {
    await prisma.banner.update({
      where: { id },
      data: { publish }
    })
    revalidatePath('/admin/banners')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Баннерын төлөв өөрчлөхөд алдаа гарлаа' }
  }
}

// Page Actions
export async function createPageAction(formData: FormData) {
  try {
    const title = formData.get('title') as string
    const purl = formData.get('purl') as string
    const body = formData.get('body') as string

    if (!title || !purl) return { success: false, error: 'Гарчиг болон URL оруулна уу' }

    await prisma.page.create({
      data: {
        title,
        purl,
        body,
        publish: 1,
      }
    })
    revalidatePath('/admin/pages')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Хуудас үүсгэхэд алдаа гарлаа' }
  }
}

export async function deletePageAction(id: number) {
  try {
    await prisma.page.delete({ where: { id } })
    revalidatePath('/admin/pages')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Хуудас устгахад алдаа гарлаа' }
  }
}

