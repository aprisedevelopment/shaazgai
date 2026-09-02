// ==========================================
// HiPay Payment Integration
// ==========================================

const HIPAY_CHECKOUT = process.env.HIPAY_CHECKOUT_URL!
const HIPAY_BEARER = process.env.HIPAY_BEARER!
const HIPAY_ENTITY = process.env.HIPAY_ENTITY_ID!
const HIPAY_PAYMENT = process.env.HIPAY_PAYMENT_URL!

export async function hipayCreateCheckout(amount: number): Promise<{ checkoutId: string; requestId: string } | null> {
  const body = new URLSearchParams({
    entityId: HIPAY_ENTITY,
    amount: Number(amount).toFixed(2),
    currency: 'MNT',
  })
  try {
    const res = await fetch(HIPAY_CHECKOUT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HIPAY_BEARER}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })
    const data = await res.json()
    if (data.checkoutId && data.requestId) return data
    return null
  } catch {
    return null
  }
}

export function hipayPaymentUrl(checkoutId: string, callbackUrl: string, cancelUrl: string) {
  return `${HIPAY_PAYMENT}?checkoutId=${checkoutId}&shopperResultUrl=${encodeURIComponent(callbackUrl)}&shopperCancelUrl=${encodeURIComponent(cancelUrl)}`
}

// ==========================================
// LendMN Payment Integration
// ==========================================

const LENDMN_API = process.env.LENDMN_API_URL!
const LENDMN_TOKEN = process.env.LENDMN_AUTH_TOKEN!

export async function lendmnCreateInvoice(orderId: number, amount: number) {
  try {
    const body = new URLSearchParams({
      amount: String(amount),
      description: `Бараа захиалга #${orderId}`,
      duration: '1000',
      trackingData: String(orderId),
    })
    const res = await fetch(LENDMN_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-and-auth-token': LENDMN_TOKEN,
      },
      body: body.toString(),
    })
    const data = await res.json()
    return {
      code: data.code,
      invoiceNumber: data.response?.invoiceNumber,
      qrString: data.response?.qr_string,
      qrLink: data.response?.qr_link,
      errorDescription: data.response?.error_description,
    }
  } catch {
    return null
  }
}

export async function lendmnCheckPayment(invoiceId: string) {
  try {
    const res = await fetch(`${LENDMN_API}/${invoiceId}/check`, {
      headers: { 'x-and-auth-token': LENDMN_TOKEN },
    })
    const data = await res.json()
    return data
  } catch {
    return null
  }
}

// ==========================================
// Golomt / SocialPay Integration
// ==========================================

export function golomtFormData(orderId: number, amount: number, isSocialPay = false) {
  const keyNumber = process.env.GOLOMT_KEY_NUMBER!
  return {
    key_number: keyNumber,
    trans_number: String(orderId),
    trans_amount: String(amount),
    lang_ind: '0',
    subID: '1',
    ...(isSocialPay ? { social: '1' } : {}),
  }
}

export const GOLOMT_FORM_URL = 'https://m.egolomt.mn/billingnew/cardinfo.aspx'
