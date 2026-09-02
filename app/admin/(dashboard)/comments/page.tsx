import { prisma } from '@/lib/db'

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { id: 'desc' },
    include: {
      product: true,
      user: true
    }
  })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Сэтгэгдэл</h1>
      </div>

      <div className="box" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>ID</th>
              <th>Огноо</th>
              <th>Хэрэглэгч</th>
              <th>Бараа</th>
              <th>Сэтгэгдэл</th>
              <th style={{ width: 100 }}>Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{new Date(c.ognoo * 1000).toLocaleString('mn-MN')}</td>
                <td>{c.ner || c.user?.ner || '-'}</td>
                <td><a href={`/p/${c.product?.kod}`} target="_blank" style={{ color: 'var(--primary)' }}>{c.product?.title}</a></td>
                <td style={{ maxWidth: 300, whiteSpace: 'normal' }}>{c.comment}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <form action={async () => {
                      'use server'
                      const { revalidatePath } = await import('next/cache')
                      await prisma.comment.delete({ where: { id: c.id } })
                      revalidatePath('/admin/comments')
                    }}>
                      <button type="submit" className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', color: 'var(--danger)' }}>Устгах</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {comments.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Сэтгэгдэл олдсонгүй</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
