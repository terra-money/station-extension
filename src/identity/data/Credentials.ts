import { W3CCredential } from "@0xpolygonid/js-sdk"
import { o } from "ramda"

export abstract class Credential {
  abstract getDid(): string
  abstract getValue(): string
  abstract getType(): string
  abstract shouldDisplay(): boolean
  abstract getId(): string

  static parseCredentialData(data: W3CCredential): Credential {
    if (data.type[1] === "POAP01") {
      return new CityPoapCredential(data)
    } else {
      return new UnknownCredential(data)
    }
  }
}

class CityPoapCredential implements Credential {
  private w3credential: W3CCredential
  constructor(w3credential: W3CCredential) {
    this.w3credential = w3credential
  }
  getId(): string {
    return this.w3credential.id as string
  }
  getDid(): string {
    return this.w3credential.credentialSubject.id as string
  }
  getValue(): string {
    return this.w3credential.credentialSubject.city as string
  }
  getType(): string {
    return "POAP (city)"
  }
  shouldDisplay(): boolean {
    return true
  }
}

class UnknownCredential implements Credential {
  private w3credential: W3CCredential
  constructor(w3credential: W3CCredential) {
    this.w3credential = w3credential
  }
  getId(): string {
    return this.w3credential.id
  }
  getDid(): string {
    throw new Error("Method not implemented.")
  }
  getValue(): string {
    throw new Error("Method not implemented.")
  }
  getType(): string {
    throw new Error("Method not implemented.")
  }
  shouldDisplay(): boolean {
    return false
  }
}
