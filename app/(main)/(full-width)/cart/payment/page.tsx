'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { CheckCircle2, Copy, AlertCircle, Home, ShoppingBag, CreditCard, RefreshCw } from 'lucide-react'

function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const h = searchParams.get('h')
  const zid = searchParams.get('zid')

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!h || !zid) {
      router.push('/')
      return
    }

    const initPayment = async () => {
      try {
        const res = await fetch('/api/payment/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ h: Number(h), zid: Number(zid) }),
        })
        const result = await res.json()
        if (result.success) {
          if (result.redirectUrl) {
            window.location.href = result.redirectUrl
          } else {
            setData(result)
          }
        } else {
          setError(result.error || 'Төлбөр үүсгэхэд алдаа гарлаа')
        }
      } catch (e) {
        setError('Сүлжээний алдаа')
      } finally {
        setLoading(false)
      }
    }

    initPayment()
  }, [h, zid, router])

  const copyAccount = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-16 text-center max-w-lg mx-auto animate-in fade-in">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <h3 className="text-lg font-bold text-slate-800">Төлбөрийн мэдээлэл бэлтгэж байна...</h3>
      <p className="text-sm text-slate-500 mt-1">Түр хүлээнэ үү</p>
    </div>
  )

  if (error) return (
    <div className="bg-white rounded-2xl border border-rose-200 shadow-sm p-12 text-center max-w-md mx-auto">
      <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">Алдаа гарлаа</h3>
      <p className="text-sm text-rose-600 mb-6 bg-rose-50 p-3 rounded-xl border border-rose-100">{error}</p>
      <div className="flex gap-3 justify-center">
        <Link href="/" className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
          Нүүр хуудас
        </Link>
        <Link href="/user/orders" className="px-5 py-2.5 rounded-xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 shadow-sm transition-all">
          Миний захиалгууд
        </Link>
      </div>
    </div>
  )

  const showBankDetails = h === '2' || data?.isFallbackToBank

  if (h === '1' || showBankDetails) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 sm:p-12 text-center max-w-2xl mx-auto animate-in fade-in">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-100 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">Захиалга амжилттай бүртгэгдлээ</h2>
        <p className="text-slate-500 text-sm mb-6">
          Таны захиалгын дугаар: <span className="font-mono font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md text-base">{data?.orderCode || zid}</span>
        </p>

        {data?.isFallbackToBank && data?.message && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-left text-xs sm:text-sm mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Анхааруулга:</div>
              <div>{data.message}</div>
            </div>
          </div>
        )}

        {showBankDetails && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left mb-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h4 className="font-black text-slate-800 text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                Шилжүүлэг хийх дансны мэдээлэл
              </h4>
              <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-bold">Хаан банк</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Хүлээн авагч банк:</span>
                <span className="font-bold text-slate-800">Хаан Банк</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Дансны дугаар:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-slate-900 text-base">5059103999</span>
                  <button
                    onClick={() => copyAccount('5059103999')}
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-all text-xs flex items-center gap-1"
                    title="Хуулах"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Хуулагдлаа' : 'Хуулах'}</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Хүлээн авагчийн нэр:</span>
                <span className="font-bold text-slate-800">Т.Өлзийбаяр</span>
              </div>

              <div className="flex justify-between items-center py-1 bg-amber-50/80 p-2.5 rounded-xl border border-amber-100">
                <span className="text-amber-800 font-bold text-xs uppercase">Гүйлгээний утга:</span>
                <span className="font-mono font-black text-amber-900 text-sm">
                  {data?.orderCode || zid}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-200 text-base">
                <span className="text-slate-700 font-bold">Нийт төлөх дүн:</span>
                <span className="font-black text-emerald-600 text-xl font-mono">
                  {formatPrice(data?.amount || 0)}
                </span>
              </div>
            </div>

            <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-3 text-xs text-blue-800">
              💡 <b>Санамж:</b> Шилжүүлэг хийхдээ гүйлгээний утга дээр захиалгын дугаар <b>{data?.orderCode || zid}</b> болон өөрийн утасны дугаараа заавал бичнэ үү! Төлбөр баталгаажмагц таны захиалга бэлтгэгдэж хүргэгдэнэ.
            </div>
          </div>
        )}

        {h === '1' && !data?.isFallbackToBank && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center mb-8">
            <p className="text-emerald-800 font-bold text-base">
              Та захиалсан бараагаа хүлээн авахдаа хүргэлтийн ажилтанд бэлнээр төлбөрөө хийнэ үү.
            </p>
            <p className="text-xs text-emerald-600 mt-2">
              Хүргэлт хийгдэх үед манай ажилтан тантай утсаар холбогдох болно.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 bg-[#0f2b5c] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all text-sm">
            <Home className="w-4 h-4" />
            Нүүр хуудас руу буцах
          </Link>
          <Link href="/user/orders" className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-8 rounded-xl transition-all text-sm">
            <ShoppingBag className="w-4 h-4" />
            Миний захиалгууд
          </Link>
        </div>
      </div>
    )
  }

  if (h === '4' || h === '8') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 max-w-md mx-auto text-center animate-in fade-in">
        <h2 className="text-2xl font-black text-slate-800 mb-1">Төлбөр төлөх</h2>
        <p className="text-slate-500 text-sm mb-6">
          Захиалгын дугаар: <span className="font-mono font-bold text-blue-600">{data?.orderCode || zid}</span>
        </p>
        
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/90 inline-block mb-6 shadow-inner">
          <div className="w-64 h-64 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm border border-slate-100">
            {data?.qrCode ? (
              <img src={`data:image/png;base64,${data.qrCode}`} alt="QR Code" className="w-full h-full object-contain" />
            ) : data?.qrImage ? (
              <img src={data.qrImage} alt="QR Code" className="w-full h-full object-contain" />
            ) : (
              <div className="text-xs text-slate-400">QR код бэлтгэж байна...</div>
            )}
          </div>
        </div>
        
        <div className="text-2xl font-mono font-black text-emerald-600 mb-4">
          {formatPrice(data?.amount || 0)}
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-4 py-2 rounded-full border border-amber-200 mb-6">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          Төлбөр төлөлт хүлээгдэж байна...
        </div>
        
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          Та банкны аппликейшнээ нээн дээрх QR кодыг уншуулж төлбөрөө баталгаажуулна уу.
        </p>

        <button 
          onClick={() => window.location.reload()} 
          className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Төлбөр шалгах
        </button>
      </div>
    )
  }

  return null
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-16 text-center max-w-lg mx-auto">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 font-medium text-sm">Ачааллаж байна...</p>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  )
}
