import { prisma } from '@/lib/db'
import { formatPrice } from '@/lib/utils'

export default async function AdminPaymentsPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
  const { page, q } = await searchParams
  const currentPage = Number(page) || 1
  const perPage = 20

  const where: any = {}
  if (q) {
    where.OR = [
      { invoice_id: { contains: q } },
      { dugaar: Number(q) || undefined }
    ]
  }

  const [logs, total] = await Promise.all([
    prisma.qpayLog.findMany({
      where,
      orderBy: { id: 'desc' },
      skip: (currentPage - 1) * perPage,
      take: perPage,
    }),
    prisma.qpayLog.count({ where })
  ])

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Төлбөр тооцоо (QPay)</h1>
        <form style={{ display: 'flex', gap: 8 }}>
          <input type="text" name="q" defaultValue={q} placeholder="Нэхэмжлэх, Захиалгын ID..." className="form-control" style={{ width: 250 }} />
          <button type="submit" className="btn btn-primary">Хайх</button>
        </form>
      </div>

      <div className="box" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>ID</th>
              <th>Огноо</th>
              <th>Захиалгын ID</th>
              <th>Нэхэмжлэхийн дугаар</th>
              <th>Дүн</th>
              <th>Төлөв</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.ognoo > 0 ? new Date(l.ognoo * 1000).toLocaleString('mn-MN') : l.ognoo2 || '-'}</td>
                <td><b>#{l.dugaar}</b></td>
                <td>{l.invoice_id || '-'}</td>
                <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{formatPrice(l.dun)}</td>
                <td>
                  {l.tolov === 1 ? (
                    <span style={{ color: 'var(--success)' }}>Төлсөн</span>
                  ) : l.tolov === 2 ? (
                    <span style={{ color: 'var(--danger)' }}>Цуцлагдсан</span>
                  ) : (
                    <span style={{ color: 'var(--warning)' }}>Хүлээгдэж буй</span>
                  )}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Гүйлгээ олдсонгүй</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
        {Array.from({ length: Math.ceil(total / perPage) }).map((_, i) => (
          <a key={i} href={`?page=${i + 1}${q ? `&q=${q}` : ''}`} className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}>
            {i + 1}
          </a>
        ))}
      </div>
    </>
  )
}
