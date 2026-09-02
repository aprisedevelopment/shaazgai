'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const h = searchParams.get('h')
  const zid = searchParams.get('zid')

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState('')

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

  if (loading) return (
    <div className="box text-center" style={{ padding: 64 }}>
      <div className="loader" style={{ marginBottom: 16 }} />
      <p>Төлбөрийн мэдээлэл бэлтгэж байна...</p>
    </div>
  )

  if (error) return (
    <div className="box text-center" style={{ padding: 64 }}>
      <div className="alert alert-danger" style={{ maxWidth: 400, margin: '0 auto 24px' }}>{error}</div>
      <Link href="/user/orders" className="btn btn-outline">Захиалгууд харах</Link>
    </div>
  )

  if (h === '1' || h === '2') {
    return (
      <div className="box text-center" style={{ padding: 64, maxWidth: 600, margin: '0 auto' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
        <h2 style={{ marginBottom: 16, fontWeight: 700 }}>Захиалга амжилттай бүртгэгдлээ</h2>
        <p className="text-muted" style={{ marginBottom: 24, fontSize: 15 }}>
          Таны захиалгын дугаар: <b>{data?.orderCode || zid}</b>
        </p>
        
        {h === '2' && (
          <div style={{ background: 'var(--bg-section)', padding: 24, borderRadius: 'var(--radius-lg)', textAlign: 'left', marginBottom: 24 }}>
            <h4 style={{ marginBottom: 12 }}>Дансны мэдээлэл:</h4>
            <div style={{ display: 'grid', gap: 8, fontSize: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Банк:</span><b>Хаан Банк</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Дансны дугаар:</span><b>5000000000</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Хүлээн авагч:</span><b>Түгээлт ХХК</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Гүйлгээний утга:</span><b>{data?.orderCode || zid} (Таны утасны дугаар)</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 4 }}>
                <span className="text-muted">Төлөх дүн:</span><b style={{ color: 'var(--primary)', fontSize: 16 }}>{formatPrice(data?.amount || 0)}</b>
              </div>
            </div>
            <div className="alert alert-warning" style={{ marginTop: 16, fontSize: 12.5 }}>
              Санамж: Гүйлгээний утга дээр захиалгын дугаараа заавал бичнэ үү!
            </div>
          </div>
        )}

        {h === '1' && (
          <div className="alert alert-info" style={{ marginBottom: 24 }}>
            Та төлбөрөө бараагаа хүлээн авахдаа бэлнээр төлөх боломжтой.
          </div>
        )}

        <Link href="/" className="btn btn-primary">Нүүр хуудас руу буцах</Link>
      </div>
    )
  }

  if (h === '4' || h === '8') {
    return (
      <div className="box" style={{ maxWidth: 500, margin: '0 auto' }}>
        <div className="qr-container">
          <h2 style={{ marginBottom: 8, fontWeight: 700 }}>Төлбөр төлөх</h2>
          <p className="text-muted" style={{ marginBottom: 24 }}>Захиалгын дугаар: {data?.orderCode || zid}</p>
          
          <div className="qr-image">
            {data?.qrCode ? (
              <img src={`data:image/png;base64,${data.qrCode}`} alt="QR Code" />
            ) : data?.qrImage ? (
              <img src={data.qrImage} alt="QR Code" />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>QR ачаалж байна...</div>
            )}
          </div>
          
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)', marginBottom: 20 }}>
            {formatPrice(data?.amount || 0)}
          </div>

          <div className="qr-status">
            <div className="loader" style={{ width: 16, height: 16, borderWidth: 2 }} />
            Төлбөр хүлээгдэж байна...
          </div>
          
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Та банкны аппликейшнээ нээн QR кодыг уншуулж төлбөрөө төлнө үү. Төлбөр амжилттай болсны дараа автоматаар баталгаажна.
          </p>

          <button onClick={() => window.location.reload()} className="btn btn-outline btn-block" style={{ marginTop: 24 }}>
            Төлбөр шалгах
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="box text-center" style={{ padding: 64 }}>
        <div className="loader" style={{ marginBottom: 16 }} />
        <p>Ачааллаж байна...</p>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  )
}
