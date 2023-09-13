import { RHS_URL } from "../Constants"
import { ExtensionService } from "./Extension.service"
import { core, CredentialStatusType } from "@0xpolygonid/js-sdk"
export class IdentityServices {
  static async createIdentity() {
    const { wallet } = ExtensionService.getExtensionServiceInstance()

    let identity = await wallet.createIdentity({
      method: core.DidMethod.PolygonId,
      blockchain: core.Blockchain.Polygon,
      networkId: core.NetworkId.Mumbai,
      revocationOpts: {
        type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
        id: RHS_URL,
      },
    })
    return identity
  }
}
