import { prisma } from '@/lib/db'

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({
    orderBy: { list_order: 'asc' }
  })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Хуудсууд</h1>
        <button className="btn btn-primary">+ Хуудас үүсгэх</button>
      </div>

      <div className="box" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>ID</th>
              <th>Гарчиг</th>
              <th>Холбоос (URL)</th>
              <th>Төлөв</th>
              <th style={{ width: 100 }}>Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td><b>{p.title}</b></td>
                <td><a href={`/page/${p.purl}`} target="_blank" style={{ color: 'var(--primary)' }}>/page/{p.purl}</a></td>
                <td>
                  {p.publish === 1 ? (
                    <span style={{ color: 'var(--success)' }}>Идэвхтэй</span>
                  ) : (
                    <span style={{ color: 'var(--text-light)' }}>Идэвхгүй</span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', color: 'var(--primary)' }}>✎</button>
                    <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', color: 'var(--danger)' }}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Хуудас олдсонгүй</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
