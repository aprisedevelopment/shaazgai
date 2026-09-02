import { prisma } from '@/lib/db'

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { id: 'desc' }
  })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Баннер удирдлага</h1>
        <button className="btn btn-primary">+ Баннер нэмэх</button>
      </div>

      <div className="box" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>ID</th>
              <th style={{ width: 120 }}>Зураг</th>
              <th>Нэр / Гарчиг</th>
              <th>Холбоос</th>
              <th>Төлөв</th>
              <th style={{ width: 100 }}>Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>
                  <div style={{ width: 100, height: 50, borderRadius: 6, overflow: 'hidden', background: 'var(--bg-section)' }}>
                    {b.image ? (
                      <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL || 'https://tugeelt.mn/uploads'}/banners/${b.image}`} alt={b.title || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : null}
                  </div>
                </td>
                <td><b>{b.title || '-'}</b></td>
                <td>{b.holboos || '-'}</td>
                <td>
                  {b.publish === 1 ? (
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
            {banners.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Баннер олдсонгүй</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
