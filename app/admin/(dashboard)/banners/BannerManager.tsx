'use client'

import { useState } from 'react'
import { createBanner, deleteBanner, toggleBannerPublish } from '../../actions'
import { bannerImageUrl } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Banner {
  id: number
  title: string | null
  image: string | null
  holboos: string | null
  publish: number
}

export function BannerManager({ banners }: { banners: Banner[] }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await createBanner(formData)
    setLoading(false)
    if (res.success) {
      toast.success('Баннер амжилттай нэмэгдлээ')
      setShowAddModal(false)
    } else {
      toast.error(res.error || 'Алдаа гарлаа')
    }
  }

  const handleToggle = async (b: Banner) => {
    const newStatus = b.publish === 1 ? 0 : 1
    const res = await toggleBannerPublish(b.id, newStatus)
    if (res.success) {
      toast.success('Төлөв өөрчлөгдлөө')
    } else {
      toast.error('Алдаа гарлаа')
    }
  }

  const handleDelete = async (id: number, title: string | null) => {
    if (!confirm(`Баннерыг устгахдаа итгэлтэй байна уу?`)) return
    const res = await deleteBanner(id)
    if (res.success) {
      toast.success('Баннер устгагдлаа')
    } else {
      toast.error('Алдаа гарлаа')
    }
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Баннер удирдлага</h1>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ height: 40, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>+</span> Баннер нэмэх
        </button>
      </div>

      <div className="box" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>ID</th>
              <th style={{ width: 140 }}>Зураг</th>
              <th>Нэр / Гарчиг</th>
              <th>Холбоос</th>
              <th>Төлөв</th>
              <th style={{ width: 120, textAlign: 'center' }}>Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>
                  <div style={{ width: 110, height: 50, borderRadius: 8, overflow: 'hidden', background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                    {b.image ? (
                      <img 
                        src={b.image.startsWith('http') || b.image.startsWith('/') ? b.image : bannerImageUrl(b.image)} 
                        alt={b.title || ''} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => { (e.currentTarget.style.display = 'none') }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 11 }}>Зураггүй</div>
                    )}
                  </div>
                </td>
                <td><b style={{ color: '#0f172a' }}>{b.title || '-'}</b></td>
                <td>
                  {b.holboos ? (
                    <a href={b.holboos} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                      {b.holboos}
                    </a>
                  ) : '-'}
                </td>
                <td>
                  <button 
                    onClick={() => handleToggle(b)}
                    className={`badge ${b.publish === 1 ? 'badge-success' : 'badge-neutral'}`}
                    style={{ border: 'none', cursor: 'pointer' }}
                  >
                    {b.publish === 1 ? 'Идэвхтэй' : 'Идэвхгүй'}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                    <button 
                      onClick={() => handleDelete(b.id, b.title)}
                      className="btn btn-ghost btn-sm" 
                      style={{ padding: '4px 8px', color: 'var(--danger)' }}
                      title="Устгах"
                    >
                      🗑
                    </button>
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

      {/* Add Banner Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="box" style={{ width: '100%', maxWidth: 480, margin: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Шинэ баннер нэмэх</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Баннерын гарчиг</label>
                <input type="text" name="title" className="form-control" placeholder="Жишээ: Хаврын хямдрал" />
              </div>

              <div className="form-group">
                <label className="form-label">Зургийн нэр эсвэл URL</label>
                <input type="text" name="image" required className="form-control" placeholder="banner1.jpg эсвэл https://..." />
              </div>

              <div className="form-group">
                <label className="form-label">Дарах үед үсрэх холбоос (URL)</label>
                <input type="text" name="holboos" className="form-control" placeholder="Жишээ: /c/1 эсвэл /filter/featured" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-ghost">
                  Болих
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Нэмж байна...' : 'Нэмэх'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
