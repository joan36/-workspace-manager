import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/login")

  return (
    <div style={{ minHeight:"100vh", background:"#f9fafb", padding:24 }}>
      {children}
    </div>
  )
}