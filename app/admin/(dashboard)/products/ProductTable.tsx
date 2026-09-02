'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { ProductStatusToggles } from './ProductStatusToggles'
import { InlineStockEdit } from './InlineStockEdit'
import { bulkUpdateProducts } from '../../actions'
import toast from 'react-hot-toast'

interface ProductTableProps {
  products: any[]
  categories: any[]
}

export function ProductTable({ products, categories }: ProductTableProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [isPending, startTransition] = useTransition()

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(products.map(p => p.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleBulkAction = (action: 'delete' | 'publish' | 'unpublish' | 'feature' | 'category', value?: string) => {
    if (action === 'delete') {
      if (!confirm('Сонгосон бараануудыг устгах уу? Энэ үйлдлийг буцаах боломжгүй!')) return
    }

    startTransition(async () => {
      const res = await bulkUpdateProducts(selectedIds, action, value)
      if (res.success) {
        toast.success('Амжилттай өөрчиллөө')
        setSelectedIds([]) // clear selection after success
      } else {
        toast.error('Алдаа гарлаа')
      }
    })
  }

  return (
    <>
      <div className="box" style={{ padding: 0, position: 'relative' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40, textAlign: 'center' }}>
                <input 
                  type="checkbox" 
                  checked={products.length > 0 && selectedIds.length === products.length}
                  onChange={handleSelectAll}
                  style={{ cursor: 'pointer', width: 16, height: 16 }}
                />
              </th>
              <th style={{ width: 64 }}>Зураг</th>
              <th>Барааны нэр</th>
              <th>Код</th>
              <th>Үнэ</th>
              <th style={{ width: 100 }}>Үлдэгдэл</th>
              <th style={{ width: 120 }}>Хандалт</th>
              <th style={{ width: 130 }}>Төлөв</th>
              <th style={{ width: 100 }}>Үйлдэл</th>
            </tr>
          </thead>
          <tbody style={{ opacity: isPending ? 0.6 : 1, transition: '0.2s' }}>
            {products.map((p) => (
              <tr key={p.id} style={{ background: selectedIds.includes(p.id) ? 'rgba(52, 152, 219, 0.05)' : '' }}>
                <td style={{ textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(p.id)}
                    onChange={() => handleSelect(p.id)}
                    style={{ cursor: 'pointer', width: 16, height: 16 }}
                  />
                </td>
                <td>
                  <div style={{ width: 40, height: 40, borderRadius: 6, overflow: 'hidden', background: 'var(--bg-section)' }}>
                    {p.image ? (
                      <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/baraa/small/${p.image}`} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : null}
                  </div>
                </td>
                <td>
                  <b>{p.title}</b>
                  <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>
                    {categories.filter(c => p.catvars?.includes(`-${c.id}-`)).map(c => c.title).join(', ')}
                  </div>
                </td>
                <td>{p.kod}</td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{formatPrice(p.une)}</div>
                  {p.unehuuchin > p.une && <div style={{ fontSize: 12, textDecoration: 'line-through', color: 'var(--text-light)' }}>{formatPrice(p.unehuuchin)}</div>}
                </td>
                <td>
                  <InlineStockEdit productId={p.id} initialStock={p.uldegdel} />
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} title="Сэтгэгдэл">
                      💬 {p.comments || 0}
                    </div>
                  </div>
                </td>
                <td>
                  <ProductStatusToggles product={{ id: p.id, publish: p.publish, duussan: p.duussan, ontsloh: p.ontsloh }} />
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link href={`/p/${p.kod}`} target="_blank" className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }}>👁️</Link>
                    <Link href={`/admin/products/${p.id}`} className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', color: 'var(--primary)' }}>✎</Link>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-light)' }}>
                  Бараа олдсонгүй
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Action Bar */}
      {selectedIds.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--bg-box)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          borderRadius: 12,
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          zIndex: 100,
          border: '1px solid var(--border)'
        }}>
          <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: 15 }}>
            <span style={{ background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: 12, marginRight: 8 }}>{selectedIds.length}</span>
            бараа сонгогдлоо
          </div>
          
          <div style={{ width: 1, height: 24, background: 'var(--border)' }}></div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <select 
              className="form-control" 
              style={{ width: 180, height: 36 }}
              onChange={(e) => {
                if(e.target.value) {
                  handleBulkAction('category', e.target.value)
                  e.target.value = '' // reset select
                }
              }}
            >
              <option value="">Ангилал руу зөөх...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.isSub ? `— ${c.title}` : c.title}
                </option>
              ))}
            </select>

            <button onClick={() => handleBulkAction('publish')} className="btn btn-sm btn-outline" style={{ height: 36 }} disabled={isPending}>Нээх</button>
            <button onClick={() => handleBulkAction('unpublish')} className="btn btn-sm btn-outline" style={{ height: 36 }} disabled={isPending}>Хаах</button>
            <button onClick={() => handleBulkAction('feature')} className="btn btn-sm btn-outline" style={{ height: 36 }} disabled={isPending}>Онцлох</button>
            
            <button onClick={() => handleBulkAction('delete')} className="btn btn-sm" style={{ height: 36, background: 'rgba(231, 76, 60, 0.1)', color: 'var(--danger)', border: 'none' }} disabled={isPending}>
              Устгах
            </button>
          </div>
        </div>
      )}
    </>
  )
}
