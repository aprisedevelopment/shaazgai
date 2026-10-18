import Link from 'next/link'
import type { Page } from '@/types'
import { MapPin, Phone, Mail, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react'

const PHONE_NUM = process.env.NEXT_PUBLIC_PHONE || '75955050'
const EMAIL = process.env.NEXT_PUBLIC_EMAIL || 'info@tugeelt.mn'

export function Footer({ pages }: { pages: Page[] }) {
  return (
    <footer className="bg-[#0f172a] text-slate-300 pt-12 pb-8 border-t border-slate-800 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        


        {/* 3 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="text-xl font-black text-white">Түгээлт.mn</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Монголын хамгийн өргөн сонголттой цахим худалдааны платформ.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Улаанбаатар хот, Монгол улс</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold">{PHONE_NUM}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{EMAIL}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Хэрэгцээт холбоос
            </h3>
            <ul className="space-y-2 text-xs">
              {pages.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/pages/${p.purl}`}
                    className="hover:text-emerald-400 transition-colors text-left"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Нээлттэй ажлын байр
                </Link>
              </li>
              <li>
                <Link
                  href="/anket"
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Анкет илгээх
                </Link>
              </li>
              <li>
                <Link
                  href="/anket/track"
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Анкетын явц шалгах
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: About Us */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Бидний тухай
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tugeelt.mn нь Монголын хэрэглэгчдэд зориулсан чанартай, хямд бараа бүтээгдэхүүнийг найдвартай хүргэх зорилготой цахим дэлгүүр юм. Бид өдөр тутам барааны нэр төрлөө нэмэгдүүлж байна.
            </p>
          </div>

        </div>

        {/* Bottom Copyright Notice */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} Tugeelt.mn. Бүх эрх хуулиар хамгаалагдсан.
        </div>

      </div>
    </footer>
  )
}
