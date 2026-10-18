import { prisma } from '@/lib/db'
import { getAllCategoriesForAdmin } from '@/lib/categories'
import { redirect } from 'next/navigation'

export default async function AdminNewProductPage() {
  const sortedCategories = await getAllCategoriesForAdmin()

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Бараа нэмэх</h1>
      </div>

      <div className="box">
        <form action={async (formData) => {
          'use server'
          const kod = formData.get('kod') as string
          const title = formData.get('title') as string
          const une = Number(formData.get('une')) || 0
          const unehuuchin = Number(formData.get('unehuuchin')) || 0
          const catvars = formData.get('catvars') as string
          const publish = Number(formData.get('publish')) || 0
          const body = formData.get('body') as string

          await prisma.product.create({
            data: {
              kod,
              title,
              une,
              unehuuchin,
              catvars,
              publish,
              body,
              nemsen: Math.floor(Date.now() / 1000)
            }
          })
          const { redirect } = await import('next/navigation')
          redirect('/admin/products')
        }}>
          <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Барааны код (Давтагдахгүй)</label>
              <input type="text" name="kod" required className="form-control" style={{ width: '100%' }} />
            </div>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Барааны нэр</label>
              <input type="text" name="title" required className="form-control" style={{ width: '100%' }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Үнэ</label>
              <input type="number" name="une" required className="form-control" style={{ width: '100%' }} defaultValue="0" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Хуучин үнэ (Хямдарсан үед)</label>
              <input type="number" name="unehuuchin" className="form-control" style={{ width: '100%' }} defaultValue="0" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Ангилал</label>
              <select name="catvars" required className="form-control" style={{ width: '100%' }}>
                <option value="">Сонгох...</option>
                {sortedCategories.map(c => (
                  <option key={c.id} value={`:${c.id}:`}>
                    {c.level > 0 ? `${'— '.repeat(c.level)}${c.title}` : c.title} {c.totalCount > 0 ? `(${c.totalCount})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Төлөв</label>
              <select name="publish" className="form-control" style={{ width: '100%' }} defaultValue="1">
                <option value="1">Идэвхтэй</option>
                <option value="0">Идэвхгүй</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Дэлгэрэнгүй тайлбар</label>
            <textarea name="body" className="form-control" style={{ width: '100%', minHeight: 200 }}></textarea>
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
