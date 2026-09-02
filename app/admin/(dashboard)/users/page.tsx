import { prisma } from '@/lib/db'

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
  const { page, q } = await searchParams
  const currentPage = Number(page) || 1
  const perPage = 20

  const where: any = {}
  if (q) {
    where.OR = [
      { ner: { contains: q } },
      { email: { contains: q } },
      { utas: { contains: q } }
    ]
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { id: 'desc' },
      skip: (currentPage - 1) * perPage,
      take: perPage,
    }),
    prisma.user.count({ where })
  ])

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Хэрэглэгчид</h1>
        <form style={{ display: 'flex', gap: 8 }}>
          <input type="text" name="q" defaultValue={q} placeholder="Нэр, И-мэйл, Утас..." className="form-control" style={{ width: 250 }} />
          <button type="submit" className="btn btn-primary">Хайх</button>
        </form>
      </div>

      <div className="box" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>ID</th>
              <th>Нэр</th>
              <th>И-мэйл</th>
              <th>Утас</th>
              <th>Хөнгөлөлт</th>
              <th>Төлөв</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td><b>{u.ner}</b></td>
                <td>{u.email}</td>
                <td>{u.utas}</td>
                <td>{u.hyamdral}%</td>
                <td>
                  {u.active === 1 ? (
                    <span style={{ color: 'var(--success)' }}>Идэвхтэй</span>
                  ) : (
                    <span style={{ color: 'var(--text-light)' }}>Идэвхгүй</span>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Хэрэглэгч олдсонгүй</td>
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
