# Workspace Manager

Panel de administración interno para gestionar usuarios de Google Workspace, autenticado contra Active Directory.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)
![License](https://img.shields.io/badge/licencia-privada-red)

---

## Funcionalidades

- **Gestión de usuarios** — Listado, búsqueda y detalle de todos los usuarios del dominio de Google Workspace
- **Autenticación AD** — Login con credenciales corporativas y permisos por grupos de Active Directory
- **Firmas de correo** — Ver y editar la firma HTML de cualquier usuario via Gmail API
- **Suspender cuentas** — Activar y suspender cuentas con un clic y registro de auditoría
- **Delegación de buzón** — Añadir y eliminar delegados de correo entre usuarios del dominio
- **Log de auditoría** — Registro completo de quién hizo qué y cuándo, con IP y detalles

---

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| Next.js 16 | Frontend + API Routes |
| NextAuth.js | Autenticación |
| PostgreSQL | Base de datos de auditoría |
| Prisma ORM | Acceso a base de datos |
| ldapjs | Conexión con Active Directory |
| Google Admin SDK | Google Workspace API |
| TypeScript | Tipado estático |
| Tailwind CSS | Estilos |

---

## Despliegue local

**1. Clonar el repositorio**
```bash
git clone https://github.com/joan36/workspace-manager.git
cd workspace-manager
```

**2. Instalar dependencias**
```bash
npm install
```

**3. Configurar variables de entorno**
```bash
cp .env.example .env.local
# Edita .env.local con tus valores reales
```

**4. Crear las tablas en la base de datos**
```bash
npx prisma migrate deploy
```

**5. Arrancar el servidor**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Variables de entorno

| Variable | Descripción | Requerida |
|---|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL | ✅ |
| `NEXTAUTH_SECRET` | Secret para firmar sesiones JWT | ✅ |
| `NEXTAUTH_URL` | URL base de la app | ✅ |
| `LDAP_URI` | URI del controlador de dominio | ✅ |
| `LDAP_BASE_DN` | Base DN del dominio AD | ✅ |
| `LDAP_BIND_DN` | DN de la cuenta de servicio AD | ✅ |
| `LDAP_BIND_PASSWORD` | Password de la cuenta de servicio | ✅ |
| `AD_DOMAIN` | Dominio de Active Directory | ✅ |
| `GOOGLE_WORKSPACE_DOMAIN` | Dominio de Google Workspace | ✅ |
| `GOOGLE_ADMIN_EMAIL` | Email del admin de Workspace | ✅ |
| `GOOGLE_SA_KEY_PATH` | Ruta al JSON de la Service Account | ✅ |
| `REDIS_URL` | URL de Redis para caché | ⬜ opcional |

---

## Estructura del proyecto

src/
├── app/
│   ├── api/              # API Routes (backend)
│   ├── auth/             # Páginas de login
│   └── (dashboard)/      # Páginas protegidas
├── components/           # Componentes React
├── lib/                  # Lógica de negocio
│   ├── auth/             # NextAuth + LDAP
│   └── google/           # Google Admin SDK
└── types/                # Tipos TypeScript

---

## Control de acceso

El acceso se controla mediante grupos de Active Directory configurados en `src/lib/auth/permissions.ts`:

| Grupo AD | Permisos |
|---|---|
| `GRP_IT_Admins` | Acceso total + auditoría |
| `GRP_IT_Helpdesk` | Ver usuarios, editar firmas, delegar |
| `GRP_IT_ReadOnly` | Solo lectura |

---

> Acceso restringido a personal autorizado. Para problemas de acceso contacta con el administrador de sistemas.