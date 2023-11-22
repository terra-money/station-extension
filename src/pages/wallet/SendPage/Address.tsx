import { useEffect, useState } from "react"
import { useSend } from "./SendContext"
import { AccAddress } from "@terra-money/feather.js"
import { getChainIDFromAddress } from "utils/bech32"
import {
  InputWrapper,
  SectionHeader,
  InputInLine,
  Paste,
  Tabs,
} from "station-ui"
import { WalletButtonList } from "./Components/OtherWallets"
import OtherWallets from "./Components/OtherWallets"
import validate, { validateRecipient } from "txs/validate"
import { useRecentRecipients } from "utils/localStorage"
import { useLocation } from "react-router-dom"

const Address = () => {
  const { form, goToStep, getWalletName, networks } = useSend()
  const { state } = useLocation()
  const { recipients } = useRecentRecipients()
  const { register, setValue, formState, trigger } = form
  const { errors } = formState

  useEffect(() => {
    if (state?.denom) {
      setValue("asset", state.denom)
    }
  })

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

  const onClick = (recipient: AccAddress) => {
    setValue("recipient", recipient)
    goToStep(2)
  }

  const handleKnownChain = (recipient: AccAddress) => {
    setValue("recipient", recipient)
    trigger("recipient")
    if (validateRecipient(recipient)) {
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
          placeholder="Wallet Address"
          extra={<Paste onPaste={(recipient) => handleKnownChain(recipient)} />}
          {...register("recipient", {
            validate: { ...validate.recipient() },
          })}
        />
      </InputWrapper>
      {recipients.length > 0 && (
        <>
          <SectionHeader title="Recently Used" withLine />
          <WalletButtonList
            items={recipients.map((r) => ({
              ...r,
              name: getWalletName(r.recipient),
            }))}
            onClick={(recipient) => handleKnownChain(recipient)}
          />
        </>
      )}
      <SectionHeader title="Other Wallets" withLine />
      <Tabs activeTabKey={tab} tabs={tabs} />
      <OtherWallets tab={tab} onClick={onClick} />
    </>
  )
}
export default Address
