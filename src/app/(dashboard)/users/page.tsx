"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>()
  const { data: session } = useSession()
  const router = useRouter()
  const email = decodeURIComponent(userId)

  const [gwUser, setGwUser] = useState<any>(null)
  const [adUser, setAdUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"info" | "signature" | "delegate">("info")

  const perms = session?.user?.permissions ?? {}

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const gwRes = await fetch(`/api/users/${encodeURIComponent(email)}`)
      if (gwRes.ok) setGwUser(await gwRes.json())
    } catch (e) {}
    setLoading(false)
  }, [email])

  useEffect(() => { load() }, [load])

  const initials = gwUser?.name?.fullName
    ?.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() ?? "??"

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <div style={{ width: 28, height: 28, border: "2px solid #2563eb", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!gwUser) return (
    <div style={{ textAlign: "center", padding: "4rem", color: "#6b7280" }}>
      Usuario no encontrado
    </div>
  )

  return (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>

      {/* Volver */}
      <button
        onClick={() => router.back()}
        style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6b7280", background: "none", border: "none", cursor: "pointer", marginBottom: 16, padding: 0 }}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
        Volver a usuarios
      </button>

      {/* Hero */}
      <div style={{ background: "white", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "24px", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* Avatar grande */}
            {gwUser.thumbnailPhotoUrl ? (
              <img
                src={gwUser.thumbnailPhotoUrl}
                style={{ width: 80, height: 80, borderRadius: "50%", border: "2px solid #BFDBFE", objectFit: "cover" }}
                alt=""
              />
            ) : (
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#DBEAFE", border: "2px solid #BFDBFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 500, color: "#1D4ED8", flexShrink: 0 }}>
                {initials}
              </div>
            )}
            <div>
              <div style={{ fontSize: 18, fontWeight: 500, color: "#111827", marginBottom: 3 }}>
                {gwUser.name?.fullName}
              </div>
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
                {gwUser.primaryEmail}
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: gwUser.suspended ? "#FEE2E2" : "#DCFCE7", color: gwUser.suspended ? "#B91C1C" : "#15803D" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                {gwUser.suspended ? "Suspendida" : "Cuenta activa"}
              </span>
            </div>
          </div>

          {/* Acciones */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {perms.canEditSignature && (
              <button onClick={() => setActiveTab("signature")} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "0.5px solid #d1d5db", background: "white", color: "#111827" }}>
                Editar firma
              </button>
            )}
            {perms.canDelegate && (
              <button onClick={() => setActiveTab("delegate")} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "0.5px solid #d1d5db", background: "white", color: "#111827" }}>
                Gestionar delegados
              </button>
            )}
            {perms.canSuspend && (
              <button
                onClick={async () => {
                  await fetch(`/api/users/${encodeURIComponent(email)}/suspend`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: gwUser.suspended ? "activate" : "suspend" }),
                  })
                  load()
                }}
                style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "0.5px solid #FCA5A5", background: "#FEF2F2", color: "#B91C1C" }}
              >
                {gwUser.suspended ? "Activar cuenta" : "Suspender cuenta"}
              </button>
            )}
          </div>
        </div>

        {/* Barra de resumen rápido */}
        <div style={{ display: "flex", gap: 28, paddingTop: 16, borderTop: "0.5px solid #e5e7eb", flexWrap: "wrap" }}>
          {[
            ["Unidad org.", gwUser.orgUnitPath ?? "/"],
            ["Creación", gwUser.creationTime ? new Date(gwUser.creationTime).toLocaleDateString("es-ES") : "-"],
            ["Último acceso", gwUser.lastLoginTime ? new Date(gwUser.lastLoginTime).toLocaleDateString("es-ES") : "Nunca"],
            ["2FA", gwUser.isEnrolledIn2Sv ? "Activado" : "Desactivado"],
          ].map(([label, val]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "0.5px solid #e5e7eb", marginBottom: 14 }}>
        {[
          { id: "info", label: "Información" },
          { id: "signature", label: "Firma de correo" },
          { id: "delegate", label: "Delegación" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{ padding: "9px 16px", fontSize: 13, cursor: "pointer", background: "none", border: "none", borderBottom: activeTab === tab.id ? "2px solid #2563eb" : "2px solid transparent", color: activeTab === tab.id ? "#2563eb" : "#6b7280", fontWeight: activeTab === tab.id ? 500 : 400, marginBottom: -0.5 }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab info */}
      {activeTab === "info" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {/* Google Workspace */}
          <div style={{ background: "white", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 12, display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: "#DBEAFE", flexShrink: 0 }} />
              Google Workspace
            </div>
            {[
              ["Email", gwUser.primaryEmail, true],
              ["Unidad org.", gwUser.orgUnitPath ?? "/", false],
              ["Creación", gwUser.creationTime ? new Date(gwUser.creationTime).toLocaleDateString("es-ES") : "-", false],
              ["Último acceso", gwUser.lastLoginTime ? new Date(gwUser.lastLoginTime).toLocaleDateString("es-ES") : "Nunca", false],
              ["2FA", gwUser.isEnrolledIn2Sv ? "Activado" : "Desactivado", false],
            ].map(([label, val, blue]) => (
              <div key={label as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "0.5px solid #f3f4f6", fontSize: 12 }}>
                <span style={{ color: "#6b7280" }}>{label as string}</span>
                <span style={{ fontWeight: 500, color: blue ? "#2563eb" : "#111827", textAlign: "right" }}>{val as string}</span>
              </div>
            ))}
          </div>

          {/* Active Directory */}
          <div style={{ background: "white", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 12, display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: "#EDE9FE", flexShrink: 0 }} />
              Active Directory
            </div>
            {adUser ? [
              ["Departamento", adUser.department],
              ["Cargo", adUser.title],
              ["Oficina", adUser.physicalDeliveryOfficeName],
              ["Teléfono", adUser.telephoneNumber],
              ["Móvil", adUser.mobile],
              ["Manager", adUser.manager?.split(",")[0]?.replace("CN=", "")],
            ].map(([label, val]) => (
              <div key={label as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "0.5px solid #f3f4f6", fontSize: 12 }}>
                <span style={{ color: "#6b7280" }}>{label as string}</span>
                <span style={{ fontWeight: 500, color: "#111827", textAlign: "right" }}>{val as string ?? "-"}</span>
              </div>
            )) : (
              <p style={{ fontSize: 12, color: "#9ca3af" }}>No se encontró el usuario en AD</p>
            )}
          </div>
        </div>
      )}

      {/* Tab firma */}
      {activeTab === "signature" && (
        <div style={{ background: "white", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
          <p style={{ fontSize: 13, color: "#6b7280" }}>Editor de firma — próximamente</p>
        </div>
      )}

      {/* Tab delegados */}
      {activeTab === "delegate" && (
        <div style={{ background: "white", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
          <p style={{ fontSize: 13, color: "#6b7280" }}>Gestión de delegados — próximamente</p>
        </div>
      )}
    </div>
  )
}