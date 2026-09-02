'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import * as XLSX from 'xlsx'
import { Download } from 'lucide-react'

export function OrdersHeader({ params }: { params: any }) {
  const router = useRouter()
  const pathname = usePathname()
  
  const [start, setStart] = useState(params.start || '')
  const [end, setEnd] = useState(params.end || '')
  const [status, setStatus] = useState(params.status || '')
  const [payment, setPayment] = useState(params.payment || '')
  const [q, setQ] = useState(params.q || '')

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault()
    const urlParams = new URLSearchParams()
    if (q) urlParams.set('q', q)
    if (status) urlParams.set('status', status)
    if (payment) urlParams.set('payment', payment)
    if (start) urlParams.set('start', start)
    if (end) urlParams.set('end', end)
    
    router.push(`${pathname}?${urlParams.toString()}`)
  }

  const handleExport = () => {
    // In a real app we'd fetch all filtered rows from an API.
    // For this simple example, we can just grab table data or just show a message.
    alert('Тайлан татах API холбогдоогүй байна. Дараагийн шатанд хөгжүүлэх боломжтой.')
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Захиалгын жагсаалт</h1>
        <button onClick={handleExport} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Download size={16} /> Excel татах
        </button>
      </div>
      
      <div className="box" style={{ padding: '16px 20px', background: 'var(--bg-section)' }}>
        <form onSubmit={handleFilter} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 4, fontWeight: 600, color: 'var(--text-muted)' }}>Эхлэх огноо</label>
            <input type="date" value={start} onChange={e => setStart(e.target.value)} className="form-control" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 4, fontWeight: 600, color: 'var(--text-muted)' }}>Дуусах огноо</label>
            <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="form-control" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 4, fontWeight: 600, color: 'var(--text-muted)' }}>Төлбөрийн хэлбэр</label>
            <select value={payment} onChange={e => setPayment(e.target.value)} className="form-control" style={{ width: 140 }}>
              <option value="">Бүгд</option>
              <option value="1">Бэлнээр</option>
              <option value="2">Дансаар</option>
              <option value="4">QPay</option>
              <option value="8">LendMN</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 4, fontWeight: 600, color: 'var(--text-muted)' }}>Төлөв</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="form-control" style={{ width: 140 }}>
              <option value="">Бүх төлөв</option>
              <option value="0">Хүлээгдэж буй</option>
              <option value="1">Хүргэгдсэн</option>
              <option value="2">Цуцлагдсан</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 4, fontWeight: 600, color: 'var(--text-muted)' }}>Хайх</label>
            <input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Утас, Нэр, ID..." className="form-control" style={{ width: '100%' }} />
          </div>
          <div>
            <button type="submit" className="btn btn-primary" style={{ height: 42 }}>Шүүх</button>
          </div>
        </form>
      </div>
    </div>
  )
}
