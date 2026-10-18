'use client'

import { useState } from 'react'
import { createPageAction, deletePageAction } from '../../actions'
import toast from 'react-hot-toast'

interface Page {
  id: number
  title: string
  purl: string
  body: string | null
  publish: number
  list_order: number
}

export function PageManager({ pages }: { pages: Page[] }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await createPageAction(formData)
    setLoading(false)
    if (res.success) {
      toast.success('Хуудас амжилттай үүслээ')
      setShowAddModal(false)
    } else {
      toast.error(res.error || 'Алдаа гарлаа')
    }
  }

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`"${title}" хуудсыг устгахдаа итгэлтэй байна уу?`)) return
    const res = await deletePageAction(id)
    if (res.success) {
      toast.success('Хуудас устгагдлаа')
    } else {
      toast.error('Алдаа гарлаа')
    }
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Хуудас удирдлага</h1>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ height: 40, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>+</span> Хуудас үүсгэх
        </button>
      </div>

      <div className="box" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>ID</th>
              <th>Гарчиг</th>
              <th>Холбоос (URL)</th>
              <th>Төлөв</th>
              <th style={{ width: 120, textAlign: 'center' }}>Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td><b style={{ color: '#0f172a' }}>{p.title}</b></td>
                <td>
                  <a href={`/pages/${p.purl}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                    /pages/{p.purl}
                  </a>
                </td>
                <td>
                  <span className={`badge ${p.publish === 1 ? 'badge-success' : 'badge-neutral'}`}>
                    {p.publish === 1 ? 'Идэвхтэй' : 'Идэвхгүй'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                    <button 
                      onClick={() => handleDelete(p.id, p.title)}
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
            {pages.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Хуудас олдсонгүй</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Page Modal */}
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
          <div className="box" style={{ width: '100%', maxWidth: 540, margin: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Шинэ хуудас үүсгэх</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Хуудасны гарчиг</label>
                <input type="text" name="title" required className="form-control" placeholder="Жишээ: Бидний тухай" />
              </div>

              <div className="form-group">
                <label className="form-label">URL Slug (Латинаар)</label>
                <input type="text" name="purl" required className="form-control" placeholder="Жишээ: about-us" />
              </div>

              <div className="form-group">
                <label className="form-label">Агуулга (Текст / HTML)</label>
                <textarea name="body" className="form-control" style={{ minHeight: 140 }} placeholder="Хуудасны дэлгэрэнгүй агуулга..."></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-ghost">
                  Болих
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Үүсгэж байна...' : 'Үүсгэх'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
