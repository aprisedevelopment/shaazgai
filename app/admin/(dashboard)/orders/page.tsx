import { prisma } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { OrderActions } from './OrderActions'
import { OrdersHeader } from './OrdersHeader'
import { OrderQuickView } from './OrderQuickView'

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; status?: string; start?: string; end?: string; payment?: string }> }) {
  const { page, q, status, start, end, payment } = await searchParams
  const currentPage = Number(page) || 1
  const perPage = 20

  const where: any = {}
  if (q) {
    const qNum = Number(q)
    where.OR = [
      { ner: { contains: q, mode: 'insensitive' } },
      { utas1: { contains: q } },
      ...(isNaN(qNum) ? [] : [{ id: qNum }, { zid: qNum }])
    ]
  }
  if (status) {
    where.tolov = String(status)
  }
  if (payment) {
    where.tolbor_helber = String(payment)
  }
  if (start || end) {
    // ognoo is string like "2023-10-10"
    where.ognoo = {}
    if (start) where.ognoo.gte = start
    if (end) where.ognoo.lte = end
  }

  const [orders, total, drivers] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { id: 'desc' },
      skip: (currentPage - 1) * perPage,
      take: perPage,
    }),
    prisma.order.count({ where }),
    prisma.user.findMany({
      where: { ajiltan: 1 },
      select: { id: true, ner: true }
    })
  ])

  return (
    <>
      <OrdersHeader params={{ q, status, start, end, payment }} />

      <div className="box" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Огноо</th>
              <th>Харилцагч</th>
              <th>Хаяг</th>
              <th>Төлбөр</th>
              <th>Дүн</th>
              <th style={{ width: 220 }}>Удирдлага</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td><OrderQuickView order={o} /></td>
                <td>{o.ognoo} {o.tsag}</td>
                <td>
                  <div><b>{o.ner}</b></div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{o.utas1} {o.utas2 ? `/ ${o.utas2}` : ''}</div>
                </td>
                <td style={{ maxWidth: 200 }}><div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.hayag}</div></td>
                <td>
                  <div style={{ fontWeight: 600 }}>{o.tolbor_helber === '1' ? 'Бэлнээр' : o.tolbor_helber === '2' ? 'Дансаар' : o.tolbor_helber === '4' ? 'QPay' : o.tolbor_helber === '8' ? 'LendMN' : 'Карт'}</div>
                </td>
                <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{o.niitdun ? formatPrice(Number(o.niitdun)) : '-'}</td>
                <td>
                  <OrderActions order={o} drivers={drivers} />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Захиалга олдсонгүй</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
        {Array.from({ length: Math.ceil(total / perPage) }).map((_, i) => (
          <a key={i} href={`?page=${i + 1}${q ? `&q=${q}` : ''}${status ? `&status=${status}` : ''}`} className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}>
            {i + 1}
          </a>
        ))}
      </div>
    </>
  )
}
