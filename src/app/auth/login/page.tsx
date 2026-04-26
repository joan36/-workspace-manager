"use client"

import { signIn } from "next-auth/react"
import { useState, FormEvent, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const params = useSearchParams()
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard"

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const form = new FormData(e.currentTarget)
    const result = await signIn("credentials", {
      username: form.get("username"),
      password: form.get("password"),
      redirect: false,
    })
    if (result?.error) {
      setError("Credenciales incorrectas o sin acceso")
      setLoading(false)
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <div style={{ minHeight:"100vh", display:"grid", gridTemplateColumns:"1fr 1fr" }}>

      {/* Izquierda */}
      <div style={{ background:"white", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"48px 40px", borderRight:"0.5px solid #e5e7eb" }}>
        <div style={{ width:72, height:72, background:"#EFF6FF", borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>
          <svg width="36" height="36" fill="none" stroke="#2563eb" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div style={{ fontSize:22, fontWeight:500, color:"#111827", marginBottom:8, textAlign:"center" }}>
          Workspace Manager
        </div>
        <div style={{ fontSize:13, color:"#6b7280", textAlign:"center", lineHeight:1.6, maxWidth:260 }}>
          Panel de administracion para Google Workspace
        </div>
      </div>

      {/* Derecha */}
      <div style={{ background:"#f9fafb", display:"flex", alignItems:"center", justifyContent:"center", padding:40 }}>
        <div style={{ background:"white", borderRadius:16, border:"0.5px solid #e5e7eb", padding:"36px 32px", width:"100%", maxWidth:380 }}>

          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:20, fontWeight:500, color:"#111827", marginBottom:6 }}>Bienvenido</div>
            <div style={{ fontSize:13, color:"#6b7280", lineHeight:1.5 }}>Accede con tus credenciales corporativas de Active Directory</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:12, fontWeight:500, color:"#374151", marginBottom:6 }}>
                Usuario
              </label>
              <input
                name="username"
                type="text"
                placeholder="usuario@empresa.com"
                required
                style={{ width:"100%", padding:"9px 12px", border:"0.5px solid #d1d5db", borderRadius:8, fontSize:13, color:"#111827", background:"white", outline:"none" }}
              />
              <div style={{ fontSize:11, color:"#9ca3af", marginTop:4 }}>
                Usa tu email corporativo o nombre de usuario de AD
              </div>
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:12, fontWeight:500, color:"#374151", marginBottom:6 }}>
                Contrasena
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••••"
                required
                style={{ width:"100%", padding:"9px 12px", border:"0.5px solid #d1d5db", borderRadius:8, fontSize:13, color:"#111827", background:"white", outline:"none" }}
              />
            </div>

            {error && (
              <div style={{ background:"#FEF2F2", border:"0.5px solid #FCA5A5", borderRadius:8, padding:"9px 12px", fontSize:12, color:"#B91C1C", marginBottom:12 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width:"100%", padding:10, background: loading ? "#93c5fd" : "#2563eb", color:"white", border:"none", borderRadius:8, fontSize:14, fontWeight:500, cursor: loading ? "not-allowed" : "pointer", marginTop:8, transition:"background 0.15s" }}
            >
              {loading ? "Accediendo..." : "Acceder"}
            </button>
          </form>

          {/* Badge AD */}
          <div style={{ display:"flex", alignItems:"center", gap:10, margin:"20px 0", fontSize:11, color:"#9ca3af" }}>
            <div style={{ flex:1, height:"0.5px", background:"#e5e7eb" }} />
            autenticado contra
            <div style={{ flex:1, height:"0.5px", background:"#e5e7eb" }} />
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", border:"0.5px solid #e5e7eb", borderRadius:8 }}>
            <div style={{ width:20, height:20, background:"#0078d4", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight:500, fontSize:12, color:"#111827" }}>Active Directory</div>
              <div style={{ fontSize:11, color:"#6b7280" }}>{process.env.NEXT_PUBLIC_AD_DOMAIN ?? "empresa.com"} · LDAP</div>
            </div>
          </div>

          <div style={{ marginTop:20, fontSize:11, color:"#9ca3af", textAlign:"center", lineHeight:1.5 }}>
            Si no puedes acceder, contacta con el administrador de sistemas
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}