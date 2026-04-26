import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        // Temporal: acepta cualquier login para probar la UI
        // Luego conectamos con AD real
        if (credentials?.username && credentials?.password) {
          return {
            id: "1",
            name: "Usuario Test",
            email: credentials.username,
            groups: [],
            permissions: {
              canAccess: true,
              canSuspend: true,
              canEditSignature: true,
              canDelegate: true,
              canViewAudit: true,
            },
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.groups = (user as any).groups
        token.permissions = (user as any).permissions
      }
      return token
    },
    async session({ session, token }) {
      session.user.groups = token.groups as string[]
      session.user.permissions = token.permissions as any
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
}