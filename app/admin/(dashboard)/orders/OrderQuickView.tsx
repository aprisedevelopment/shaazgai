'use client'

import { useState } from 'react'
import { X, Eye } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

export function OrderQuickView({ order }: { order: any }) {
  const [isOpen, setIsOpen] = useState(false)

  // Wait, we need order details for quick view.
  // The list query currently doesn't fetch `details`.
  // It's better if `OrderQuickView` fetches the details via an API or server action when opened.
  return (
    <>
      <button onClick={() => setIsOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold' }}>
        #{order.id}
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 400, background: '#fff', boxShadow: '-4px 0 15px rgba(0,0,0,0.1)', zIndex: 9999, padding: 24, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>Захиалга #{order.id}</h2>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={24} color="#000" />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            <div><span style={{ color: 'var(--text-muted)' }}>Нэр:</span> <b>{order.ner}</b></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Утас:</span> <b>{order.utas1} {order.utas2 ? `/ ${order.utas2}` : ''}</b></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Огноо:</span> {order.ognoo} {order.tsag}</div>
            <div><span style={{ color: 'var(--text-muted)' }}>Хаяг:</span> <br/>{order.hayag}</div>
            <div><span style={{ color: 'var(--text-muted)' }}>Нийт дүн:</span> <b style={{ color: 'var(--primary)', fontSize: 16 }}>{order.niitdun ? formatPrice(Number(order.niitdun)) : '-'}</b></div>
          </div>

          <Link href={`/admin/orders/${order.id}`} className="btn btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block', marginBottom: 12 }}>
            Дэлгэрэнгүй харах
          </Link>
          <button className="btn btn-outline" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <Eye size={16} /> Баримт хэвлэх
          </button>
        </div>
      )}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9998 }} 
        />
      )}
    </>
  )
}
