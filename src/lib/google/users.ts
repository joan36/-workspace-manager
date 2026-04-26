import { getDirectoryService } from "./client"

export async function listWorkspaceUsers() {
  const directory = getDirectoryService()
  const res = await directory.users.list({
    domain: process.env.GOOGLE_WORKSPACE_DOMAIN!,
    maxResults: 500,
    orderBy: "familyName",
    projection: "full",
  })
  return res.data.users ?? []
}

export async function getWorkspaceUser(email: string) {
  const directory = getDirectoryService()
  const res = await directory.users.get({
    userKey: email,
    projection: "full",
  })
  return res.data
}

export async function suspendUser(email: string) {
  const directory = getDirectoryService()
  await directory.users.update({
    userKey: email,
    requestBody: { suspended: true },
  })
}

export async function activateUser(email: string) {
  const directory = getDirectoryService()
  await directory.users.update({
    userKey: email,
    requestBody: { suspended: false },
  })
}