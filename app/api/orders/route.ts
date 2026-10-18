import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'

export async function POST(req: Request) {
  try {
    const session = await auth()
    const body = await req.json()
    const { items, ner, utas1, utas2, ognoo, tsag, hayag, comment, tolbor_helber, noat, niitdun } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Сагс хоосон байна' }, { status: 400 })
    }

    // Determine sesid (legacy system behavior)
    let sesid = 'guest-' + Date.now()
    if (session?.user) {
      sesid = String((session.user as any).id)
    }

    const maxZid = await prisma.order.findFirst({ orderBy: { zid: 'desc' }, select: { zid: true } })
    const nextZid = (maxZid?.zid || 0) + 1

    // Create the order
    const order = await prisma.order.create({
      data: {
        zid: nextZid,
        sesid,
        ner,
        utas1,
        utas2: utas2 || '',
        ognoo,
        tsag,
        hayag,
        comment: comment || '',
        tolbor_helber: String(tolbor_helber || 1),
        noat: String(noat || 0),
        niitdun: String(niitdun),
        tolov: "0",
        tolbor_tolson: '0',
        ajiltan: "0",
        ognoo2: String(Math.floor(Date.now() / 1000))
      }
    })

    // Create order details and decrement stock
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      
      await prisma.orderDetail.create({
        data: {
          zid: order.zid,
          bid: item.productId,
          title: item.title || product?.title || '',
          kod: item.kod || product?.kod || '',
          hed: item.hed,
          une: item.une,
          songolt: item.songolt || ''
        }
      })
      
      // Decrement stock if product exists
      if (product) {
        const newUldegdel = Math.max(0, product.uldegdel - item.hed)
        await prisma.product.update({
          where: { id: item.productId },
          data: { 
            uldegdel: newUldegdel,
            duussan: newUldegdel === 0 ? 1 : 0 
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      zid: order.zid,
      orderId: order.id,
      orderCode: order.zid
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ success: false, error: 'Захиалга үүсгэхэд алдаа гарлаа' }, { status: 500 })
  }
}
