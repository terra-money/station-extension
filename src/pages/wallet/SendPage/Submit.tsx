/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react"
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
  Banner,
  Checkbox,
  FlexColumn,
} from "@terra-money/station-ui"
import { useNetwork } from "data/wallet"
import { useGasEstimation } from "data/queries/tx"

const Submit = () => {
  const {
    form,
    getWalletName,
    goToStep,
    networks,
    createTx,
    estimationTxValues,
  } = useSend()
  const {
    register,
    formState,
    watch,
    setValue,
    trigger,
    setError,
    clearErrors,
  } = form
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
  const network = useNetwork()
  const [maxClicked, setMaxClicked] = useState(0)
  const [showFeeWarning, setShowFeeWarning] = useState(false)

  const { estimatedGas, getGasAmount } = useGasEstimation({
    chain: assetInfo?.tokenChain ?? "",
    createTx,
    estimationTxValues,
    gasDenom: network[assetInfo?.tokenChain ?? ""]?.baseAsset,
  })

  const estimatedGasAmount = useMemo(
    () => getGasAmount(assetInfo?.denom ?? ""),
    [estimatedGas, getGasAmount]
  )

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

  const handleMaxClick = () => {
    const maxClickCount = maxClicked + 1
    setMaxClicked(maxClickCount)
    const maxClickedIsEven = maxClickCount > 0 && maxClickCount % 2 === 0

    let maxAmount = parseInt(balance)

    if (assetInfo.denom === network[assetInfo.tokenChain]?.baseAsset) {
      const balMinusGasFee = maxAmount - parseInt(estimatedGasAmount)
      const balMinusTwoGasFee = maxAmount - 2 * parseInt(estimatedGasAmount)
      maxAmount = maxClickedIsEven ? balMinusGasFee : balMinusTwoGasFee
      setShowFeeWarning(maxClickedIsEven)
    }
    setValue("input", toInput(maxAmount, assetInfo.decimals, 5))
    if (price) {
      setValue("currencyAmount", toInput(Number(balance) * price, decimals, 4))
    }
    trigger("input")
  }

  const recipientName = getWalletName(recipient)

  return (
    <FlexColumn gap={24} justify="space-between" align="stretch">
      <FlexColumn gap={24} justify="flex-start" align="stretch">
        <InputInLine
          style={{ cursor: "pointer" }}
          label={t("To")}
          onClick={() => goToStep(1)}
          extra={!recipientName.includes("...") && truncate(recipient, [11, 6])}
          value={recipientName}
        />
        <AssetSelectorFrom
          walletAmount={toInput(balance, decimals)}
          handleMaxClick={handleMaxClick}
          symbol={symbol}
          onSymbolClick={() => {
            setValue("asset", undefined)
            goToStep(3)
          }}
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
          currencyAmount={`${currency.symbol} ${currencyAmount ?? 0}`}
        />
        {showFeeWarning && (
          <Banner
            variant="warning"
            title={t(
              t(
                "Executing this transaction will leave you no gas for future transactions"
              )
            )}
          />
        )}
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
              checked={ibcWarning}
              label={t(`I know what I'm doing`)}
              indent
            />
          </>
        )}
      </FlexColumn>
      <Button
        disabled={
          input !== undefined &&
          (Object.keys(formState.errors).length !== 0 || !formState.isValid)
        }
        variant="primary"
        onClick={() => goToStep(5)}
        label={t("Continue")}
      />
    </FlexColumn>
  )
}

export default Submit
