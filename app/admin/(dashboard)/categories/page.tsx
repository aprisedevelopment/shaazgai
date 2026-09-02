import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { list_order: 'asc' }
  })

  const mainCategories = categories.filter(c => c.cat === 0)
  const subCategories = categories.filter(c => c.cat !== 0)

  const sortedList: any[] = []
  mainCategories.forEach(main => {
    sortedList.push({ ...main, isSub: false })
    subCategories.filter(sub => sub.cat === main.id).forEach(sub => {
      sortedList.push({ ...sub, isSub: true })
    })
  })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Ангилал</h1>
        <button className="btn btn-primary">+ Ангилал нэмэх</button>
      </div>

      <div className="box" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>ID</th>
              <th>Нэр</th>
              <th>Төлөв</th>
              <th>Дараалал</th>
              <th style={{ width: 100 }}>Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {sortedList.map((c) => (
              <tr key={c.id} style={{ background: c.isSub ? 'rgba(0,0,0,0.02)' : 'transparent' }}>
                <td><span style={{ opacity: c.isSub ? 0.6 : 1 }}>{c.id}</span></td>
                <td style={{ paddingLeft: c.isSub ? 32 : 16 }}>
                  {c.isSub ? (
                    <span><span style={{ color: 'var(--text-muted)', marginRight: 6 }}>↳</span> {c.title}</span>
                  ) : (
                    <b>{c.title}</b>
                  )}
                </td>
                <td>
                  {c.publish === 1 ? (
                    <span style={{ color: 'var(--success)' }}>Идэвхтэй</span>
                  ) : (
                    <span style={{ color: 'var(--text-light)' }}>Идэвхгүй</span>
                  )}
                </td>
                <td>{c.list_order}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', color: 'var(--primary)' }}>✎</button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Ангилал олдсонгүй</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
