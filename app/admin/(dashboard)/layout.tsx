import Link from 'next/link'
import { Toaster } from 'react-hot-toast'
import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'

import { NotificationCenter } from './NotificationCenter'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = (session?.user as any) || { name: 'Admin', role: 'admin' }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 8, background: 'var(--primary)', color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
              Т
            </span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                ТҮГЭЭЛТ<span style={{ color: 'var(--accent)' }}>.МН</span>
              </span>
              <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Админ удирдлага
              </span>
            </div>
          </Link>
        </div>
        <nav className="admin-nav">
          <div className="admin-nav-group">Дэлгүүр</div>
          <Link href="/admin/orders">
            <span className="nav-icon">📦</span> Захиалгууд
          </Link>
          <Link href="/admin/products">
            <span className="nav-icon">👕</span> Бараанууд
          </Link>
          <Link href="/admin/categories">
            <span className="nav-icon">🗂️</span> Ангилал
          </Link>

          <div className="admin-nav-group">Хүний нөөц</div>
          <Link href="/admin/applications">
            <span className="nav-icon">📋</span> Анкетууд
          </Link>
          <Link href="/admin/jobs">
            <span className="nav-icon">💼</span> Ажлын байр
          </Link>

          <div className="admin-nav-group">Удирдлага</div>
          <Link href="/admin/users">
            <span className="nav-icon">👥</span> Хэрэглэгчид
          </Link>
          <Link href="/admin/payments">
            <span className="nav-icon">💳</span> Төлбөр тооцоо
          </Link>
          
          <div className="admin-nav-group">Агуулга</div>
          <Link href="/admin/banners">
            <span className="nav-icon">🖼️</span> Баннер
          </Link>
          <Link href="/admin/pages">
            <span className="nav-icon">📄</span> Хуудсууд
          </Link>
          <Link href="/admin/comments">
            <span className="nav-icon">💬</span> Сэтгэгдэл
          </Link>
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <form action={async () => {
            'use server'
            await signOut({ redirectTo: '/admin/login' })
          }}>
            <button className="btn btn-outline btn-block" style={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.2)', fontSize: 13 }} type="submit">
              Гарах
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div style={{ flex: 1 }}>Удирдлагын хэсэг</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontWeight: 500 }}>
            <NotificationCenter />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span>{user.name}</span>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                {user.name?.[0]?.toUpperCase()}
              </div>
            </div>
          </div>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  )
}
