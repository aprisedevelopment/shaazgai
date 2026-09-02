import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { qpayCreateInvoice } from '@/lib/payment/qpay'
import { hipayCreateCheckout, hipayPaymentUrl, lendmnCreateInvoice, golomtFormData, GOLOMT_FORM_URL } from '@/lib/payment/other'
import { generateOrderCode } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const { h, zid } = await req.json()
    const orderId = Number(zid)
    const methodId = Number(h)

    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) return NextResponse.json({ success: false, error: 'Захиалга олдсонгүй' })

    const amount = Number(order.niitdun || 0)
    const orderCode = generateOrderCode(orderId)

    // Бэлэн (1), Данс (2) - Төлбөр тооцооны хуудас руу шууд үсрэнэ.
    if (methodId === 1 || methodId === 2) {
      return NextResponse.json({ success: true, orderCode, amount })
    }

    // QPay (4)
    if (methodId === 4) {
      const qpayRes = await qpayCreateInvoice(orderId, amount)
      if (qpayRes?.result_code === '0' && qpayRes.json_data) {
        return NextResponse.json({
          success: true,
          orderCode,
          amount,
          invoiceId: qpayRes.json_data.invoice_id,
          qrCode: qpayRes.json_data.qPay_QRimage,
        })
      }
      return NextResponse.json({ success: false, error: 'QPay нэхэмжлэх үүсгэхэд алдаа гарлаа' })
    }

    // LendMN (8)
    if (methodId === 8) {
      const lendRes = await lendmnCreateInvoice(orderId, amount)
      if (lendRes?.code === 0 && lendRes.qrString) {
        return NextResponse.json({
          success: true,
          orderCode,
          amount,
          invoiceId: lendRes.invoiceNumber,
          qrImage: lendRes.qrString,
        })
      }
      return NextResponse.json({ success: false, error: lendRes?.errorDescription || 'LendMN нэхэмжлэх үүсгэхэд алдаа гарлаа' })
    }

    // HiPay (7)
    if (methodId === 7) {
      const hipayRes = await hipayCreateCheckout(amount)
      if (hipayRes?.checkoutId) {
        const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/callback/hipay?zid=${orderId}`
        const redirectUrl = hipayPaymentUrl(hipayRes.checkoutId, callbackUrl, callbackUrl)
        return NextResponse.json({ success: true, redirectUrl })
      }
      return NextResponse.json({ success: false, error: 'HiPay системтэй холбогдоход алдаа гарлаа' })
    }

    // Golomt / SocialPay (5, 6)
    if (methodId === 5 || methodId === 6) {
      const isSocialPay = methodId === 6
      const formData = golomtFormData(orderId, amount, isSocialPay)
      
      // Auto-submit form through a special intermediate page (we send it to the client to render form and submit)
      const formHtml = `
        <html><body onload="document.forms[0].submit()">
          <form method="POST" action="${GOLOMT_FORM_URL}">
            <input type="hidden" name="key_number" value="${formData.key_number}" />
            <input type="hidden" name="trans_number" value="${formData.trans_number}" />
            <input type="hidden" name="trans_amount" value="${formData.trans_amount}" />
            <input type="hidden" name="lang_ind" value="${formData.lang_ind}" />
            <input type="hidden" name="subID" value="${formData.subID}" />
            ${isSocialPay ? '<input type="hidden" name="social" value="1" />' : ''}
          </form>
          <p>Төлбөрийн хуудас руу шилжиж байна...</p>
        </body></html>
      `
      return NextResponse.json({ success: true, redirectUrl: `data:text/html;base64,${Buffer.from(formHtml).toString('base64')}` })
    }

    return NextResponse.json({ success: false, error: 'Тодорхойгүй төлбөрийн систем' })
  } catch (error) {
    console.error('Payment init error:', error)
    return NextResponse.json({ success: false, error: 'Системийн алдаа' }, { status: 500 })
  }
}
