import { useState, useEffect } from "react"
import { useSend } from "./SendContext"
import { AccAddress } from "@terra-money/feather.js"
import { getChainIDFromAddress } from "utils/bech32"
import {
  InputWrapper,
  SectionHeader,
  InputInLine,
  Tabs,
  Button,
} from "@terra-money/station-ui"
import { AddressBookList } from "./Components/AddressBookList"
import MyWallets from "./Components/MyWallets"
import validate from "txs/validate"
import { useRecentRecipients } from "utils/localStorage"
import { useTranslation } from "react-i18next"
import { WalletName } from "types/network"
import { useLocation } from "react-router-dom"

const Address = () => {
  const { form, goToStep, getWalletName, networks } = useSend()
  const { state: denom } = useLocation()
  const { recipients } = useRecentRecipients()
  const { register, setValue, formState, watch, trigger } = form
  const { errors } = formState
  const { recipient } = watch()
  const { t } = useTranslation()
  
  useEffect(() => {
    setValue("asset", denom) // pre-selected from asset page
  }, [denom, setValue])

  const [tab, setTab] = useState("wallets")

  const tabs = [
    {
      key: "wallets",
      label: "My Wallets",
      onClick: () => setTab("wallets"),
    },
    {
      key: "address",
      label: "Address Book",
      onClick: () => setTab("address"),
    },
  ]

  const handleKnownWallet = (recipient: AccAddress | WalletName, _: number, memo?: string) => {
    setValue("memo", memo)
    if (!AccAddress.validate(recipient ?? "")) {
      setValue("recipient", recipient)
      goToStep(2)
    } else {
      handleKnownChain(recipient)
    }
  }

  const handleKnownChain = (recipient: AccAddress) => {
    setValue("recipient", recipient)
    trigger("recipient")
    if (AccAddress.validate(recipient)) {
      setValue("destination", getChainIDFromAddress(recipient, networks))
      goToStep(3)
    }
  }

  return (
    <>
      <InputWrapper error={errors.recipient?.message}>
        <InputInLine
          type="text"
          label="To"
          placeholder="Recipient Address"
          {...register("recipient", {
            validate: { ...validate.recipient() },
          })}
        />
      </InputWrapper>
      {formState.isValid && (
        <Button
          variant="primary"
          onClick={() => handleKnownChain(recipient ?? "")}
          label={t("Continue")}
        />
      )}
      {recipients.length > 0 && (
        <>
          <SectionHeader title="Recently Used" withLine />
          <AddressBookList
            items={recipients.map((r) => ({
              ...r,
              name: getWalletName(r.recipient),
            }))}
            onClick={handleKnownChain}
          />
        </>
      )}
      <SectionHeader title="Other Wallets" withLine />
      <Tabs activeTabKey={tab} tabs={tabs} />
      <MyWallets tab={tab} onClick={handleKnownWallet} />
    </>
  )
}
export default Address
