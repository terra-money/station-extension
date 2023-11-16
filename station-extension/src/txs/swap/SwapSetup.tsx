/* eslint-disable react-hooks/exhaustive-deps */
import {
  AssetSelectorTo,
  AssetSelectorFrom,
  Modal,
  Button,
  RoundedButton,
} from "station-ui"
import { useMemo, useState } from "react"
import { SwapAssetExtra, SwapState } from "data/queries/swap/types"
import { useSwap } from "./SwapContext"
import { useTranslation } from "react-i18next"
import { toInput } from "txs/utils"
import SwapTokenSelector from "./components/SwapTokenSelector"
import { useEffect } from "react"
import validate from "txs/validate"
import { useLocation, useNavigate } from "react-router-dom"
import { ReactComponent as SwapArrows } from "styles/images/icons/SwapArrows.svg"
import styles from "./Swap.module.scss"
import { useCurrency } from "data/settings/Currency"
import { has } from "utils/num"

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
  const [msgs, setMsgs] = useState<any[]>()

  // State
  const { watch, getValues, setValue, setError, register } = form
  const [assetModal, setAssetModal] = useState<SwapAssetType | undefined>()
  const [displayTokens, setDisplayTokens] = useState<SwapAssetExtra[]>([])
  const { offerAsset, askAsset, offerInput, route } = watch()

  const askAssetAmount = useMemo(() => {
    return route?.amountOut
      ? toInput(route?.amountOut, askAsset.decimals).toString()
      : "0"
  }, [route, askAsset])

  // Lifecycle
  useEffect(() => {
    if (!state?.denom) return
    const token = tokens.find(
      (t) => t.originDenom === state.denom && has(t.balance)
    )
    if (!token) return
    setValue("offerAsset", token)
  }, [])

  useEffect(() => {
    console.log("offerInput", has(offerInput))
    if (!has(offerInput)) return
    console.log("offerInput 2", offerInput)
    setValue("route", undefined) // for loading purposees
    const fetchRoute = async () => {
      try {
        console.log("before")
        setValue("route", await getBestRoute(getValues()))
        console.log("route", route)
      } catch (err: any) {
        console.log("err", err)
        setError("offerInput", { message: err.message })
      }
    }
    fetchRoute()
  }, [offerAsset, askAsset, offerInput])

  useEffect(() => {
    const fetchMsgs = async () => {
      try {
        setMsgs(await getMsgs(getValues()))
      } catch (err: any) {
        setError("offerInput", { message: err.message })
      }
    }
    fetchMsgs()
  }, [route])

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

  const buttonOnClick = async () => {
    navigate("confirm", { state: msgs })
  }

  // Values
  const currencyAmount = useMemo(() => {
    const offer = `${currency.symbol} ${(
      offerAsset.price * Number(offerInput)
    ).toString()}`
    const ask = `${currency.symbol} ${toInput(
      Number(route?.amountOut) * askAsset.price,
      askAsset.decimals
    )}`
    return { offer: offer ?? "—", ask: ask ?? "—" }
  }, [offerAsset, offerInput, askAsset, route, currency])

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
        extra={toInput(offerAsset.balance, offerAsset.decimals)}
        symbol={offerAsset.symbol}
        chainIcon={offerAsset.chain?.icon}
        chainName={offerAsset.chain?.name}
        tokenIcon={offerAsset.icon ?? ""}
        onSymbolClick={() => handleOpenModal(SwapAssetType.OFFER)}
        currencyAmount={currencyAmount.offer}
        amountInputAttrs={{
          ...register("offerInput", {
            // @ts-ignore
            validate: validate.input(
              toInput(offerAsset.balance, offerAsset.decimals),
              offerAsset.decimals
            ),
          }),
        }}
      />
      <RoundedButton
        className={styles.swapper}
        onClick={swapAssetsOnClick}
        variant="secondary"
        icon={<SwapArrows />}
      />
      <AssetSelectorTo
        extra={toInput(askAsset.balance, askAsset.decimals)}
        symbol={askAsset?.symbol}
        chainIcon={askAsset?.chain?.icon}
        chainName={askAsset?.chain?.name}
        tokenIcon={askAsset?.icon ?? ""}
        onSymbolClick={() => handleOpenModal(SwapAssetType.ASK)}
        amount={askAssetAmount}
        currencyAmount={currencyAmount.ask}
      />
      <Button
        variant="primary"
        loading={!!(has(offerInput) && !route)}
        disabled={!offerInput || !route}
        onClick={buttonOnClick}
        label={t("Continue")}
      />
    </div>
  )
}

export default SwapForm
