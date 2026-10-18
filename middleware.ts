import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
  const token = await getToken({ req, secret })
  const isLoggedIn = !!token

  // If already logged in as admin and visiting login page, redirect to dashboard
  if (pathname === '/admin/login' && isLoggedIn && token?.role === 'admin') {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  // Admin routes - require admin role
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!isLoggedIn || token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  // Employee/user protected routes
  if (pathname.startsWith('/user/edit') || pathname.startsWith('/user/orders') || pathname.startsWith('/user/products')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/user/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/user/edit', '/user/orders/:path*', '/user/products/:path*'],
}
