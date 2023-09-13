import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import classNames from "classnames/bind"
import { Tooltip } from "components/display"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import styles from "./SettingsSelector.module.scss"
import CloseIcon from "@mui/icons-material/Close"
import { Flex } from "components/layout"
import { MockCredentials } from "identity/data/MockData"
import { Account } from "identity/services"
import { WalletService } from "identity/services/Wallet.service"
import { W3CCredential } from "@0xpolygonid/js-sdk"
import {
  ExtensionInstance,
  ExtensionService,
} from "identity/services/Extension.service"
import { Credential } from "identity/data/Credentials"
import { Icon } from "@mui/material"
import { Button } from "components/general"

const cx = classNames.bind(styles)
interface Props {
  value: string | null
  options: Account[]
  onChange: (value: string) => void
  initialized: boolean
  withSearch?: boolean
}

const IdentitySelector = ({
  value,
  options,
  onChange,
  withSearch,
  initialized,
}: Props) => {
  const { t } = useTranslation()

  const selected = value
  const [openAcc, setOpenAcc] = useState(0)
  const [credentialsMap, setCredentialsMap] = useState<
    Map<string, Credential[]>
  >(new Map())
  const [update, setUpdate] = useState(0)

  const handleClick = (index: any, e: any) => {
    e.stopPropagation()
    setOpenAcc(index === openAcc ? 0 : index)
  }

  const getCredentialsForDid = (did: string): Credential[] => {
    return credentialsMap.get(did) ?? []
  }

  useEffect(() => {
    if (!initialized) return
    const f = async () => {
      const es = ExtensionService.getExtensionServiceInstance()
      const cs = await es.credWallet.list()
      const newCredentialsMap = new Map()
      for (const c of cs) {
        const cred = Credential.parseCredentialData(c)
        if (cred.shouldDisplay()) {
          let creds = newCredentialsMap.get(cred.getDid()) ?? []
          creds.push(cred)
          newCredentialsMap.set(cred.getDid(), creds)
        }
      }
      console.log(newCredentialsMap)
      setCredentialsMap(newCredentialsMap)
    }
    f().catch(console.log)
  }, [initialized, update])

  const deleteCredential = (id: string) => {
    const es = ExtensionService.getExtensionServiceInstance()
    es.credWallet.remove(id).then(() => {
      setUpdate(update + 1)
      setOpenAcc(0)
    })
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.selector}>
        {options.map(({ did, name }, index) => {
          return (
            <div
              className={cx(
                styles.accordion,
                openAcc === index + 1 ? "opened" : ""
              )}
              key={did}
            >
              <button className={styles.item} onClick={() => onChange(did)}>
                <div className={styles.icons_container}>
                  <div>{name}</div>
                  {getCredentialsForDid(did).length > 0 && (
                    <Tooltip content={t("View credentials")}>
                      <KeyboardArrowDownIcon
                        className={styles.icon}
                        onClick={(e) => handleClick(index + 1, e)}
                      />
                    </Tooltip>
                  )}
                </div>
                <Flex className={styles.track}>
                  <span
                    className={
                      selected === did
                        ? styles.indicator__checked
                        : styles.indicator
                    }
                  />
                </Flex>
              </button>
              <div
                className={cx(
                  styles.content,
                  openAcc === index + 1 ? "opened" : ""
                )}
              >
                {getCredentialsForDid(did).map((c, index) => {
                  return (
                    <div key={index} style={{ display: "flex" }}>
                      <div>
                        {index + 1}. {c.getType()}: {c.getValue()}
                      </div>
                      <Tooltip content={"Delete Credential"}>
                        <button onClick={() => deleteCredential(c.getId())}>
                          <CloseIcon className={styles.delete}></CloseIcon>
                        </button>
                      </Tooltip>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}

export default IdentitySelector
