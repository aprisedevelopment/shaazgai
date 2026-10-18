'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/user'

  const [form, setForm] = useState({ ner: '', email: '', utas: '', pass: '', pass2: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }))
    if (error) setError('')
  }

  const passwordsMatch = !form.pass2 || form.pass === form.pass2

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.pass !== form.pass2) {
      setError('Нууц үг хоорондоо таарахгүй байна.')
      return
    }
    if (form.pass.length < 6) {
      setError('Нууц үг хамгийн багадаа 6 тэмдэгттэй байх ёстой.')
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
      const loginRes = await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.pass,
      })

      if (loginRes?.error) {
        // Registered successfully, but auto-login issue -> redirect to login
        router.push(`/user/login?callbackUrl=${encodeURIComponent(callbackUrl)}&registered=1`)
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError('Сүлжээний алдаа гарлаа. Дахин оролдоно уу.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto my-8 bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden animate-in fade-in">
      <div className="bg-[#0f2b5c] p-6 text-white text-center">
        <h1 className="text-2xl font-black mb-1">Шинээр бүртгүүлэх</h1>
        <p className="text-blue-100 text-xs">
          Түгээлт онлайн дэлгүүрт тавтай морилно уу
        </p>
      </div>

      <div className="p-6 sm:p-8">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 mb-6 animate-in shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Таны нэр <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
                placeholder="Бат-Эрдэнэ"
                value={form.ner}
                onChange={set('ner')}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Имэйл хаяг <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
                placeholder="name@example.com"
                value={form.email}
                onChange={set('email')}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Утасны дугаар <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
                placeholder="99112233"
                value={form.utas}
                onChange={set('utas')}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Нууц үг <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
                placeholder="Хамгийн багадаа 6 оронтой"
                value={form.pass}
                onChange={set('pass')}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Нууц үг давтах <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm focus:ring-2 focus:bg-white focus:outline-none transition-all ${
                  !passwordsMatch ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-blue-500'
                }`}
                placeholder="Нууц үгээ дахин оруулна уу"
                value={form.pass2}
                onChange={set('pass2')}
                required
                minLength={6}
                autoComplete="new-password"
              />
              {form.pass2 && passwordsMatch && (
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>
            {!passwordsMatch && (
              <p className="text-xs text-rose-500 font-medium mt-1">Нууц үг таарахгүй байна</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !passwordsMatch}
            className="w-full mt-4 bg-[#0f2b5c] hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Бүртгэж байна...</span>
              </>
            ) : (
              <>
                <span>Бүртгүүлэх</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          Бүртгэлтэй хэрэглэгч үү?{' '}
          <Link
            href={`/user/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-bold text-blue-600 hover:text-blue-800 transition-colors ml-1"
          >
            Нэвтрэх
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto my-12 p-8 text-center bg-white rounded-2xl border border-slate-200">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-500">Уншиж байна...</p>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
