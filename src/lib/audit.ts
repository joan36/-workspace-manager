import { prisma } from "./prisma"
import { AuditAction } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth/config"
import { headers } from "next/headers"

export { AuditAction }

export async function logAction(
  action: AuditAction,
  targetEmail: string,
  details?: Record<string, unknown>
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return

  const headersList = headers()
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0] ??
    headersList.get("x-real-ip") ??
    "desconocida"

  await prisma.auditLog.create({
    data: {
      actorEmail: session.user.email!,
      actorName: session.user.name!,
      targetEmail,
      action,
      details: details ?? {},
      ipAddress: ip,
    },
  })
}