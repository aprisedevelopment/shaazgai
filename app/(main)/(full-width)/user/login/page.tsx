'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      if (res?.error) {
        setError('Имэйл эсвэл нууц үг буруу байна.')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('Алдаа гарлаа. Дахин оролдоно уу.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <h1>Нэвтрэх</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Имэйл хаяг</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Нууц үг</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <Link href="/user/forgot" style={{ fontSize: 13 }}>Нууц үгээ мартсан уу?</Link>
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
          {loading ? 'Уншиж байна...' : 'Нэвтрэх'}
        </button>
      </form>

      <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13.5, color: 'var(--text-muted)' }}>
        Бүртгэлгүй юу? <Link href="/user/register" style={{ fontWeight: 600 }}>Энд дарж бүртгүүлнэ үү</Link>
      </div>
    </div>
  )
}
