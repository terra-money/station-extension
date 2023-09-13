export interface Account {
  name: string
  did: string
  isActive: boolean
}

export class LocalStorageServices {
  static hasAccounts() {
    let accounts = JSON.parse(localStorage.getItem("accounts") as string)
    return accounts === null || accounts.length === 0
  }

  static getActiveAccount() {
    let allAccounts = JSON.parse(
      localStorage.getItem("accounts") as string
    ) as Account[]
    if (allAccounts == null) {
      return null
    }
    const accounts = allAccounts.filter((acc: any) => acc.isActive)
    if (accounts.length == 0) {
      return null
    }
    return accounts[0]
  }
  static getActiveAccountDid() {
    let activeAccount = LocalStorageServices.getActiveAccount()
    if (activeAccount === null) {
      return null
    }
    return activeAccount.did
  }

  static saveAccount(name: string, did: string, isActive = false) {
    let allAccounts: Account[] = JSON.parse(
      localStorage.getItem("accounts") as string
    )
    const account: Account = {
      name,
      did,
      isActive,
    }
    if (allAccounts === null) {
      allAccounts = [account]
    } else {
      if (isActive) {
        allAccounts = allAccounts.map((a) => {
          a.isActive = false
          return a
        })
      }
      allAccounts.push(account)
    }
    localStorage.setItem("accounts", JSON.stringify(allAccounts))
  }

  static getAccountByName(name: string): Account | null {
    let allAccounts: Account[] = JSON.parse(
      localStorage.getItem("accounts") as string
    )
    if (allAccounts === null) {
      return null
    }
    const accounts = allAccounts.filter((a) => a.name === name)
    if (accounts.length > 0) {
      return accounts[0]
    } else {
      return null
    }
  }

  static getAllAccounts(): Array<Account> {
    let allAccounts: Account[] = JSON.parse(
      localStorage.getItem("accounts") as string
    )
    if (allAccounts == null) {
      return []
    } else {
      return allAccounts
    }
  }

  static activateAccount(did: string) {
    let allAccounts: Account[] = JSON.parse(
      localStorage.getItem("accounts") as string
    )
    if (allAccounts == null || allAccounts.length === 0) {
      return null
    }
    allAccounts = allAccounts.map((a) => {
      if (a.did === did) {
        a.isActive = true
      } else {
        a.isActive = false
      }
      return a
    })
    localStorage.setItem("accounts", JSON.stringify(allAccounts))
  }
}
