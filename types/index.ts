// ==========================================
// TUGEELT.MN — TypeScript Types
// ==========================================

export interface Product {
  id: number
  kod: string
  title: string
  body?: string
  image?: string
  une: number
  unehuuchin: number
  ontsloh: number
  duussan: number
  options?: string
  comments: number
  video?: string
  hurgelt: number
  catvars?: string
  nemsen: number
  publish: number
  photos?: Photo[]
  discountPercent?: number
}

export interface Photo {
  id: number
  bid: number
  image: string
  name?: string
  mainphoto: number
}

export interface Category {
  id: number
  title: string
  cat: number
  image?: string | null
  publish: number
  list_order: number
  children?: Category[]
}

export interface CartItem {
  id: number
  sesid: string
  bid: number
  hed: number
  songolt?: string
  ognoo: number
  product?: Product
}

export interface CartDelivery {
  id: number
  sesid: string
  gazar: number
  une: number
}

export interface DeliveryZone {
  id: number
  title: string
  une: number
  unegui: number
}

export interface Order {
  id: number
  zid: number
  sesid: string
  ner?: string
  utas1?: string
  utas2?: string
  ognoo?: string
  tsag?: string
  hayag?: string
  comment?: string
  tolbor_helber: number
  noat: number
  niitdun?: string
  tolov: number
  tolbor_tolson: string
  ajiltan: number
  ognoo2: number
  details?: OrderDetail[]
}

export interface OrderDetail {
  id: number
  zid: number
  bid: number
  title?: string
  kod?: string
  hed: number
  une: number
  songolt?: string
}

export interface User {
  id: number
  ner: string
  email: string
  pass: string
  huis: number
  birthday?: string
  utas?: string
  utas2?: string
  hayag?: string
  image?: string
  active: number
  active_kod?: string
  hyamdral: number
  ajiltan: number
  torol: number
  regognoo: number
}

export interface Comment {
  id: number
  bid: number
  userid: number
  ner?: string
  comment?: string
  replyid: number
  ipadd?: string
  ognoo: number
  user?: Pick<User, 'id' | 'ner' | 'image'>
  replies?: Comment[]
}

export interface Banner {
  id: number
  cat: number
  title?: string
  image?: string
  holboos?: string
  publish: number
}

export interface Page {
  id: number
  title: string
  purl: string
  body?: string | null
  publish: number
  list_order: number
}

// Cart Store Types
export interface CartStoreItem {
  productId: number
  kod: string
  title: string
  image?: string
  une: number
  hed: number
  songolt?: string
}

export interface CartState {
  items: CartStoreItem[]
  deliveryZoneId: number
  deliveryUne: number
  noat: boolean
  addItem: (item: CartStoreItem) => void
  removeItem: (productId: number) => void
  updateQty: (productId: number, hed: number) => void
  setDelivery: (zoneId: number, une: number) => void
  toggleNoat: () => void
  clearCart: () => void
  totalItems: () => number
  subtotal: () => number
  total: () => number
}

// Payment Types
export type PaymentMethod = 1 | 2 | 4 | 5 | 6 | 7 | 8
export type PaymentMethodLabel = 'cash' | 'transfer' | 'qpay' | 'golomt' | 'socialpay' | 'hipay' | 'lendmn'

export interface PaymentMethodInfo {
  value: PaymentMethod
  label: string
  description: string
  icon: string
}

export interface CheckoutFormData {
  ner: string
  utas1: string
  utas2: string
  ognoo: string
  tsag: string
  hayag: string
  comment: string
  tolbor_helber: PaymentMethod
  noat: boolean
}

export interface QPayResponse {
  result_code: string
  json_data?: {
    invoice_id: string
    qPay_QRcode: string
    qPay_QRimage: string
    qPay_url: string
  }
}

export interface LendMNResponse {
  status: 'ok' | 'error'
  invoice_id?: string
  qrimg?: string
  qrlink?: string
  text?: string
}

export interface HiPayResponse {
  requestId: string
  checkoutId: string
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  perPage: number
  hasMore: boolean
  lastId?: number
}

// Filter Types
export type FilterType = '1' | '2' | '3' | '4' | '5'
export const FILTER_LABELS: Record<FilterType, string> = {
  '1': 'Онцлох бараа',
  '2': 'Хямдарсан',
  '3': 'Шинэ',
  '4': 'Шилдэг',
  '5': 'Хүргэлт үнэгүй',
}

// Admin Types
export interface Admin {
  id: number
  username: string
  password: string
  level: number
  perm?: string
}

export interface DashboardStats {
  totalOrders: number
  newOrders: number
  totalRevenue: number
  totalProducts: number
  totalUsers: number
}
