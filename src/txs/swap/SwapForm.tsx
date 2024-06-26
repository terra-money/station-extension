/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router-dom"
import { toAmount } from "@terra-money/terra-utils"
import { AccAddress } from "@terra-money/feather.js"
import { SwapAssetExtra, SwapState } from "data/queries/swap/types"
import { useCurrency } from "data/settings/Currency"
import { has } from "utils/num"
import { toInput } from "txs/utils"
import SwapTokenSelector from "./components/SwapTokenSelector"
import { useSwap } from "./SwapContext"
import { validateAssets } from "./SwapConfirm"
import Footer from "./components/Footer"

import {
  AssetSelectorTo,
  AssetSelectorFrom,
  Modal,
  Button,
  Banner,
  FlipButton,
  Grid,
} from "@terra-money/station-ui"
import styles from "./Swap.module.scss"
import { useNetwork } from "data/wallet"
import { useGasEstimation } from "data/queries/tx"

enum SwapAssetType {
  ASK = "askAsset",
  OFFER = "offerAsset",
}

const SwapForm = () => {
  // Hooks
  const {
    tokens,
    getTokensWithBal,
    getBestRoute,
    form,
    getMsgs,
    slippage,
    createTx,
    estimationTxValues,
  } = useSwap()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state: denom } = useLocation()
  const currency = useCurrency()
  // State
  const { watch, getValues, setValue, register } = form
  const [assetModal, setAssetModal] = useState<SwapAssetType | undefined>()
  const [displayTokens, setDisplayTokens] = useState<SwapAssetExtra[]>([])
  const { offerAsset, askAsset, offerInput, route } = watch()
  const [error, setError] = useState<string | undefined>()
  const [warning, setWarning] = useState<string | undefined>()
  const [maxClicked, setMaxClicked] = useState(0)
  const network = useNetwork()
  const { estimatedGas, getGasAmount } = useGasEstimation({
    chain: offerAsset.chainId,
    createTx,
    estimationTxValues,
    gasDenom: network[offerAsset.chainId]?.baseAsset,
  })

  const estimatedGasAmount = useMemo(
    () => getGasAmount(offerAsset.denom),
    [estimatedGas, getGasAmount]
  )

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
    if (!denom) return
    const token = tokens
      .filter((t) => t.originDenom === denom && has(t.balance))
      .sort((a, b) => Number(b.balance) - Number(a.balance))[0]
    if (!token) return
    setValue("offerAsset", token)
  }, [])

  useEffect(() => {
    setError(undefined)
    setValue("route", undefined) // for loading purposees

    if (insufficientFunds) setError("Insufficient funds")
    if (sameAssets) setError("Swap assets must be different")
    if (Number(slippage) >= 1)
      setWarning(
        "Your transaction may be frontrun and result in an unfavorable trade."
      )
    if (!has(offerInput)) return

    const fetchRouteAndMsgs = async () => {
      try {
        setValue("route", await getBestRoute(getValues()))
        setValue("msgs", await getMsgs(getValues()))
      } catch (err: any) {
        setError(err?.message ?? "Unknown error")
      }
    }
    fetchRouteAndMsgs()
  }, [offerAsset, askAsset, offerInput])

  // Handlers
  const handleOpenModal = (type: SwapAssetType) => {
    const toDisplay =
      type === SwapAssetType.OFFER ? getTokensWithBal(tokens) : tokens
    setDisplayTokens(toDisplay)
    setAssetModal(type)
  }
  const tokenOnClick = (token: SwapAssetExtra) => {
    // add prefix to align with Skips expected formatting
    const parsed = AccAddress.validate(token.denom)
      ? { ...token, denom: `cw20:${token.denom}` }
      : token
    if (assetModal) setValue(assetModal as keyof SwapState, parsed)
    setAssetModal(undefined) // close modal
  }

  const swapAssetsOnClick = () => {
    setValue("offerInput", askAssetAmount)
    setValue("askAsset", offerAsset)
    setValue("offerAsset", askAsset)
  }

  // Values
  const offerCurrencyAmount = useMemo(() => {
    const { price } = offerAsset
    return (Number(offerInput) * (price ?? 0)).toFixed(2)
  }, [offerAsset, offerInput])

  const askCurrencyAmount = useMemo(() => {
    const { price, decimals } = askAsset
    return toInput(Number(route?.amountOut) * (price ?? 0), decimals).toFixed(2)
  }, [route, askAsset])

  const sameAssets = !validateAssets({ offerAsset, askAsset })
  const disabled = !(offerInput && !error && route && estimatedGasAmount)
  const loading = !!(has(offerInput) && !error && !route)

  useEffect(() => {
    setMaxClicked(0)
  }, [offerAsset.denom])

  const handleMaxClick = () => {
    setMaxClicked(maxClicked + 1)
    const maxClickedIsEven = maxClicked > 0 && maxClicked % 2 === 0

    let maxAmount = parseInt(offerAsset.balance)

    if (offerAsset.denom === network[offerAsset.chainId]?.baseAsset) {
      const balMinusGasFee =
        parseInt(offerAsset.balance) - parseInt(estimatedGasAmount)
      const balMinusTwoGasFee =
        parseInt(offerAsset.balance) - 2 * parseInt(estimatedGasAmount)
      maxAmount = maxClickedIsEven ? balMinusGasFee : balMinusTwoGasFee
      setWarning(
        maxClickedIsEven
          ? t(
              "Executing this transaction will leave you no gas for future transactions"
            )
          : undefined
      )
    }
    setValue("offerInput", toInput(maxAmount, offerAsset.decimals).toString())
  }

  return (
    <div className={styles.container}>
      <Modal
        isOpen={!!assetModal}
        onRequestClose={() => setAssetModal(undefined)}
        title="Select Asset"
      >
        <SwapTokenSelector tokenOnClick={tokenOnClick} tokens={displayTokens} />
      </Modal>
      <Grid gap={24}>
        <Grid gap={4}>
          <AssetSelectorFrom
            handleMaxClick={handleMaxClick}
            walletAmount={toInput(offerAsset.balance, offerAsset.decimals)}
            symbol={offerAsset.symbol}
            chainIcon={offerAsset.chain?.icon}
            chainName={offerAsset.chain?.name}
            tokenIcon={offerAsset.icon ?? ""}
            onSymbolClick={() => handleOpenModal(SwapAssetType.OFFER)}
            amountInputAttrs={{ ...register("offerInput") }}
            currencyAmount={`${currency.symbol} ${offerCurrencyAmount}`}
          />
          <FlipButton className={styles.swapper} onClick={swapAssetsOnClick} />
          <AssetSelectorTo
            walletAmount={toInput(askAsset.balance, askAsset.decimals)}
            symbol={askAsset?.symbol}
            chainIcon={askAsset?.chain?.icon}
            chainName={askAsset?.chain?.name}
            tokenIcon={askAsset?.icon ?? ""}
            onSymbolClick={() => handleOpenModal(SwapAssetType.ASK)}
            amount={parseFloat(askAssetAmount)}
            currencyAmount={`${currency.symbol} ${askCurrencyAmount}`}
          />
        </Grid>
        <Footer />
        {error && <Banner title={t(error)} variant="error" />}
        {warning && <Banner title={t(warning)} variant="warning" />}
      </Grid>
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
