import ldap from "ldapjs"

const LDAP_URI  = process.env.LDAP_URI!
const BASE_DN   = process.env.LDAP_BASE_DN!
const BIND_DN   = process.env.LDAP_BIND_DN!
const BIND_PASS = process.env.LDAP_BIND_PASSWORD!

function createClient() {
  return ldap.createClient({
    url: LDAP_URI,
    tlsOptions: { rejectUnauthorized: false },
    timeout: 5000,
  })
}

export async function authenticateWithLdap(
  username: string,
  password: string
) {
  const userDn = username.includes("@")
    ? username
    : `${username}@${process.env.AD_DOMAIN}`

  return new Promise<any>((resolve) => {
    const client = createClient()
    client.bind(userDn, password, (err) => {
      if (err) { client.destroy(); return resolve(null) }
      client.search(BASE_DN, {
        filter: `(userPrincipalName=${userDn})`,
        scope: "sub",
        attributes: ["dn","sAMAccountName","displayName","mail"],
      }, (err, res) => {
        if (err) { client.destroy(); return resolve(null) }
        let user: any = null
        res.on("searchEntry", e => { user = e.object })
        res.on("end", () => { client.destroy(); resolve(user) })
      })
    })
  })
}

export async function getUserGroups(userDn: string) {
  return new Promise<string[]>((resolve) => {
    const client = createClient()
    client.bind(BIND_DN, BIND_PASS, (err) => {
      if (err) { client.destroy(); return resolve([]) }
      client.search(BASE_DN, {
        filter: `(member:1.2.840.113556.1.4.1941:=${userDn})`,
        scope: "sub",
        attributes: ["cn"],
      }, (err, res) => {
        if (err) { client.destroy(); return resolve([]) }
        const groups: string[] = []
        res.on("searchEntry", e => groups.push(e.object.cn as string))
        res.on("end", () => { client.destroy(); resolve(groups) })
      })
    })
  })
}