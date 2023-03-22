import currencies from "./currencies.json"

export const isDenomLuna = (string = "") => string === "uluna"

export const isDenomTerra = (string = "") =>
  string.startsWith("u") &&
  string.length === 4 &&
  currencies.includes(string.slice(1).toUpperCase())

export const isDenomIBC = (string = "") => string.startsWith("ibc/")

// The cheqd blockchain uses the "n" prefix for the minimal 
// denomination instead of the standard "u" prefix.
const isDenomCheq = (string = "") => 'ncheq' === string

export const isDenomTerraNative = (string = "") =>
  isDenomLuna(string) || isDenomTerra(string)

export const isDenom = (string = "") =>
  string.startsWith("u") || isDenomCheq(string) || isDenomIBC(string)
