'use client'

import { useState, useMemo } from 'react'
import { createCategory, deleteCategory, toggleCategoryPublish } from '../../actions'
import { categoryImageUrl } from '@/lib/utils'
import type { AdminCategoryItem } from '@/lib/categories'
import toast from 'react-hot-toast'
import { Search, FolderTree, Package, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'

export function CategoryManager({ 
  categories, 
  mainCategories 
}: { 
  categories: AdminCategoryItem[]; 
  mainCategories: { id: number; title: string }[] 
}) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'with-products' | 'empty'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await createCategory(formData)
    setLoading(false)
    if (res.success) {
      toast.success('Ангилал амжилттай нэмэгдлээ')
      setShowAddModal(false)
      window.location.reload()
    } else {
      toast.error(res.error || 'Алдаа гарлаа')
    }
  }

  const handleToggle = async (cat: AdminCategoryItem) => {
    const newStatus = cat.publish === 1 ? 0 : 1
    const res = await toggleCategoryPublish(cat.id, newStatus)
    if (res.success) {
      toast.success('Төлөв өөрчлөгдлөө')
      window.location.reload()
    } else {
      toast.error('Алдаа гарлаа')
    }
  }

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`"${title}" ангиллыг устгахдаа итгэлтэй байна уу?`)) return
    const res = await deleteCategory(id)
    if (res.success) {
      toast.success('Ангилал устгагдлаа')
      window.location.reload()
    } else {
      toast.error('Алдаа гарлаа')
    }
  }

  // Statistics
  const totalCount = categories.length
  const withProductsCount = categories.filter(c => c.totalCount > 0).length
  const emptyCount = totalCount - withProductsCount
  const rootCount = categories.filter(c => c.cat === 0).length

  // Filtered categories
  const filteredList = useMemo(() => {
    return categories.filter(c => {
      // Type filter
      if (filterType === 'with-products' && c.totalCount === 0) return false
      if (filterType === 'empty' && c.totalCount > 0) return false

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return c.title.toLowerCase().includes(q) || c.pathTitle.toLowerCase().includes(q) || String(c.id).includes(q)
      }

      return true
    })
  }, [categories, filterType, searchQuery])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Ангилал удирдлага</h1>
          <p className="text-sm text-slate-500 mt-1">
            Сайтын frontend хэсэгт зөвхөн бараатай ангиллууд харагдаж, 0 бараатай хоосон ангиллууд автоматаар нуугдана.
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="btn btn-primary h-10 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Шинэ ангилал нэмэх</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Нийт ангилал</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalCount}</div>
          <div className="text-xs text-slate-500 mt-0.5">{rootCount} үндсэн эх ангилал</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Бараатай ангилал</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">{withProductsCount}</div>
          <div className="text-xs text-emerald-600/80 mt-0.5">Frontend-д идэвхтэй харагдана</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
          <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Хоосон ангилал</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{emptyCount}</div>
          <div className="text-xs text-amber-600/80 mt-0.5">Frontend-ээс автоматаар нуугдсан</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Үндсэн дээд ангилал</div>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">{rootCount}</div>
          <div className="text-xs text-blue-600/80 mt-0.5">Хувцас, Эх хүүхэд, Гоёл г.м</div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              filterType === 'all' 
                ? 'bg-[#0f2b5c] text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Бүгд ({totalCount})
          </button>
          <button
            onClick={() => setFilterType('with-products')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              filterType === 'with-products' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Бараатай ({withProductsCount})
          </button>
          <button
            onClick={() => setFilterType('empty')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              filterType === 'empty' 
                ? 'bg-amber-600 text-white' 
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            Хоосон ({emptyCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Ангилал хайх..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control pl-9 text-xs w-full h-9"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="box overflow-hidden" style={{ padding: 0 }}>
        <table className="data-table w-full">
          <thead>
            <tr>
              <th style={{ width: 70 }}>ID</th>
              <th>Ангиллын нэр ба шатлал</th>
              <th style={{ width: 140 }}>Барааны тоо</th>
              <th style={{ width: 110 }}>Төлөв</th>
              <th style={{ width: 90 }}>Эрэмбэ</th>
              <th style={{ width: 90, textAlign: 'center' }}>Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((c) => {
              const isRoot = c.level === 0
              const hasProducts = c.totalCount > 0

              return (
                <tr 
                  key={c.id} 
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isRoot ? 'bg-slate-50/60 font-semibold text-slate-900' : 'text-slate-700'
                  }`}
                >
                  {/* ID */}
                  <td>
                    <span className={`text-xs ${isRoot ? 'font-bold text-slate-700' : 'text-slate-400'}`}>
                      {c.id}
                    </span>
                  </td>

                  {/* Title & Tree hierarchy */}
                  <td style={{ paddingLeft: c.level * 28 + 16 }}>
                    <div className="inline-flex items-center gap-2.5">
                      {/* Tree branch glyph for sub-items */}
                      {c.level > 0 && (
                        <span className="text-slate-300 font-mono text-sm select-none">
                          {c.level === 1 ? '↳' : '↳↳'}
                        </span>
                      )}

                      {/* Icon */}
                      {c.image ? (
                        <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                          <img 
                            src={categoryImageUrl(c.image)} 
                            alt="" 
                            className="w-4 h-4 object-contain"
                            onError={(e) => { (e.currentTarget.style.display = 'none') }}
                          />
                        </div>
                      ) : isRoot ? (
                        <FolderTree className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : null}

                      {/* Title */}
                      <span className={isRoot ? 'text-sm font-bold text-slate-900' : 'text-xs text-slate-700'}>
                        {c.title}
                      </span>
                    </div>
                  </td>

                  {/* Products count badge */}
                  <td>
                    {hasProducts ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <Package className="w-3 h-3 text-emerald-500" />
                        {c.totalCount} бараа
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-400">
                        0 бараа
                      </span>
                    )}
                  </td>

                  {/* Publish Status */}
                  <td>
                    <button 
                      onClick={() => handleToggle(c)}
                      className={`badge ${c.publish === 1 ? 'badge-success' : 'badge-neutral'}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                      title="Төлөв өөрчлөх"
                    >
                      {c.publish === 1 ? 'Идэвхтэй' : 'Идэвхгүй'}
                    </button>
                  </td>

                  {/* List Order */}
                  <td className="text-xs text-slate-500">{c.list_order}</td>

                  {/* Delete Action */}
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      onClick={() => handleDelete(c.id, c.title)}
                      className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50" 
                      style={{ padding: '4px 8px' }}
                      title="Устгах"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )
            })}

            {filteredList.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  Тохирох ангилал олдсонгүй
                </td>
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
                <label className="form-label font-semibold">Ангиллын нэр</label>
                <input type="text" name="title" required className="form-control" placeholder="Жишээ: Эрэгтэй цамц" />
              </div>

              <div className="form-group">
                <label className="form-label font-semibold">Дээд ангилал (Эх ангилал)</label>
                <select name="cat" className="form-control" defaultValue="0">
                  <option value="0">Үндсэн ангилал (Дээд түвшин, Cat = 0)</option>
                  {mainCategories.map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label font-semibold">Эрэмбэ дараалал</label>
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
    </div>
  )
}
