import {
  InputInLine,
  SendAmount,
  TokenSingleChainListItem,
  Button,
  InputWrapper,
  Input,
} from "@terra-money/station-ui"
import { useSend } from "./SendContext"
import { truncate } from "@terra-money/terra-utils"
import validate from "txs/validate"
import { useCurrency } from "data/settings/Currency"
import { toInput } from "txs/utils"
import { useTranslation } from "react-i18next"
import style from "./Send.module.scss"
import { useEffect } from "react"

// 100_000 msg_send
// more for msg_transfer
// check if token is fee token multiple fixed gas amount by gas price from useNetwork
// edge case: chains with multiple gas tokens./

const Submit = () => {
  const { form, getWalletName, goToStep } = useSend()
  const { register, formState, watch, setValue, trigger } = form
  const { errors } = formState
  const { assetInfo, recipient, input, currencyAmount } = watch()
  const currency = useCurrency()
  const { t } = useTranslation()

  useEffect(() => {
    setValue("input", 0)
    setValue("currencyAmount", 0)
  }, [setValue])

  if (!(assetInfo && recipient)) {
    goToStep(1)
    return null
  }
  const { balance, decimals, price, tokenImg, symbol } = assetInfo

  const handleMax = () => {
    setValue("input", toInput(balance, decimals))
    if (price)
      setValue("currencyAmount", toInput(Number(balance) * price, decimals))
    trigger("input")
  }

  return (
    <>
      <InputInLine
        disabled
        label={t("To")}
        extra={truncate(recipient)}
        value={getWalletName(recipient)}
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
