import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      groups: string[]
      permissions: {
        canAccess: boolean
        canSuspend: boolean
        canEditSignature: boolean
        canDelegate: boolean
        canViewAudit: boolean
      }
    }
  }
  interface User {
    groups: string[]
    permissions: Record<string, boolean>
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    groups: string[]
    permissions: Record<string, boolean>
  }
}