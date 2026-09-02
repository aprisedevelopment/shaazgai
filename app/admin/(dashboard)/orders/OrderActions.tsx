'use client'

import { useState } from 'react'
import { updateOrderStatus, updateOrderPayment, updateOrderDriver } from '../../actions'
import toast from 'react-hot-toast'

interface OrderActionsProps {
  order: any;
  drivers: any[];
}

export function OrderActions({ order, drivers }: OrderActionsProps) {
  const [status, setStatus] = useState(order.tolov || '0')
  const [payment, setPayment] = useState(order.tolbor_tolson || 'no')
  const [driver, setDriver] = useState(order.ajiltan || '0')
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    setStatus(newStatus)
    setIsLoading(true)
    const res = await updateOrderStatus(order.id, newStatus)
    if (res.success) {
      toast.success('Төлөв шинэчлэгдлээ')
    } else {
      toast.error(res.error || 'Алдаа гарлаа')
    }
    setIsLoading(false)
  }

  const handlePaymentChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPayment = e.target.value
    setPayment(newPayment)
    setIsLoading(true)
    const res = await updateOrderPayment(order.id, newPayment)
    if (res.success) {
      toast.success('Төлбөрийн төлөв шинэчлэгдлээ')
    } else {
      toast.error(res.error || 'Алдаа гарлаа')
    }
    setIsLoading(false)
  }

  const handleDriverChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDriver = e.target.value
    setDriver(newDriver)
    setIsLoading(true)
    const res = await updateOrderDriver(order.id, newDriver)
    if (res.success) {
      toast.success('Ажилтан шинэчлэгдлээ')
    } else {
      toast.error(res.error || 'Алдаа гарлаа')
    }
    setIsLoading(false)
  }

  return (
    <div style={{ display: 'flex', gap: 8, opacity: isLoading ? 0.6 : 1, pointerEvents: isLoading ? 'none' : 'auto', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <select 
          value={status}
          onChange={handleStatusChange}
          style={{ 
            padding: '4px 24px 4px 12px', 
            fontSize: 12, 
            height: 28, 
            background: status === '1' ? 'var(--success)' : status === '2' ? 'var(--danger)' : 'var(--warning)', 
            color: status === '1' || status === '2' ? '#fff' : '#000', 
            border: 'none',
            borderRadius: 20,
            cursor: 'pointer',
            outline: 'none',
            flexShrink: 0
          }}
        >
          <option value="0">Хүлээгдэж буй</option>
          <option value="1">Хүргэгдсэн</option>
          <option value="2">Цуцлагдсан</option>
        </select>

        <select 
          value={payment}
          onChange={handlePaymentChange}
          style={{ 
            padding: '4px 24px 4px 12px', 
            fontSize: 12, 
            height: 28, 
            background: payment === 'yes' ? 'rgba(46, 213, 115, 0.15)' : 'rgba(255, 71, 87, 0.15)', 
            color: payment === 'yes' ? 'var(--success)' : 'var(--danger)', 
            border: `1px solid ${payment === 'yes' ? 'var(--success)' : 'var(--danger)'}`,
            borderRadius: 20,
            cursor: 'pointer',
            outline: 'none',
            flexShrink: 0
          }}
        >
          <option value="no">Төлөөгүй</option>
          <option value="yes">Төлсөн</option>
        </select>
      </div>

      <select 
        value={driver}
        onChange={handleDriverChange}
        className="form-control" 
        style={{ padding: '4px 8px', fontSize: 12, height: 'auto' }}
      >
        <option value="0">Ажилтан томилоогүй</option>
        {drivers.map(d => (
          <option key={d.id} value={String(d.id)}>{d.ner}</option>
        ))}
      </select>
    </div>
  )
}
