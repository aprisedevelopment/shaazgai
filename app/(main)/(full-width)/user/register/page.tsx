'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ ner: '', email: '', utas: '', pass: '', pass2: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.pass !== form.pass2) {
      setError('Нууц үг хоорондоо таарахгүй байна.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.error || 'Бүртгэх үед алдаа гарлаа.')
        setLoading(false)
        return
      }
      // Auto login
      await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.pass,
      })
      router.push('/user')
      router.refresh()
    } catch {
      setError('Сүлжээний алдаа.')
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <h1>Шинээр бүртгүүлэх</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Таны нэр</label>
          <input type="text" className="form-control" value={form.ner} onChange={set('ner')} required />
        </div>
        <div className="form-group">
          <label className="form-label">Имэйл хаяг</label>
          <input type="email" className="form-control" value={form.email} onChange={set('email')} required />
        </div>
        <div className="form-group">
          <label className="form-label">Утасны дугаар</label>
          <input type="tel" className="form-control" value={form.utas} onChange={set('utas')} required />
        </div>
        <div className="form-group">
          <label className="form-label">Нууц үг</label>
          <input type="password" className="form-control" value={form.pass} onChange={set('pass')} required minLength={6} />
        </div>
        <div className="form-group">
          <label className="form-label">Нууц үг давтах</label>
          <input type="password" className="form-control" value={form.pass2} onChange={set('pass2')} required minLength={6} />
        </div>
        
        <button type="submit" className="btn btn-primary btn-lg btn-block" style={{ marginTop: 24 }} disabled={loading}>
          {loading ? 'Уншиж байна...' : 'Бүртгүүлэх'}
        </button>
      </form>

      <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13.5, color: 'var(--text-muted)' }}>
        Бүртгэлтэй юу? <Link href="/user/login" style={{ fontWeight: 600 }}>Нэвтрэх</Link>
      </div>
    </div>
  )
}
