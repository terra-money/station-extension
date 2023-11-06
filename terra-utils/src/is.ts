import { AccAddress } from "@terra-money/feather.js"
import currencies from "./currencies.json"

/* -------------------------------- Is Denom -------------------------------- */

// The cheqd blockchain uses the "n" prefix for the minimal
// denomination instead of the standard "u" prefix.
const isDenomCheq = (string = "") => string === "ncheq"
const isDenomStride = (string = "") => string.startsWith("stu")
const isNoPrefixToken = (string = "") => ["aarch", "inj"].includes(string)
const isCW20Token = (string = "") => AccAddress.validate(string)

export const isDenomFactory = (string = "") => string.startsWith("factory/")
export const isDenomGamm = (string = "") => string.startsWith("gamm/")
export const isDenomIBC = (string = "") => string.startsWith("ibc/")

export const isDenom = (string = "") =>
  string.startsWith("u") ||
  isDenomCheq(string) ||
  isDenomStride(string) ||
  isNoPrefixToken(string) ||
  isCW20Token(string) ||
  isDenomFactory(string) ||
  isDenomGamm(string) ||
  isDenomIBC(string)

/* ----------------------------- Is Denom Terra ----------------------------- */

export const isDenomLuna = (string = "") => string === "uluna"
export const isDenomTerra = (string = "") =>
  string.startsWith("u") &&
  string.length === 4 &&
  currencies.includes(string.slice(1).toUpperCase())

export const isDenomTerraNative = (string = "") =>
isDenomLuna(string) || isDenomTerra(string)
