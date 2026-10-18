'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { categoryImageUrl } from '@/lib/utils'
import type { Category } from '@/types'
import { 
  Layers, ChevronRight, Check, Headphones, ShieldCheck, ChevronDown,
  Shirt, Baby, Gem, Sparkles, Tent, Smartphone, Utensils, Home, BookOpen, Coffee, Activity, Hammer
} from 'lucide-react'

function buildTree(cats: Category[]): Category[] {
  const map: Record<number, Category> = {}
  const roots: Category[] = []
  cats.forEach((c) => { map[c.id] = { ...c, children: [] } })
  cats.forEach((c) => {
    if (c.cat === 0) roots.push(map[c.id])
    else map[c.cat]?.children?.push(map[c.id])
  })
  return roots
}

function getCategoryIconByTitle(title: string, className: string) {
  const t = title.toLowerCase()
  if (t.includes('хувцас')) return <Shirt className={className} />
  if (t.includes('хүүхэд')) return <Baby className={className} />
  if (t.includes('гоёл')) return <Gem className={className} />
  if (t.includes('гоо сайхан')) return <Sparkles className={className} />
  if (t.includes('аялал') || t.includes('спорт')) return <Tent className={className} />
  if (t.includes('электрон')) return <Smartphone className={className} />
  if (t.includes('шингэн хүнс')) return <Coffee className={className} />
  if (t.includes('хүнс')) return <Utensils className={className} />
  if (t.includes('гэр')) return <Home className={className} />
  if (t.includes('ном') || t.includes('бичиг')) return <BookOpen className={className} />
  if (t.includes('эрүүл')) return <Activity className={className} />
  if (t.includes('барилг')) return <Hammer className={className} />
  return <Layers className={className} />
}

function CatItem({ cat, depth = 0, currentId }: { cat: Category; depth?: number; currentId?: number }) {
  const isSelected = currentId === cat.id
  const isChildSelected = cat.children?.some(c => c.id === currentId)
  const [open, setOpen] = useState(isSelected || isChildSelected || false)
  const hasChildren = (cat.children?.length ?? 0) > 0

  return (
    <div className="flex flex-col w-full">
      <Link 
        href={`/c/${cat.id}`}
        className={`w-full px-4 py-2.5 flex items-center justify-between hover:bg-blue-50/70 transition-colors group text-left ${
          isSelected && depth === 0 ? 'bg-blue-50 text-[#0f2b5c] font-bold border-l-4 border-blue-600' : ''
        } ${depth > 0 ? 'pl-10 text-sm text-slate-600' : 'text-sm font-medium text-slate-700 border-b border-slate-100 last:border-0'}`}
      >
        <div className="flex items-center gap-3 truncate">
          {depth === 0 && (
            <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-blue-100/60 transition-colors overflow-hidden">
              {cat.image ? (
                <img 
                  src={`/uploads/cats/${cat.image}`} 
                  alt="" 
                  className="w-4 h-4 object-contain"
                  onError={(e) => { (e.currentTarget.style.display = 'none') }}
                />
              ) : (
                getCategoryIconByTitle(cat.title, "w-4 h-4 text-slate-500 group-hover:text-blue-600")
              )}
            </div>
          )}
          <span className="truncate">{cat.title}</span>
        </div>
        {hasChildren ? (
          <div 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open) }}
            className="p-1 -m-1 rounded hover:bg-blue-100/50"
          >
            {open ? (
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            )}
          </div>
        ) : isSelected && depth === 0 ? (
          <Check className="w-4 h-4 text-blue-600" />
        ) : null}
      </Link>
      
      {hasChildren && open && (
        <div className="bg-slate-50 border-y border-slate-100 py-1">
          {cat.children!.map((child) => (
            <CatItem key={child.id} cat={child} depth={depth + 1} currentId={currentId} />
          ))}
        </div>
      )}
    </div>
  )
}

export function CategorySidebar({ categories }: { categories: Category[] }) {
  const params = useParams()
  const currentId = params.id ? Number(params.id) : undefined
  const tree = buildTree(categories)

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden shrink-0 flex flex-col justify-between lg:h-[600px]">
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0f2b5c] text-white px-4 py-3 flex items-center justify-between font-bold text-sm tracking-wide shrink-0">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>АНГИЛАЛ</span>
          </div>
        </div>

        {/* Category List */}
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-2">
          {tree.map((cat) => <CatItem key={cat.id} cat={cat} currentId={currentId} />)}
        </div>
      </div>
    </div>
  )
}
