import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { userAvatarUrl, formatPrice, timeAgo } from '@/lib/utils'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect('/user/login')

  const userId = Number((session.user as any).id)
  
  // Refetch user data to get fresh info (only if userId is a valid number, meaning it's a regular user)
  const user = !isNaN(userId) ? await prisma.user.findUnique({
    where: { id: userId },
    select: { ner: true, email: true, utas: true, hayag: true, image: true, hyamdral: true, regognoo: true }
  }) : null
  
  if (!user) {
    // Session is invalid
    return (
      <div className="box text-center">
        Хэрэглэгч олдсонгүй. <Link href="/api/auth/signout">Гарах</Link>
      </div>
    )
  }

  // Get recent orders
  const orders = await prisma.order.findMany({
    where: { sesid: String(userId) }, // Legacy system stored userId in sesid when logged in
    orderBy: { id: 'desc' },
    take: 5
  })

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gap: 24 }}>
      
      {/* Profile Card */}
      <div className="profile-card" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        <img className="profile-avatar" src={userAvatarUrl(user.image)} alt={user.ner} style={{ margin: 0, width: 100, height: 100 }} />
        <div style={{ flex: 1 }}>
          <h2 style={{ marginBottom: 4, fontWeight: 700 }}>{user.ner}</h2>
          <p className="text-muted" style={{ marginBottom: 12 }}>{user.email}</p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13 }}>
            <span style={{ background: 'var(--primary-bg)', color: 'var(--primary)', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>
              Хөнгөлөлт: {user.hyamdral}%
            </span>
            <span className="text-muted" style={{ padding: '4px 0' }}>Утас: {user.utas || '-'}</span>
          </div>
        </div>
        <div>
          <form action={async () => {
            'use server'
            await signOut({ redirectTo: '/' })
          }}>
            <button className="btn btn-outline" type="submit">Гарах</button>
          </form>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        {/* Sidebar Nav */}
        <div className="box" style={{ padding: 16 }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Link href="/user" className="btn btn-ghost" style={{ justifyContent: 'flex-start', background: 'var(--primary-bg)', color: 'var(--primary)' }}>👤 Миний профайл</Link>
            <Link href="/user/orders" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>📦 Миний захиалгууд</Link>
            <Link href="/user/favorites" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>❤️ Таалагдсан</Link>
            <Link href="/user/edit" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>⚙️ Тохиргоо</Link>
            {(session.user as any).role === 'employee' && (
              <Link href="/admin" className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--danger)' }}>🛡️ Удирдлагын хэсэг</Link>
            )}
          </nav>
        </div>

        {/* Main Content */}
        <div className="box">
          <h3 style={{ marginBottom: 16, fontWeight: 700 }}>Сүүлийн захиалгууд</h3>
          {orders.length === 0 ? (
            <p className="text-muted">Захиалга байхгүй байна.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {orders.map((o) => (
                <div key={o.id} style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Захиалга #{o.zid || o.id}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-light)' }}>
                      {timeAgo(Number(o.ognoo))}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>{o.niitdun ? formatPrice(Number(o.niitdun)) : '-'}</div>
                    <span style={{ fontSize: 11, background: Number(o.tolov) === 1 ? 'var(--success)' : 'var(--bg-section)', color: Number(o.tolov) === 1 ? '#fff' : 'var(--text-muted)', padding: '2px 8px', borderRadius: 10 }}>
                      {Number(o.tolov) === 1 ? 'Хүргэгдсэн' : Number(o.tolov) === 2 ? 'Цуцлагдсан' : 'Хүлээгдэж буй'}
                    </span>
                  </div>
                </div>
              ))}
              <Link href="/user/orders" className="btn btn-outline btn-block" style={{ marginTop: 8 }}>Бүх захиалгыг харах</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
