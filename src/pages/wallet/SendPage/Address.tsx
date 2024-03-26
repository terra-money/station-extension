import { useState, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { AccAddress } from "@terra-money/feather.js"
import classNames from "classnames/bind"
import {
  InputWrapper,
  SectionHeader,
  InputInLine,
  FlexColumn,
  Grid,
  WalletListItem,
} from "@terra-money/station-ui"
import validate from "txs/validate"
import { getChainIDFromAddress } from "utils/bech32"
import { useRecentRecipients } from "utils/localStorage"
import { WalletName } from "types/network"
import { useAuth } from "auth"
import { useAddressBook } from "data/settings/AddressBook"
import { AddressBookList } from "./Components/AddressBookList"
import MyWallets from "./Components/MyWallets"
import { useSend } from "./SendContext"
import styles from "./Address.module.scss"
import AddressBookButton from "./Components/AddressBookButton"

const cx = classNames.bind(styles)

const Address = () => {
  const { form, goToStep, getWalletName, networks } = useSend()
  const { state: denom } = useLocation()
  const { register, setValue, formState, watch, trigger } = form
  const { errors } = formState
  const { recipient } = watch()
  const { t } = useTranslation()
  const [recipientInputFocused, setRecipientInputFocused] = useState(false)
  const { list: addressList } = useAddressBook()
  const { recipients } = useRecentRecipients()
  const { wallets } = useAuth()

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setRecipientInputFocused(false)
    }
  }

  useEffect(() => {
    setValue("asset", denom) // pre-selected from asset page
  }, [denom, setValue])

  const handleKnownWallet = (
    recipient: AccAddress | WalletName,
    index?: number,
    memo?: string
  ) => {
    setValue("memo", memo)
    if (!AccAddress.validate(recipient ?? "")) {
      setValue("recipientWalletName", recipient)
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

  const InputExtra = () => {
    return formState.isValid ? (
      <button className={styles.done__button} onClick={() => goToStep(2)}>
        {t("Done")}
      </button>
    ) : (
      <AddressBookButton />
    )
  }

  return (
    <>
      {recipientInputFocused && <span className={styles.blur__bg} />}
      <FlexColumn
        gap={24}
        justify="flex-start"
        align="stretch"
        className={styles.flex__column__container}
      >
        {/* This is here to fill the space of the input behind the blurred background */}
        {recipientInputFocused && (
          <div
            className={cx(styles.input__wrapper__helper, {
              [styles.is__focused]: recipientInputFocused,
            })}
          >
            <InputWrapper error={errors.recipient?.message}>
              <InputInLine label="To" />
            </InputWrapper>
          </div>
        )}
        <InputWrapper error={errors.recipient?.message}>
          <div
            className={cx(styles.input__wrapper__real, {
              [styles.is__focused]: recipientInputFocused,
            })}
            ref={ref}
          >
            <InputInLine
              type="text"
              label="To"
              placeholder={t("Recipient Address")}
              {...register("recipient", {
                validate: { ...validate.recipient() },
              })}
              extra={<InputExtra />}
              onFocus={() => setRecipientInputFocused(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setRecipientInputFocused(false)
                }
              }}
            />
            {recipientInputFocused && (
              <div className={styles.options}>
                <div className={cx(styles.options__container)}>
                  <div className={styles.children}>
                    <FlexColumn gap={24}>
                      {wallets.filter((w) => w.name.includes(recipient ?? ""))
                        .length > 0 && (
                        <Grid gap={16}>
                          <SectionHeader
                            extraSmallText
                            title={t("My Wallets")}
                          />
                          {wallets.map((w) => {
                            return w.name.includes(recipient ?? "") ? (
                              <WalletListItem
                                key={w.name}
                                emoji={w.icon ?? w.name[0]}
                                name={w.name}
                                address={t("Multiple Addresses")}
                                smallText
                                onClick={() => handleKnownWallet(w.name)}
                              />
                            ) : null
                          })}
                        </Grid>
                      )}

                      {recipients.filter((r) =>
                        r.recipient.includes(recipient ?? "")
                      ).length > 0 && (
                        <Grid gap={16}>
                          <SectionHeader
                            extraSmallText
                            title={t("Recently Used")}
                          />

                          {recipients.map((w) => {
                            return w.name.includes(recipient ?? "") ? (
                              <WalletListItem
                                key={w.name}
                                emoji={w.icon ?? w.name[0]}
                                name={w.name}
                                address={w.recipient}
                                smallText
                                onClick={() => handleKnownChain(w.recipient)}
                              />
                            ) : null
                          })}
                        </Grid>
                      )}

                      {addressList.filter((r) =>
                        r.name.includes(recipient ?? "")
                      ).length > 0 && (
                        <Grid gap={16}>
                          <SectionHeader
                            extraSmallText
                            title={t("Address Book")}
                          />
                          {addressList.map((w) => {
                            return w.name.includes(recipient ?? "") ? (
                              <WalletListItem
                                key={w.name}
                                emoji={w.icon ?? w.name[0]}
                                name={w.name}
                                address={w.recipient}
                                smallText
                                onClick={() => handleKnownChain(w.recipient)}
                              />
                            ) : null
                          })}
                        </Grid>
                      )}
                    </FlexColumn>
                  </div>
                </div>
              </div>
            )}
          </div>
        </InputWrapper>
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
        <SectionHeader title="My Wallets" withLine />
        <MyWallets onClick={handleKnownWallet} />
      </FlexColumn>
    </>
  )
}
export default Address
