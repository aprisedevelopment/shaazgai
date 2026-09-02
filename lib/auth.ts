import { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './db'

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        isAdmin: { label: 'IsAdmin', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const isAdmin = credentials.isAdmin === 'true'

        if (isAdmin) {
          // Admin login
          const admin = await prisma.admin.findUnique({
            where: { username: credentials.email as string },
          })
          if (!admin) return null
          
          let valid = false
          if (admin.password.startsWith('$2')) {
            valid = await bcrypt.compare(credentials.password as string, admin.password)
          } else {
            const md5 = (await import('md5')).default
            const hash = md5(credentials.password as string)
            valid = hash === admin.password
            if (valid) {
              const newHash = await bcrypt.hash(credentials.password as string, 12)
              await prisma.admin.update({ where: { id: admin.id }, data: { password: newHash } })
            }
          }

          if (!valid) return null
          return {
            id: `admin-${admin.id}`,
            name: admin.username,
            email: admin.username,
            role: 'admin',
            level: admin.level,
            perm: admin.perm,
          }
        }

        // User login
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user) return null

        // Support both bcrypt and legacy MD5 hashes
        let valid = false
        if (user.pass.startsWith('$2')) {
          valid = await bcrypt.compare(credentials.password as string, user.pass)
        } else {
          // Legacy MD5 — compare and upgrade on login
          const md5 = (await import('md5')).default
          const hash = md5(credentials.password as string)
          valid = hash === user.pass
          if (valid) {
            // Upgrade to bcrypt
            const newHash = await bcrypt.hash(credentials.password as string, 12)
            await prisma.user.update({ where: { id: user.id }, data: { pass: newHash } })
          }
        }

        if (!valid) return null

        return {
          id: String(user.id),
          name: user.ner,
          email: user.email,
          role: user.ajiltan === 1 ? 'employee' : 'user',
          hyamdral: user.hyamdral,
          active: user.active,
          torol: user.torol,
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/user/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.hyamdral = (user as any).hyamdral
        token.active = (user as any).active
        token.torol = (user as any).torol
        token.level = (user as any).level
        token.perm = (user as any).perm
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub
        ;(session.user as any).role = token.role
        ;(session.user as any).hyamdral = token.hyamdral
        ;(session.user as any).active = token.active
        ;(session.user as any).torol = token.torol
        ;(session.user as any).level = token.level
        ;(session.user as any).perm = token.perm
      }
      return session
    },
  },
}
