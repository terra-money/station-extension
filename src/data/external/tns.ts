import { Buffer } from "buffer"
import keccak256 from "keccak256"
import { TerraContracts } from "../Terra/TerraAssets"
import { LCDClient } from "@terra-money/terra.js"

/**
 * Resolve terra address from a domain name.
 *
 * @param name - A TNS identifier such as "alice.ust"
 * @returns The terra address of the specified name, null if not resolvable
 */
export async function resolveTnsAddress(
  lcd: LCDClient,
  contracts: TerraContracts | undefined,
  name: string
) {
  if (!contracts) return

  const { tnsRegistry: registry } = contracts

  if (!registry) return

  /**
   * Get the resolver address of a given domain name.
   *
   * @param name - A TNS identifier such as "alice.ust"
   * @returns The Resolver contract address of the specified name, null if the domain does not exist.
   *
   * @see https://docs.ens.domains/#ens-architecture for the role of Resolver Contract
   */
  const { resolver } = await lcd.wasm.contractQuery<{ resolver: string }>(
    registry,
    { get_record: { name } }
  )

  if (!resolver) return

  const { address } = await lcd.wasm.contractQuery<{ address: string }>(
    resolver,
    { get_terra_address: { node: node(name) } }
  )

  return address
}

/**
 * Resolve TNS name from a terra address.
 *
 * @param address - A terra address
 * @returns The TNS name of the specified address, null if not resolvable
 */
export async function resolveTnsName(
  lcd: LCDClient,
  contracts: TerraContracts | undefined,
  address: string
) {
  if (!contracts || !address) return

  const { tnsReverseRecord: reverseRecord } = contracts

  if (!reverseRecord) return

  const { name } = await lcd.wasm.contractQuery<{ name: string | null }>(
    reverseRecord,
    { get_name: { address } }
  )

  return name
}

/**
 * Generate a unique hash for any valid domain name.
 *
 * @param name - A TNS identifier such as "alice.ust"
 * @returns The result of namehash function in a {@link Buffer} form
 *
 * @see https://docs.ens.domains/contract-api-reference/name-processing#hashing-names
 * for ENS Terminology
 *
 * @see https://eips.ethereum.org/EIPS/eip-137#namehash-algorithm
 * for namehash algorithm specification proposed in EIP-137
 */
function namehash(name: string): Buffer {
  if (name) {
    const [label, remainder] = name.split(".")
    return keccak256(Buffer.concat([namehash(remainder), keccak256(label)]))
  }

  return Buffer.from("".padStart(64, "0"), "hex")
}

/**
 * Generate the output of the namehash function in a form of number array
 * which is supported by the contract query.
 *
 * @param name - A TNS identifier such as "alice.ust"
 * @returns The result of namehash function in a number array format
 */
function node(name: string): number[] {
  return Array.from(Uint8Array.from(namehash(name)))
}
