// ==========================================
// TUGEELT.MN — Utility Functions
// ==========================================

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Монгол валют форматлах */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('mn-MN').format(amount) + '₮'
}

/** Хямдралын хувь тооцоолох */
export function calcDiscount(une: number, unehuuchin: number): number {
  if (!unehuuchin || unehuuchin <= une) return 0
  return Math.round(100 - (une * 100) / unehuuchin)
}

/** Хугацаа текст болгох */
export function timeAgo(timestamp: number): string {
  const diff = Math.floor(Date.now() / 1000) - timestamp
  if (diff < 60) return 'дөнгөж сая'
  if (diff < 3600) return `${Math.floor(diff / 60)} минутын өмнө`
  if (diff < 86400) return `${Math.floor(diff / 3600)} цагийн өмнө`
  if (diff < 172800) return 'өчигдөр'
  if (diff < 2592000) return `${Math.floor(diff / 86400)} өдрийн өмнө`
  return new Date(timestamp * 1000).toLocaleDateString('mn-MN')
}

/** Зургийн upload үндсэн замыг авах */
export function getUploadBase(): string {
  const envUrl = process.env.NEXT_PUBLIC_UPLOAD_URL;
  // Хуучин үхсэн tugeelt.mn домэйн заасан бол эсвэл тохируулаагүй бол дотоод /uploads руу чиглүүлнэ
  if (!envUrl || envUrl.includes('tugeelt.mn')) {
    return '/uploads';
  }
  return envUrl.replace(/\/+$/, '');
}

/** Барааны зургийн URL */
export function productImageUrl(image?: string | null, size: 'full' | 'small' = 'full'): string {
  const base = getUploadBase()
  if (!image) return `${base}/images/nophoto.jpg`
  if (size === 'small') return `${base}/baraa/small/${image}`
  return `${base}/baraa/${image}`
}

/** Хэрэглэгчийн аватар URL */
export function userAvatarUrl(image?: string | null): string {
  const base = getUploadBase()
  if (!image) return `${base}/images/noavatar.jpg`
  return `${base}/users/${image}`
}

/** Баннерийн URL */
export function bannerImageUrl(image?: string | null): string {
  const base = getUploadBase()
  if (!image) return ''
  if (['featured.png', 'discount.png', 'new.png', 'best.png', 'delivery.png'].includes(image)) {
    return `/banners/${image}`
  }
  return `${base}/banners/${image}`
}

/** Ангилалын зургийн URL */
export function categoryImageUrl(image?: string | null): string {
  const base = getUploadBase()
  if (!image) return ''
  return `${base}/cats/${image}`
}

/** Random string үүсгэх */
export function randomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

/** Захиалгын дугаар үүсгэх (код_уусгэх) */
export function generateOrderCode(id: number): string {
  const idStr = String(id)
  const pad = 10 - idStr.length
  return '88' + '0'.repeat(Math.max(0, pad - 2)) + idStr + '88'
}

/** Гарын авлага зургийн URL (barcode) */
export function barcodeUrl(kod: string): string {
  return `http://www.barcodes4.me/barcode/c128b/${kod}.png?IsTextDrawn=1`
}

/** Текст таслах */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

/** Session ID авах эсвэл үүсгэх */
export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let sesid = localStorage.getItem('tugeelt_sesid')
  if (!sesid) {
    sesid = randomString(32)
    localStorage.setItem('tugeelt_sesid', sesid)
  }
  return sesid
}

/** Mobile device шалгах */
export function isMobileUserAgent(userAgent: string): boolean {
  return /android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos/i.test(userAgent)
}

/** Input sanitize хийх */
export function sanitize(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

/** Цэс тохируулах: НӨАТ тооцоолол */
export function calcNoat(amount: number): number {
  return Math.floor((amount * 10) / 100)
}

/** Гишүүнчлэлийн хямдрал */
export function calcMemberDiscount(amount: number, percent: number): number {
  return Math.floor((amount * percent) / 100)
}
