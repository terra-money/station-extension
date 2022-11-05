import keccak256 from "keccak256"
import { LCDClient } from "@terra-money/terra.js"

const CONTRACTS = {
  luna: "terra16a6qkmxpqzeyez8gh3w7qhrk7x3xe3arlv9nwfg944y8vzg9smrqntark3",
  lunc: "terra1c26skq575mejc6p5jamag3lfcxrnny80jpte76",
}

type LnsTLD = "luna" | "lunc"

function getTldFromNetworkName(networkName: string): LnsTLD {
  if (networkName === "classic") {
    return "lunc"
  }
  return "luna"
}

/**
 * Resolve terra address from a domain name.
 *
 * @param name - A LNS identifier such as "alice.luna"
 * @returns The terra address of the specified name, null if not resolvable
 */
export async function resolveLnsAddress(
  lcd: LCDClient,
  tld: LnsTLD,
  name: string
) {
  const { owner } = await lcd.wasm.contractQuery<{ owner: string }>(
    CONTRACTS[tld],
    { domain_info: { token_id: getTokenId(name, tld) } }
  )

  return owner
}

/**
 * Resolve LNS name from a terra address.
 *
 * @param address - A terra address
 * @returns The LNS name of the specified address, null if not resolvable
 */
export async function resolveLnsName(
  lcd: LCDClient,
  networkName: string,
  address: string
) {
  const tld = getTldFromNetworkName(networkName)
  const { name } = await lcd.wasm.contractQuery<{ name: string | null }>(
    CONTRACTS[tld],
    { reverse_record: { address } }
  )

  return name
}

function getTokenId(name: string, tld: LnsTLD) {
  return keccak256(name.replace(`.${tld}`, "")).toString("hex")
}
