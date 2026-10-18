import { prisma } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const numId = Number(id)
  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { id: numId },
        { zid: numId }
      ]
    },
    include: {
      details: true
    }
  })
  
  if (!order) {
    redirect('/admin/orders')
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Захиалга #{order.zid || order.id} дэлгэрэнгүй</h1>
        <Link href="/admin/orders" className="btn btn-outline">Буцах</Link>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 2 }}>
          <div className="box" style={{ padding: 0, marginBottom: 24 }}>
            <div style={{ padding: 20, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Захиалсан бараанууд</h2>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Код</th>
                  <th>Нэр</th>
                  <th>Сонголт</th>
                  <th>Тоо</th>
                  <th>Үнэ</th>
                  <th>Нийт</th>
                </tr>
              </thead>
              <tbody>
                {order.details.map(d => (
                  <tr key={d.id}>
                    <td>{d.kod}</td>
                    <td><b>{d.title}</b></td>
                    <td>{d.songolt}</td>
                    <td>{d.hed}</td>
                    <td>{formatPrice(d.une)}</td>
                    <td style={{ fontWeight: 600 }}>{formatPrice(d.une * d.hed)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5} style={{ textAlign: 'right', paddingRight: 20 }}><b>Нийт төлөх дүн:</b></td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 16 }}>{order.niitdun ? formatPrice(Number(order.niitdun)) : '-'}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        <div style={{ flex: 1 }}>
          <div className="box">
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Захиалагчийн мэдээлэл</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><span style={{ color: 'var(--text-muted)' }}>Нэр:</span> <b>{order.ner}</b></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Утас 1:</span> <b>{order.utas1}</b></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Утас 2:</span> <b>{order.utas2 || '-'}</b></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Огноо:</span> {order.ognoo} {order.tsag}</div>
              <div><span style={{ color: 'var(--text-muted)' }}>Хаяг:</span> <br/>{order.hayag}</div>
              <div><span style={{ color: 'var(--text-muted)' }}>Тэмдэглэл:</span> <br/>{order.comment || '-'}</div>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.1)', margin: '8px 0' }} />
              <div><span style={{ color: 'var(--text-muted)' }}>Төлбөрийн хэлбэр:</span> <b>{order.tolbor_helber === '1' ? 'Бэлнээр' : order.tolbor_helber === '2' ? 'Дансаар' : order.tolbor_helber === '4' ? 'QPay' : order.tolbor_helber === '8' ? 'LendMN' : 'Карт'}</b></div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Төлөв:</span> 
                <span style={{ marginLeft: 8, fontSize: 12, background: order.tolov === '1' ? 'var(--success)' : order.tolov === '2' ? 'var(--danger)' : 'var(--warning)', color: order.tolov === '1' || order.tolov === '2' ? '#fff' : '#000', padding: '4px 8px', borderRadius: 10 }}>
                  {order.tolov === '1' ? 'Хүргэгдсэн' : order.tolov === '2' ? 'Цуцлагдсан' : 'Хүлээгдэж буй'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
