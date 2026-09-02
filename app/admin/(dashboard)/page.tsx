import { prisma } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [totalOrders, newOrders, totalUsers, totalProducts] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { tolov: "0" } }),
    prisma.user.count(),
    prisma.product.count()
  ])

  const recentOrders = await prisma.order.findMany({
    orderBy: { id: 'desc' },
    take: 5
  })

  return (
    <>
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-card-value">{totalOrders}</div>
          <div className="stat-card-label">Нийт захиалга</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value" style={{ color: 'var(--danger)' }}>{newOrders}</div>
          <div className="stat-card-label">Шинэ захиалга</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value" style={{ color: 'var(--success)' }}>{totalProducts}</div>
          <div className="stat-card-label">Нийт бараа</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value" style={{ color: 'var(--accent)' }}>{totalUsers}</div>
          <div className="stat-card-label">Хэрэглэгчид</div>
        </div>
      </div>

      <div className="box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Сүүлийн захиалгууд</h2>
          <Link href="/admin/orders" className="btn btn-outline btn-sm">Бүгдийг харах</Link>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Огноо</th>
              <th>Хэрэглэгч</th>
              <th>Утас</th>
              <th>Дүн</th>
              <th>Төлөв</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o.id}>
                <td><b>#{o.id}</b></td>
                <td>{o.ognoo} {o.tsag}</td>
                <td>{o.ner}</td>
                <td>{o.utas1}</td>
                <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{o.niitdun ? formatPrice(Number(o.niitdun)) : '-'}</td>
                <td>
                  <span style={{ fontSize: 11, background: Number(o.tolov) === 1 ? 'var(--success)' : Number(o.tolov) === 2 ? 'var(--danger)' : 'var(--warning)', color: Number(o.tolov) === 1 || Number(o.tolov) === 2 ? '#fff' : '#000', padding: '3px 8px', borderRadius: 10 }}>
                    {Number(o.tolov) === 1 ? 'Хүргэгдсэн' : Number(o.tolov) === 2 ? 'Цуцлагдсан' : 'Хүлээгдэж буй'}
                  </span>
                </td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Захиалга олдсонгүй</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
