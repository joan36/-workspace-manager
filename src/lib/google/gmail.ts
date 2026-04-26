import { getGmailService } from "./client"

export async function getUserSignature(email: string) {
  const gmail = getGmailService(email)
  const res = await gmail.users.settings.sendAs.list({ userId: "me" })
  const primary = res.data.sendAs?.find(sa => sa.isPrimary)
  return {
    signature: primary?.signature ?? "",
    sendAsEmail: primary?.sendAsEmail ?? email,
  }
}

export async function updateUserSignature(email: string, signature: string) {
  const gmail = getGmailService(email)
  const res = await gmail.users.settings.sendAs.list({ userId: "me" })
  const primary = res.data.sendAs?.find(sa => sa.isPrimary)
  if (!primary?.sendAsEmail) throw new Error("No se encontró dirección primaria")
  await gmail.users.settings.sendAs.update({
    userId: "me",
    sendAsEmail: primary.sendAsEmail,
    requestBody: { signature },
  })
}

export async function getDelegates(email: string) {
  const gmail = getGmailService(email)
  const res = await gmail.users.settings.delegates.list({ userId: "me" })
  return res.data.delegates ?? []
}

export async function addDelegate(ownerEmail: string, delegateEmail: string) {
  const gmail = getGmailService(ownerEmail)
  await gmail.users.settings.delegates.create({
    userId: "me",
    requestBody: { delegateEmail },
  })
}

export async function removeDelegate(ownerEmail: string, delegateEmail: string) {
  const gmail = getGmailService(ownerEmail)
  await gmail.users.settings.delegates.delete({
    userId: "me",
    delegateEmail,
  })
}