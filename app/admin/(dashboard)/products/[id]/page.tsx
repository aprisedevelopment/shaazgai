import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { photos: true }
  })
  
  if (!product) {
    redirect('/admin/products')
  }

  const categories = await prisma.category.findMany({
    where: { publish: 1 },
    orderBy: { title: 'asc' }
  })

  const mainCategories = categories.filter(c => c.cat === 0)
  const subCategories = categories.filter(c => c.cat !== 0)

  const sortedCategories: any[] = []
  mainCategories.forEach(main => {
    sortedCategories.push({ ...main, isSub: false })
    subCategories.filter(sub => sub.cat === main.id).forEach(sub => {
      sortedCategories.push({ ...sub, isSub: true })
    })
  })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Бараа засах: {product.title}</h1>
      </div>

      <div className="box">
        <form action={async (formData) => {
          'use server'
          const kod = formData.get('kod') as string
          const title = formData.get('title') as string
          const image = (formData.get('image') as string)?.trim() || null
          const une = Number(formData.get('une')) || 0
          const unehuuchin = Number(formData.get('unehuuchin')) || 0
          const catvars = formData.get('catvars') as string
          const publish = Number(formData.get('publish')) || 0
          const body = formData.get('body') as string
          const options = formData.get('options') as string

          await prisma.product.update({
            where: { id: product.id },
            data: {
              kod,
              title,
              image: image !== null ? image : product.image,
              une,
              unehuuchin,
              catvars,
              publish,
              body,
              options,
            }
          })
          const { redirect } = await import('next/navigation')
          redirect('/admin/products')
        }}>
          {/* Product Image & Gallery */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 24, padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', alignItems: 'flex-start' }}>
            <div style={{ width: 100, height: 100, borderRadius: 8, overflow: 'hidden', border: '1px solid #cbd5e1', background: '#fff', flexShrink: 0 }}>
              {product.image ? (
                <img 
                  src={`/uploads/baraa/small/${product.image}`} 
                  alt={product.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 12 }}>Зураггүй</div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Үндсэн зургийн файл</label>
              <input 
                type="text" 
                name="image" 
                defaultValue={product.image || ""} 
                placeholder="Жишээ: 4_50_8244384.jpg" 
                className="form-control" 
                style={{ width: '100%', marginBottom: 6 }} 
              />
              <div style={{ fontSize: 12, color: '#64748b' }}>
                Зам: <code>/uploads/baraa/{product.image || 'байхгүй'}</code>
              </div>
            </div>
          </div>

          {/* Gallery Photos */}
          {product.photos && product.photos.length > 0 && (
            <div style={{ marginBottom: 24, padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', marginBottom: 10, fontWeight: 600 }}>Цомгийн нэмэлт зургууд ({product.photos.length})</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {product.photos.map(ph => (
                  <div key={ph.id} style={{ width: 64, height: 64, borderRadius: 6, overflow: 'hidden', border: '1px solid #cbd5e1', background: '#fff' }} title={ph.image}>
                    <img 
                      src={`/uploads/baraa/small/${ph.image}`} 
                      alt="" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Барааны код (Давтагдахгүй)</label>
              <input type="text" name="kod" defaultValue={product.kod} required className="form-control" style={{ width: '100%' }} />
            </div>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Барааны нэр</label>
              <input type="text" name="title" defaultValue={product.title} required className="form-control" style={{ width: '100%' }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Үнэ</label>
              <input type="number" name="une" defaultValue={product.une} required className="form-control" style={{ width: '100%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Хуучин үнэ (Хямдарсан үед)</label>
              <input type="number" name="unehuuchin" defaultValue={product.unehuuchin} className="form-control" style={{ width: '100%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Ангилал</label>
              <select name="catvars" defaultValue={product.catvars || ""} required className="form-control" style={{ width: '100%' }}>
                <option value="">Сонгох...</option>
                {sortedCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.isSub ? `— ${c.title}` : c.title}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Төлөв</label>
              <select name="publish" defaultValue={product.publish} className="form-control" style={{ width: '100%' }}>
                <option value="1">Идэвхтэй</option>
                <option value="0">Идэвхгүй</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Сонголтууд (Жишээ нь: Улаан, Хар, S, M)</label>
            <input type="text" name="options" defaultValue={product.options || ""} placeholder="Сонголтуудыг таслалаар тусгаарлаж бичнэ үү" className="form-control" style={{ width: '100%' }} />
            <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>Хоосон орхивол сонголтгүй гэж үзнэ.</div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Дэлгэрэнгүй тайлбар</label>
            <textarea name="body" defaultValue={product.body || ""} className="form-control" style={{ width: '100%', minHeight: 200 }}></textarea>
          </div>

          <div>
            <button type="submit" className="btn btn-primary" style={{ minWidth: 150 }}>Хадгалах</button>
            <a href="/admin/products" className="btn btn-ghost" style={{ marginLeft: 12 }}>Буцах</a>
          </div>
        </form>
      </div>
    </>
  )
}
