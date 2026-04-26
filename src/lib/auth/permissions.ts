export interface UserPermissions {
  canAccess: boolean
  canSuspend: boolean
  canEditSignature: boolean
  canDelegate: boolean
  canViewAudit: boolean
}

// ⚠️ Cambia estos nombres por los grupos reales de tu AD
const GROUP_PERMISSIONS: Record<string, string[]> = {
  "GRP_IT_Admins":   ["canAccess","canSuspend","canEditSignature","canDelegate","canViewAudit"],
  "GRP_IT_Helpdesk": ["canAccess","canEditSignature","canDelegate"],
  "GRP_IT_ReadOnly": ["canAccess"],
}

export function getPermissionsFromGroups(
  groups: string[]
): UserPermissions {
  const perms = new Set<string>()
  for (const group of groups) {
    const granted = GROUP_PERMISSIONS[group] ?? []
    granted.forEach(p => perms.add(p))
  }
  return {
    canAccess:        perms.has("canAccess"),
    canSuspend:       perms.has("canSuspend"),
    canEditSignature: perms.has("canEditSignature"),
    canDelegate:      perms.has("canDelegate"),
    canViewAudit:     perms.has("canViewAudit"),
  }
}