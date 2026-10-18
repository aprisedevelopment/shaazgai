'use client'
import { SessionProvider } from 'next-auth/react'
import { ToastProvider } from '@/components/ui/Toast'

import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        {children}
        <Toaster richColors position="top-right" />
      </ToastProvider>
    </SessionProvider>
  )
}
