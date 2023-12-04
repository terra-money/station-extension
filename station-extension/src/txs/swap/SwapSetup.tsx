/* eslint-disable react-hooks/exhaustive-deps */
import {
  AssetSelectorTo,
  AssetSelectorFrom,
  Modal,
  Button,
  RoundedButton,
  Banner,
} from "station-ui"
import { useMemo, useState } from "react"
import { SwapAssetExtra, SwapState } from "data/queries/swap/types"
import { useSwap } from "./SwapContext"
import { useTranslation } from "react-i18next"
import { toInput } from "txs/utils"
import SwapTokenSelector from "./components/SwapTokenSelector"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ReactComponent as SwapArrows } from "styles/images/icons/SwapArrows.svg"
import styles from "./Swap.module.scss"
import { useCurrency } from "data/settings/Currency"
import { has } from "utils/num"
import AssetFormExtra from "./components/AssetFormExtra"
import { toAmount } from "@terra-money/terra-utils"
import { validateAssets } from "./SwapConfirm"
import Footer from "./components/Footer"

enum SwapAssetType {
  ASK = "askAsset",
  OFFER = "offerAsset",
}

const SwapForm = () => {
  // Hooks
  const { tokens, getTokensWithBal, getBestRoute, form, getMsgs } = useSwap()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state } = useLocation()
  const currency = useCurrency()
  const [error, setError] = useState<string | undefined>()

  // State
  const { watch, getValues, setValue, register } = form
  const [assetModal, setAssetModal] = useState<SwapAssetType | undefined>()
  const [displayTokens, setDisplayTokens] = useState<SwapAssetExtra[]>([])
  const { offerAsset, askAsset, offerInput, route } = watch()

  const offerAssetAmount = useMemo(
    () => toAmount(offerInput, { decimals: offerAsset.decimals }),
    [offerInput, offerAsset]
  )
  const insufficientFunds = useMemo(
    () => Number(offerAsset.balance) < Number(offerAssetAmount),
    [offerAssetAmount, offerAsset]
  )

  const askAssetAmount = useMemo(() => {
    return route?.amountOut
      ? toInput(route?.amountOut, askAsset.decimals).toString()
      : "0"
  }, [route, askAsset])

  // Lifecycle
  useEffect(() => {
    if (!state?.denom) return
    const token = tokens
      .filter((t) => t.originDenom === state.denom && has(t.balance))
      .sort((a, b) => Number(b.balance) - Number(a.balance))[0]
    if (!token) return
    setValue("offerAsset", token)
  }, [])

  useEffect(() => {
    setError(undefined)
    setValue("route", undefined) // for loading purposees

    if (insufficientFunds) setError("Insufficient funds")
    if (sameAssets) setError("Swap assets must be different")
    if (!has(offerInput) || error) return

    const fetchRouteAndMsgs = async () => {
      try {
        setValue("route", await getBestRoute(getValues()))
        setValue("msgs", await getMsgs(getValues()))
      } catch (err: any) {
        console.log("ERROR HERE", err)
        setError(err?.message ?? "Unknown error")
      }
    }
    fetchRouteAndMsgs()
  }, [offerAsset, askAsset, offerInput])

  // Handlers
  const handleOpenModal = (type: SwapAssetType) => {
    setDisplayTokens(
      type === SwapAssetType.OFFER ? getTokensWithBal(tokens) : tokens
    )
    setAssetModal(type)
  }
  const tokenOnClick = (token: SwapAssetExtra) => {
    if (assetModal) setValue(assetModal as keyof SwapState, token)
    setAssetModal(undefined) // close modal
  }

  const swapAssetsOnClick = () => {
    setValue("offerInput", askAssetAmount)
    setValue("askAsset", offerAsset)
    setValue("offerAsset", askAsset)
  }

  const onOfferBalanceClick = () => {
    setValue(
      "offerInput",
      toInput(offerAsset.balance, offerAsset.decimals).toString()
    )
  }

  // Values
  const currencyAmount = useMemo(() => {
    const offer = `${currency.symbol} ${(
      offerAsset.price * Number(offerInput)
    ).toFixed(2)}`

    const ask = `${currency.symbol} ${toInput(
      Number(route?.amountOut) * askAsset.price,
      askAsset.decimals
    ).toFixed(2)}`
    return { offer: offer ?? "—", ask: ask ?? "—" }
  }, [offerAsset, offerInput, askAsset, route, currency])

  const sameAssets = !validateAssets({ offerAsset, askAsset })
  const disabled = !(offerInput && !error && route)
  const loading = !!(has(offerInput) && !error && !route)

  return (
    <div className={styles.container}>
      <Modal
        isOpen={!!assetModal}
        onRequestClose={() => setAssetModal(undefined)}
        title="Select Asset"
      >
        <SwapTokenSelector tokenOnClick={tokenOnClick} tokens={displayTokens} />
      </Modal>
      <AssetSelectorFrom
        extra={
          <AssetFormExtra asset={offerAsset} onClick={onOfferBalanceClick} />
        }
        symbol={offerAsset.symbol}
        chainIcon={offerAsset.chain?.icon}
        chainName={offerAsset.chain?.name}
        tokenIcon={offerAsset.icon ?? ""}
        onSymbolClick={() => handleOpenModal(SwapAssetType.OFFER)}
        currencyAmount={currencyAmount.offer}
        amountInputAttrs={{ ...register("offerInput") }}
      />
      <RoundedButton
        className={styles.swapper}
        onClick={swapAssetsOnClick}
        variant="secondary"
        icon={<SwapArrows />}
      />
      <AssetSelectorTo
        extra={<AssetFormExtra asset={askAsset} />}
        symbol={askAsset?.symbol}
        chainIcon={askAsset?.chain?.icon}
        chainName={askAsset?.chain?.name}
        tokenIcon={askAsset?.icon ?? ""}
        onSymbolClick={() => handleOpenModal(SwapAssetType.ASK)}
        amount={Number(askAssetAmount).toFixed(2)}
        currencyAmount={currencyAmount.ask}
      />
      <Footer />
      {error && <Banner title={t(error)} variant="error" />}
      <Button
        variant="primary"
        loading={loading}
        disabled={disabled}
        onClick={() => navigate("confirm")}
        label={t("Continue")}
      />
    </div>
  )
}

export default SwapForm