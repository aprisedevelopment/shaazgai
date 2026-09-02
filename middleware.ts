import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isLoggedIn = !!token

  // Admin routes - require admin role
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!isLoggedIn || token.role !== 'admin') {
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
