// ==========================================
// QPay Payment Integration
// ==========================================

const QPAY_API = process.env.QPAY_API_URL!
const QPAY_USER = process.env.QPAY_USERNAME!
const QPAY_PASS = process.env.QPAY_PASSWORD!
const QPAY_MERCHANT = process.env.QPAY_MERCHANT_CODE!
const QPAY_VERIFY = process.env.QPAY_MERCHANT_VERIFICATION!
const QPAY_INVOICE = process.env.QPAY_INVOICE_CODE!

async function qpayRequest(endpoint: string, body: string) {
  const auth = Buffer.from(`${QPAY_USER}:${QPAY_PASS}`).toString('base64')
  const res = await fetch(`${QPAY_API}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body,
  })
  return res.json()
}

export async function qpayCreateInvoice(orderId: number, amount: number) {
  const date = new Date().toISOString().replace('T', ' ').substring(0, 23) + '.' + Math.floor(Math.random() * 900 + 100)
  const body = JSON.stringify({
    type: '4',
    merchant_code: QPAY_MERCHANT,
    merchant_verification_code: QPAY_VERIFY,
    merchant_customer_code: String(orderId),
    json_data: {
      operator_code: null,
      invoice_code: QPAY_INVOICE,
      merchant_branch_code: '1',
      merchant_invoice_number: String(orderId),
      invoice_date: date,
      invoice_description: `Бараа захиалга ${orderId}`,
      invoice_total_amount: String(amount),
      item_btuk_code: '5654454',
      vat_flag: '0',
    },
  })
  return qpayRequest('qPay_genInvoiceSimple', body)
}

export async function qpayCheckPayment(orderId: number) {
  const body = JSON.stringify({
    type: '2',
    merchant_code: QPAY_MERCHANT,
    merchant_verification_code: QPAY_VERIFY,
    json_data: {
      lang_code: 'MON',
      operator_code: null,
      invoice_code: QPAY_INVOICE,
      merchant_invoice_number: String(orderId),
    },
  })
  return qpayRequest('qPay_checkInvoicePayment2', body)
}
