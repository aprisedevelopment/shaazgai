import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'

export async function generateMetadata({ params }: { params: Promise<{ purl: string }> }): Promise<Metadata> {
  const { purl } = await params
  const page = await prisma.page.findUnique({ where: { purl } })
  if (!page) return { title: 'Хуудас олдсонгүй' }
  return { title: page.title }
}

export default async function StaticPage({ params }: { params: Promise<{ purl: string }> }) {
  const { purl } = await params
  const page = await prisma.page.findUnique({ where: { purl } })

  if (!page) {
    notFound()
  }

  // Fetch all pages for the sidebar
  const allPages = await prisma.page.findMany({
    where: { publish: 1 },
    orderBy: { list_order: 'asc' }
  })

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32, alignItems: 'start' }} className="page-layout">
        
        {/* Sidebar / Menu for Pages */}
        <div className="box" style={{ padding: 24, display: 'none' }} id="page-sidebar">
          <h3 style={{ marginBottom: 16, fontSize: 16, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
            Мэдээлэл
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {allPages.map(p => (
              <li key={p.id}>
                <Link 
                  href={`/pages/${p.purl}`}
                  style={{
                    display: 'block',
                    padding: '8px 12px',
                    borderRadius: 8,
                    textDecoration: 'none',
                    color: p.purl === purl ? 'var(--primary)' : 'var(--text)',
                    backgroundColor: p.purl === purl ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                    fontWeight: p.purl === purl ? 600 : 400,
                    transition: 'all 0.2s'
                  }}
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Area */}
        <div className="box" style={{ padding: '32px 40px', minHeight: 400 }}>
          <h1 className="section-title" style={{ marginBottom: 32, fontSize: 24, borderBottom: '2px solid var(--primary)', paddingBottom: 16, display: 'inline-block' }}>
            {page.title}
          </h1>
          
          <div 
            className="prose" 
            style={{ 
              lineHeight: 1.8, 
              color: 'var(--text-light)', 
              fontSize: 15,
            }}
            dangerouslySetInnerHTML={{ __html: page.body || '' }} 
          />
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) {
          .page-layout { grid-template-columns: 280px 1fr !important; }
          #page-sidebar { display: block !important; }
        }
        .prose h2, .prose h3, .prose h4 { color: var(--text); margin-top: 24px; margin-bottom: 12px; }
        .prose p { margin-bottom: 16px; }
        .prose ul, .prose ol { margin-bottom: 16px; padding-left: 24px; }
        .prose li { margin-bottom: 8px; }
        .prose a { color: var(--primary); text-decoration: none; }
        .prose a:hover { text-decoration: underline; }
      `}} />
    </div>
  )
}
