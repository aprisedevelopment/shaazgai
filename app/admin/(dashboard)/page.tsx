import { prisma } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [totalOrders, newOrders, totalUsers, totalProducts, totalApps, pendingApps, recentApps] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { tolov: "0" } }),
    prisma.user.count(),
    prisma.product.count(),
    prisma.application.count(),
    prisma.application.count({ where: { status: "pending" } }),
    prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ])

  const recentOrders = await prisma.order.findMany({
    orderBy: { id: 'desc' },
    take: 5
  })

  return (
    <>
      <div className="admin-stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
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
        <div className="stat-card">
          <div className="stat-card-value" style={{ color: '#2563eb' }}>{totalApps}</div>
          <div className="stat-card-label">Ирсэн анкет</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value" style={{ color: '#d97706' }}>{pendingApps}</div>
          <div className="stat-card-label">Хүлээгдэж буй анкет</div>
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
                <td><Link href={`/admin/orders/${o.id}`} style={{ fontWeight: 700, color: 'var(--primary)', textDecoration: 'underline' }}>#{o.id}</Link></td>
                <td>{o.ognoo} {o.tsag}</td>
                <td><span style={{ fontWeight: 600 }}>{o.ner || '-'}</span></td>
                <td>{o.utas1 || '-'}</td>
                <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{o.niitdun ? formatPrice(Number(o.niitdun)) : '-'}</td>
                <td>
                  <span className={`badge ${Number(o.tolov) === 1 ? 'badge-success' : Number(o.tolov) === 2 ? 'badge-danger' : 'badge-warning'}`}>
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

      <div className="box" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Сүүлд ирсэн анкетууд</h2>
          <Link href="/admin/applications" className="btn btn-outline btn-sm">Бүх анкет харах</Link>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Огноо</th>
              <th>Овог нэр</th>
              <th>Сонирхсон ажил</th>
              <th>Утас</th>
              <th>Төлөв</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recentApps.map((a) => (
              <tr key={a.id}>
                <td>
                  <Link href={`/admin/applications/${a.id}`} style={{ fontWeight: 700, color: 'var(--primary)', textDecoration: 'underline' }}>
                    #{a.id.slice(0, 8)}
                  </Link>
                </td>
                <td>{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '—'}</td>
                <td><span style={{ fontWeight: 600 }}>{a.lastName} {a.firstName}</span></td>
                <td><span style={{ color: '#2563eb', fontWeight: 600 }}>{a.applyingFor}</span></td>
                <td>{a.phone}</td>
                <td>
                  <span className={`badge ${a.status === 'accepted' ? 'badge-success' : a.status === 'rejected' ? 'badge-danger' : a.status === 'reviewed' ? 'badge-info' : 'badge-warning'}`}>
                    {a.status === 'accepted' ? 'Зөвшөөрсөн' : a.status === 'rejected' ? 'Татгалзсан' : a.status === 'reviewed' ? 'Хянагдсан' : 'Хүлээгдэж буй'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <Link href={`/admin/applications/${a.id}`} className="btn btn-outline btn-sm" style={{ padding: '4px 10px', fontSize: 11 }}>
                    Харах
                  </Link>
                </td>
              </tr>
            ))}
            {recentApps.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                  Одоогоор ирсэн анкет алга байна
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
