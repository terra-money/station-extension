import { Account, LocalStorageServices } from "identity/services"
import {
  SetterOrUpdater,
  atom,
  useRecoilValue,
  useSetRecoilState,
} from "recoil"

export const activeIdentityState = atom({
  key: "activeIdentity",
  default: LocalStorageServices.getActiveAccount(),
})

export const useActiveIdentity = () => {
  return {
    activeIdentity: useRecoilValue(activeIdentityState),
    setActiveIdentity: useSetRecoilState(activeIdentityState),
  }
}
