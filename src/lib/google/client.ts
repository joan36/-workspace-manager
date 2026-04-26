import { google } from "googleapis"
import { readFileSync } from "fs"

const SCOPES = [
  "https://www.googleapis.com/auth/admin.directory.user",
  "https://www.googleapis.com/auth/admin.directory.user.readonly",
  "https://www.googleapis.com/auth/gmail.settings.basic",
  "https://www.googleapis.com/auth/gmail.settings.sharing",
]

function getServiceAccountKey() {
  const keyPath = process.env.GOOGLE_SA_KEY_PATH
  if (keyPath) return JSON.parse(readFileSync(keyPath, "utf-8"))
  throw new Error("GOOGLE_SA_KEY_PATH no configurado en .env.local")
}

export function getAdminClient(impersonateEmail?: string) {
  const key = getServiceAccountKey()
  return new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: SCOPES,
    subject: impersonateEmail ?? process.env.GOOGLE_ADMIN_EMAIL!,
  })
}

export function getDirectoryService() {
  return google.admin({ version: "directory_v1", auth: getAdminClient() })
}

export function getGmailService(userEmail: string) {
  return google.gmail({ version: "v1", auth: getAdminClient(userEmail) })
}