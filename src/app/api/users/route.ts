import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"

export async function GET(
  _req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const email = decodeURIComponent(params.userId)

  // Temporal: devuelve datos de prueba hasta conectar Google API
  return NextResponse.json({
    primaryEmail: email,
    name: { fullName: "Maria Garcia Lopez" },
    suspended: false,
    orgUnitPath: "/Ventas/Barcelona",
    creationTime: "2021-03-12T10:00:00Z",
    lastLoginTime: new Date().toISOString(),
    isEnrolledIn2Sv: true,
    thumbnailPhotoUrl: null,
  })
}