import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { ProductCard } from '@/components/home/ProductCard'

export default async function FavoritesPage() {
  const session = await auth()
  if (!session?.user) redirect('/user/login')

  const userId = Number((session.user as any).id)
  
  if (isNaN(userId)) {
    return <div className="box text-center">Хэрэглэгч олдсонгүй.</div>
  }

  // Get favorites
  const favorites = await prisma.favorite.findMany({
    where: { userid: userId },
    include: { product: true },
    orderBy: { id: 'desc' }
  })

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
        
        {/* Sidebar Nav */}
        <div className="box" style={{ padding: 16, height: 'fit-content' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Link href="/user" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>👤 Миний профайл</Link>
            <Link href="/user/orders" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>📦 Миний захиалгууд</Link>
            <Link href="/user/favorites" className="btn btn-ghost" style={{ justifyContent: 'flex-start', background: 'var(--primary-bg)', color: 'var(--primary)' }}>❤️ Таалагдсан</Link>
            <Link href="/user/edit" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>⚙️ Тохиргоо</Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="box">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>Таалагдсан бараа</h2>
            <span style={{ background: 'var(--primary-bg)', color: 'var(--primary)', padding: '2px 10px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
              {favorites.length}
            </span>
          </div>

          {favorites.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 16px', opacity: 0.5 }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <p>Таалагдсан бараа байхгүй байна.</p>
              <Link href="/" className="btn btn-outline" style={{ marginTop: 16 }}>Дэлгүүр рүү буцах</Link>
            </div>
          ) : (
            <div className="product-grid">
              {favorites.map((f) => (
                <ProductCard key={f.id} product={f.product as any} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
