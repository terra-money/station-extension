import {
  ExtensionInstance,
  ExtensionService,
} from "identity/services/Extension.service"
import { useEffect, useState } from "react"
import IdentitySelector from "./IdentitySelector"

import classNames from "classnames"
import SettingsButton from "components/layout/SettingsButton"
import { useActiveIdentity } from "identity/data/Identity"
import { Account, LocalStorageServices, approveMethod } from "identity/services"
import styles from "./IdentitySetting.module.scss"
import { useSearchParams } from "react-router-dom"

const cx = classNames.bind(styles)
const IdentitySetting = (props: { setPage: any }) => {
  const [isInitialized, setInitialized] = useState<boolean>(false)
  const [exService, setExService] = useState<ExtensionInstance | undefined>()
  const [accounts, setAccounts] = useState<Array<Account>>([])
  const { activeIdentity, setActiveIdentity } = useActiveIdentity()
  const { setPage } = props
  const [_, setSearchParams] = useSearchParams()

  useEffect(() => {
    const promise = ExtensionService.init()
    promise
      .then((es) => {
        setInitialized(true)
        setExService(es)
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])

  useEffect(() => {
    const as = LocalStorageServices.getAllAccounts()
    setAccounts(as)
  }, [])

  const testLogin = () => {
    setSearchParams({
      i_m: "ewogICAgImlkIjogImNjMjMyZGEzLWJjM2UtNDk3YS04OGE5LWU5YmVlMDY2OGVlZCIsCiAgICAidHlwIjogImFwcGxpY2F0aW9uL2lkZW4zY29tbS1wbGFpbi1qc29uIiwKICAgICJ0eXBlIjogImh0dHBzOi8vaWRlbjMtY29tbXVuaWNhdGlvbi5pby9hdXRob3JpemF0aW9uLzEuMC9yZXF1ZXN0IiwKICAgICJ0aGlkIjogImNjMjMyZGEzLWJjM2UtNDk3YS04OGE5LWU5YmVlMDY2OGVlZCIsCiAgICAiYm9keSI6IHsKICAgICAgICAiY2FsbGJhY2tVcmwiOiAiaHR0cHM6Ly92ZXJpZmllci12Mi5wb2x5Z29uaWQubWUvYXBpL2NhbGxiYWNrP3Nlc3Npb25JZD02MzA0NTkiLAogICAgICAgICJyZWFzb24iOiAidGVzdCBmbG93IiwKICAgICAgICAic2NvcGUiOiBbXQogICAgfSwKICAgICJmcm9tIjogImRpZDpwb2x5Z29uaWQ6cG9seWdvbjptdW1iYWk6MnFMUHF2YXlOUXo5VEEycjVWUHhVdWdvRjE4dGVHVTU4M3pKODU5d2Z5Igp9",
    })
    window.postMessage("OpenAuth")
  }

  return (
    <>
      <IdentitySelector
        options={accounts}
        value={activeIdentity?.did ?? ""}
        onChange={(did) => {
          LocalStorageServices.activateAccount(did)
          setActiveIdentity(LocalStorageServices.getActiveAccount())
          console.log("active did: ", did)
        }}
        initialized={isInitialized}
      />
      <div className={styles.create}>
        <SettingsButton
          title="Create New Identity"
          onClick={() => setPage("newidentity")}
        ></SettingsButton>
      </div>
      {activeIdentity && (
        <>
          <div className={styles.create}>
            <SettingsButton
              title="Import Credential"
              onClick={() => setPage("createcredential")}
            ></SettingsButton>
          </div>
          <div className={styles.create}>
            <SettingsButton
              title="Test"
              onClick={() => testLogin()}
            ></SettingsButton>
          </div>
        </>
      )}
    </>
  )
}

export default IdentitySetting
