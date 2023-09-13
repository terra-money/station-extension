import axios, { AxiosRequestConfig } from "axios"
import { ExtensionService } from "./Extension.service"
import { AuthHandler, FetchHandler, core } from "@0xpolygonid/js-sdk"
import { LocalStorageServices } from "./LocalStorage.services"
const { DID } = core

export async function approveMethod(msgBytes: Uint8Array) {
  const { packageMgr, proofService, credWallet } =
    ExtensionService.getExtensionServiceInstance()

  let authHandler = new AuthHandler(packageMgr, proofService)
  const activeDid = LocalStorageServices.getActiveAccountDid()
  if (activeDid === null) {
    throw new Error("no active did")
  }
  let did = DID.parse(activeDid)
  const authRes = await authHandler.handleAuthorizationRequest(did, msgBytes)
  console.log(authRes)
  const config: AxiosRequestConfig<string> = {
    headers: {
      "Content-Type": "text/plain",
    },
    responseType: "json",
  }
  return await axios
    .post(`${authRes.authRequest.body.callbackUrl}`, authRes.token, config)
    .then((response) => response)
    .catch((error) => error.toJSON())
}

export async function receiveMethod(msgBytes: Uint8Array) {
  const { packageMgr, credWallet } =
    ExtensionService.getExtensionServiceInstance()
  let fetchHandler = new FetchHandler(packageMgr)
  const credentials = await fetchHandler.handleCredentialOffer(msgBytes)
  console.log(credentials)
  await credWallet.saveAll(credentials)
  return "SAVED"
}

export async function proofMethod(msgBytes: Uint8Array) {
  const { authHandler } = ExtensionService.getExtensionServiceInstance()
  const authRequest = await authHandler.parseAuthorizationRequest(msgBytes)
  const { body } = authRequest
  const { scope = [] } = body
  if (scope.length > 1) {
    throw new Error("not support 2 scope")
  }
  const activeDid = LocalStorageServices.getActiveAccountDid()
  if (activeDid === null) {
    throw new Error("no active did")
  }
  const did = DID.parse(activeDid)
  const response = await authHandler.handleAuthorizationRequest(did, msgBytes)
  var config: AxiosRequestConfig<string> = {
    headers: {
      "Content-Type": "text/plain",
    },
    responseType: "json",
  }
  return await axios
    .post(`${authRequest.body.callbackUrl}`, response.token, config)
    .then((response) => response)
    .catch((error) => error.toJSON())
}
