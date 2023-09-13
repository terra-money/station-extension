import * as JWZ from "@iden3/js-jwz"
import { CircuitStorageInstance } from "./CircuitStorage"
import { WalletService } from "./Wallet.service"
import { defaultEthConnectionConfig, INIT } from "../Constants"

import {
  ProofService,
  PlainPacker,
  ZKPPacker,
  DataPrepareHandlerFunc,
  VerificationHandlerFunc,
  PackageManager,
  EthStateStorage,
  AuthHandler,
  CircuitId,
  CircuitData,
  AuthDataPrepareFunc,
  StateVerificationFunc,
  VerificationParams,
  CredentialWallet,
  IdentityWallet,
} from "@0xpolygonid/js-sdk"

export interface ExtensionInstance {
  packageMgr: PackageManager
  proofService: ProofService
  credWallet: CredentialWallet
  wallet: IdentityWallet
  dataStorage: any
  authHandler: AuthHandler
  status: any
}

const { proving } = JWZ
export class ExtensionService {
  static instanceES: ExtensionInstance
  static async init() {
    await CircuitStorageInstance.init()
    let accountInfo = await WalletService.createWallet()
    const { wallet, credWallet, dataStorage } = accountInfo

    const circuitStorage = CircuitStorageInstance.getCircuitStorageInstance()
    if (!circuitStorage) {
      throw Error("circuitStorage undefined")
    }

    let proofService = new ProofService(
      wallet,
      credWallet,
      circuitStorage,
      new EthStateStorage(defaultEthConnectionConfig[0]),
      { ipfsGatewayURL: "https://ipfs.io" }
    )

    let packageMgr = await ExtensionService.getPackageMgr(
      await circuitStorage.loadCircuitData(CircuitId.AuthV2),
      proofService.generateAuthV2Inputs.bind(proofService),
      proofService.verifyState.bind(proofService)
    )

    let authHandler = new AuthHandler(packageMgr, proofService)

    if (!this.instanceES) {
      this.instanceES = {
        packageMgr,
        proofService,
        credWallet,
        wallet,
        dataStorage,
        authHandler,
        status: INIT,
      }
    }
    console.log("Extension services has been initialized", this.instanceES)
    return this.instanceES
  }
  static async getPackageMgr(
    circuitData: CircuitData,
    prepareFn: AuthDataPrepareFunc,
    stateVerificationFn: StateVerificationFunc
  ) {
    const authInputsHandler = new DataPrepareHandlerFunc(prepareFn)
    const verificationFn = new VerificationHandlerFunc(stateVerificationFn)
    const mapKey =
      proving.provingMethodGroth16AuthV2Instance.methodAlg.toString()
    const verificationParamMap: Map<string, VerificationParams> = new Map([
      [
        mapKey,
        {
          key: circuitData.verificationKey,
          verificationFn,
        } as VerificationParams,
      ],
    ])

    const provingParamMap = new Map()
    provingParamMap.set(mapKey, {
      dataPreparer: authInputsHandler,
      provingKey: circuitData.provingKey,
      wasm: circuitData.wasm,
    })

    const mgr = new PackageManager()
    const packer = new ZKPPacker(provingParamMap, verificationParamMap)
    const plainPacker = new PlainPacker()
    mgr.registerPackers([packer, plainPacker])

    return mgr
  }

  static getExtensionServiceInstance() {
    return this.instanceES
  }
}
