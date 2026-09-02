'use client'

import { useState, useTransition } from 'react'
import { toggleProductFlag } from '../../actions'
import toast from 'react-hot-toast'

interface ProductTogglesProps {
  product: {
    id: number
    publish: number
    duussan: number
    ontsloh: number
  }
}

export function ProductStatusToggles({ product }: ProductTogglesProps) {
  const [isPending, startTransition] = useTransition()
  const [optimisticState, setOptimisticState] = useState({
    publish: product.publish,
    duussan: product.duussan,
    ontsloh: product.ontsloh
  })

  const handleToggle = (field: 'publish' | 'duussan' | 'ontsloh') => {
    const newValue = optimisticState[field] === 1 ? 0 : 1
    
    // Optimistic update
    setOptimisticState(prev => ({ ...prev, [field]: newValue }))
    
    startTransition(async () => {
      const res = await toggleProductFlag(product.id, field, newValue)
      if (res.success) {
        toast.success('Амжилттай өөрчиллөө')
      } else {
        toast.error('Алдаа гарлаа')
        // Revert on error
        setOptimisticState(prev => ({ ...prev, [field]: newValue === 1 ? 0 : 1 }))
      }
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
        <input 
          type="checkbox" 
          checked={optimisticState.publish === 1}
          onChange={() => handleToggle('publish')}
          disabled={isPending}
          className="toggle-switch"
        />
        <span style={{ color: optimisticState.publish === 1 ? 'var(--success)' : 'var(--text-light)' }}>
          {optimisticState.publish === 1 ? 'Идэвхтэй' : 'Идэвхгүй'}
        </span>
      </label>



      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
        <input 
          type="checkbox" 
          checked={optimisticState.ontsloh === 1}
          onChange={() => handleToggle('ontsloh')}
          disabled={isPending}
          className="toggle-switch"
        />
        <span style={{ color: optimisticState.ontsloh === 1 ? '#f39c12' : 'var(--text-light)' }}>
          Онцлох
        </span>
      </label>

      <style jsx>{`
        .toggle-switch {
          appearance: none;
          width: 32px;
          height: 18px;
          background: #e0e0e0;
          border-radius: 9px;
          position: relative;
          cursor: pointer;
          outline: none;
          transition: 0.2s;
        }
        .toggle-switch:checked {
          background: var(--primary);
        }
        .toggle-switch::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 14px;
          height: 14px;
          background: white;
          border-radius: 50%;
          transition: 0.2s;
        }
        .toggle-switch:checked::after {
          left: 16px;
        }
        .toggle-switch:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}
