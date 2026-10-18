'use client'
import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const registered = searchParams.get('registered') === '1'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
        setError('Имэйл хаяг эсвэл нууц үг буруу байна.')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError('Системийн алдаа гарлаа. Дахин оролдоно уу.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto my-8 bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden animate-in fade-in">
      <div className="bg-[#0f2b5c] p-6 text-white text-center">
        <h1 className="text-2xl font-black mb-1">Нэвтрэх</h1>
        <p className="text-blue-100 text-xs">
          Та өөрийн бүртгэлээр нэвтэрч захиалгаа үргэлжлүүлнэ үү
        </p>
      </div>

      <div className="p-6 sm:p-8">
        {registered && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Бүртгэл амжилттай үүслээ! Та нэвтэрч орно уу.</span>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 mb-6 animate-in shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (error) setError('') }}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Нууц үг <span className="text-rose-500">*</span>
              </label>
              <Link
                href="/user/forgot"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Нууц үгээ мартсан?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
                placeholder="Нууц үгээ оруулна уу"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (error) setError('') }}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#0f2b5c] hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Нэвтэрч байна...</span>
              </>
            ) : (
              <>
                <span>Нэвтрэх</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          Бүртгэлгүй юу?{' '}
          <Link
            href={`/user/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-bold text-blue-600 hover:text-blue-800 transition-colors ml-1"
          >
            Шинээр бүртгүүлэх
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto my-12 p-8 text-center bg-white rounded-2xl border border-slate-200">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-500">Уншиж байна...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
