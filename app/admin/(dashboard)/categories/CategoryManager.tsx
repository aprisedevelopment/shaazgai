'use client'

import { useState } from 'react'
import { createCategory, deleteCategory, toggleCategoryPublish } from '../../actions'
import toast from 'react-hot-toast'

interface Category {
  id: number
  title: string
  cat: number
  image?: string | null
  publish: number
  list_order: number
  isSub?: boolean
}

export function CategoryManager({ categories, mainCategories }: { categories: Category[]; mainCategories: Category[] }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await createCategory(formData)
    setLoading(false)
    if (res.success) {
      toast.success('Ангилал амжилттай нэмэгдлээ')
      setShowAddModal(false)
    } else {
      toast.error(res.error || 'Алдаа гарлаа')
    }
  }

  const handleToggle = async (cat: Category) => {
    const newStatus = cat.publish === 1 ? 0 : 1
    const res = await toggleCategoryPublish(cat.id, newStatus)
    if (res.success) {
      toast.success('Төлөв өөрчлөгдлөө')
    } else {
      toast.error('Алдаа гарлаа')
    }
  }

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`"${title}" ангиллыг устгахдаа итгэлтэй байна уу?`)) return
    const res = await deleteCategory(id)
    if (res.success) {
      toast.success('Ангилал устгагдлаа')
    } else {
      toast.error('Алдаа гарлаа')
    }
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Ангилал удирдлага</h1>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ height: 40, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>+</span> Ангилал нэмэх
        </button>
      </div>

      <div className="box" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>ID</th>
              <th>Нэр</th>
              <th>Төлөв</th>
              <th>Дараалал</th>
              <th style={{ width: 140, textAlign: 'center' }}>Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} style={{ background: c.isSub ? '#fbfcfe' : 'transparent' }}>
                <td><span style={{ opacity: c.isSub ? 0.6 : 1, fontSize: 12 }}>{c.id}</span></td>
                <td style={{ paddingLeft: c.isSub ? 36 : 16 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    {c.image ? (
                      <img 
                        src={`/uploads/cats/${c.image}`} 
                        alt="" 
                        style={{ width: 24, height: 24, objectFit: 'contain' }}
                        onError={(e) => { (e.currentTarget.style.display = 'none') }}
                      />
                    ) : null}
                    {c.isSub ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: '#94a3b8' }}>↳</span> {c.title}
                      </span>
                    ) : (
                      <b style={{ color: '#0f172a' }}>{c.title}</b>
                    )}
                  </div>
                </td>
                <td>
                  <button 
                    onClick={() => handleToggle(c)}
                    className={`badge ${c.publish === 1 ? 'badge-success' : 'badge-neutral'}`}
                    style={{ border: 'none', cursor: 'pointer' }}
                  >
                    {c.publish === 1 ? 'Идэвхтэй' : 'Идэвхгүй'}
                  </button>
                </td>
                <td>{c.list_order}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                    <button 
                      onClick={() => handleDelete(c.id, c.title)}
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
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Ангилал олдсонгүй</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal */}
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
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Шинэ ангилал нэмэх</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Ангиллын нэр</label>
                <input type="text" name="title" required className="form-control" placeholder="Жишээ: Эрэгтэй хувцас" />
              </div>

              <div className="form-group">
                <label className="form-label">Дээд ангилал (Эх ангилал)</label>
                <select name="cat" className="form-control" defaultValue="0">
                  <option value="0">Үндсэн ангилал (Дээд түвшин)</option>
                  {mainCategories.map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Эрэмбэ дараалал</label>
                <input type="number" name="list_order" defaultValue="0" className="form-control" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-ghost">
                  Болих
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Хадгалж байна...' : 'Хадгалах'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
