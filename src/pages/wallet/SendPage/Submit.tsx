/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { truncate } from "@terra-money/terra-utils"
import validate from "txs/validate"
import { toInput } from "txs/utils"
import { useCurrency } from "data/settings/Currency"
import { useIBCBaseDenom } from "data/queries/ibc"
import { useSend } from "./SendContext"
import {
  InputInLine,
  AssetSelectorFrom,
  Button,
  InputWrapper,
  Input,
  Banner,
  Checkbox,
} from "@terra-money/station-ui"
import style from "./Send.module.scss"

const Submit = () => {
  const { form, getWalletName, goToStep, networks } = useSend()
  const {
    register,
    formState,
    watch,
    setValue,
    trigger,
    setError,
    clearErrors,
  } = form
  const { errors } = formState
  const {
    assetInfo,
    recipient,
    input,
    currencyAmount,
    destination,
    ibcWarning,
  } = watch()
  const { data: ibcData } = useIBCBaseDenom(
    assetInfo?.denom ?? "",
    assetInfo?.tokenChain ?? "",
    true
  )
  const currency = useCurrency()
  const { t } = useTranslation()

  const originChain = useMemo(() => ibcData?.chainIDs?.[0], [ibcData])

  const showIBCWarning = useMemo(() => {
    return (
      originChain &&
      assetInfo?.denom.startsWith("ibc/") &&
      assetInfo.tokenChain !== destination &&
      destination !== originChain
    )
  }, [assetInfo, originChain, destination])

  useEffect(() => {
    setValue("ibcWarning", false)
  }, [setValue])

  useEffect(() => {
    if (showIBCWarning) {
      setError("ibcWarning", { type: "manual" })
    } else {
      clearErrors("ibcWarning")
    }
  }, [showIBCWarning, ibcWarning, assetInfo, destination])

  useEffect(() => {
    if (!(assetInfo && recipient)) {
      goToStep(1)
      return
    }

    const { price } = assetInfo

    if (price) {
      const amount = input || 0
      setValue("currencyAmount", amount * price)
    }
  }, [input])

  if (!(assetInfo && recipient)) {
    goToStep(1)
    return null
  }

  const { balance, decimals, price, tokenImg, symbol } = assetInfo

  const handleMax = () => {
    setValue("input", toInput(balance, decimals))
    if (price) {
      setValue("currencyAmount", toInput(Number(balance) * price, decimals))
    }
    trigger("input")
  }

  const recipientName = getWalletName(recipient)

  return (
    <>
      <InputInLine
        style={{ cursor: "pointer" }}
        label={t("To")}
        onClick={() => goToStep(1)}
        extra={!recipientName.includes("...") && truncate(recipient)}
        value={recipientName}
      />
      <AssetSelectorFrom
        walletAmount={toInput(balance, decimals)}
        handleMaxClick={handleMax}
        symbol={symbol}
        onSymbolClick={() => goToStep(1)}
        tokenIcon={tokenImg}
        chainIcon={assetInfo.chain.icon}
        chainName={assetInfo.chain.label}
        amountInputAttrs={{
          ...register("input", {
            required: true,
            valueAsNumber: true,
            validate: validate.input(toInput(balance, decimals), decimals),
          }),
        }}
        currencyAmount={currencyAmount ?? 0}
        currencySymbol={currency.symbol}
      />
      <InputWrapper
        label={`${t("Memo")} (${t("optional")})`}
        error={errors.memo?.message}
      >
        <Input
          {...register("memo", {
            validate: {
              size: validate.size(256, "Memo"),
              brackets: validate.memo(),
              mnemonic: validate.isNotMnemonic(),
            },
          })}
        />
      </InputWrapper>
      {showIBCWarning && (
        <>
          <Banner
            variant="warning"
            title={t(
              "Caution: This asset may not be recognized on the destination chain. Send asset back to {{home}} first before proceeding.",
              {
                home: networks[originChain ?? ""].name,
              }
            )}
          />
          <Checkbox
            {...register("ibcWarning")}
            className={style.checkbox}
            checked={ibcWarning}
            label={t(`I know what I'm doing`)}
          />
        </>
      )}
      <Button
        className={style.button}
        disabled={
          input !== undefined &&
          (Object.keys(formState.errors).length !== 0 || !formState.isValid)
        }
        variant="primary"
        onClick={() => goToStep(5)}
        label={t("Continue")}
      />
    </>
  )
}

export default Submit
