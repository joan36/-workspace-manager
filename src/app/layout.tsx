import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/components/layout/AuthProvider"

export const metadata: Metadata = {
  title: "Workspace Manager",
  description: "Workspace Manager",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}