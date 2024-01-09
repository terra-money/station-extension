import {
  InputInLine,
  SendAmount,
  TokenSingleChainListItem,
  Button,
  InputWrapper,
  Input,
  Banner,
  Checkbox,
} from "@terra-money/station-ui"
import { useSend } from "./SendContext"
import { truncate } from "@terra-money/terra-utils"
import validate from "txs/validate"
import { useCurrency } from "data/settings/Currency"
import { toInput } from "txs/utils"
import { useTranslation } from "react-i18next"
import style from "./Send.module.scss"
import { useEffect, useMemo } from "react"
import { useIBCBaseDenom } from "data/queries/ibc"

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showIBCWarning, ibcWarning, assetInfo, destination])

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
      <SendAmount
        setValue={setValue}
        tokenInputAttr={{
          ...register("input", {
            required: true,
            valueAsNumber: true,
            validate: validate.input(toInput(balance, decimals), decimals),
          }),
        }}
        tokenAmount={input ?? 0}
        currencyInputAttrs={{
          ...register("currencyAmount", {
            valueAsNumber: true,
            required: true,
            deps: ["input"],
          }),
        }}
        currencyAmount={currencyAmount ?? 0}
        tokenIcon={tokenImg}
        symbol={symbol}
        currencySymbol={currency.symbol}
        price={price}
        formState={formState}
      />
      <TokenSingleChainListItem {...assetInfo} onClick={handleMax} />
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
