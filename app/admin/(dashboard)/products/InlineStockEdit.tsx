'use client'

import { useState, useTransition } from 'react'
import { updateProductStock } from '../../actions'
import toast from 'react-hot-toast'

interface InlineStockEditProps {
  productId: number
  initialStock: number
}

export function InlineStockEdit({ productId, initialStock }: InlineStockEditProps) {
  const [isPending, startTransition] = useTransition()
  const [stock, setStock] = useState((initialStock ?? 0).toString())
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    const newStock = parseInt(stock) || 0
    if (newStock === initialStock) {
      setIsEditing(false)
      return
    }

    startTransition(async () => {
      const res = await updateProductStock(productId, newStock)
      if (res.success) {
        toast.success('Үлдэгдэл шинэчлэгдлээ')
        setIsEditing(false)
      } else {
        toast.error('Үлдэгдэл хадгалахад алдаа гарлаа')
        setStock(initialStock.toString())
      }
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setStock(initialStock.toString())
      setIsEditing(false)
    }
  }

  const stockNum = parseInt(stock) || 0
  const isLowStock = stockNum > 0 && stockNum < 5

  if (isEditing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          disabled={isPending}
          autoFocus
          className="form-control"
          style={{ width: 60, height: 28, padding: '0 8px', fontSize: 13 }}
        />
        {isPending && <span style={{ fontSize: 12, color: 'var(--text-light)' }}>...</span>}
      </div>
    )
  }

  return (
    <div 
      onClick={() => setIsEditing(true)}
      style={{ 
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: 4,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: stockNum === 0 ? 'rgba(231, 76, 60, 0.1)' : isLowStock ? 'rgba(243, 156, 18, 0.1)' : 'rgba(46, 204, 113, 0.1)',
        color: stockNum === 0 ? 'var(--danger)' : isLowStock ? '#f39c12' : 'var(--success)',
        fontWeight: 600,
        fontSize: 14,
        transition: '0.2s',
        border: '1px dashed transparent'
      }}
      title="Дарж засах"
      onMouseEnter={(e) => e.currentTarget.style.border = '1px dashed currentColor'}
      onMouseLeave={(e) => e.currentTarget.style.border = '1px dashed transparent'}
    >
      {stockNum === 0 ? 'Дууссан (0)' : stockNum}
      {isLowStock && <span style={{ fontSize: 11, background: '#f39c12', color: '#fff', padding: '1px 4px', borderRadius: 4 }}>Дуусаж байна</span>}
    </div>
  )
}
