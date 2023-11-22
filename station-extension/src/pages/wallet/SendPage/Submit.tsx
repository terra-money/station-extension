import {
  InputInLine,
  SendAmount,
  TokenSingleChainListItem,
  Button,
  InputWrapper,
  Input,
} from "station-ui"
import { useSend } from "./SendContext"
import { truncate } from "@terra-money/terra-utils"
import validate from "txs/validate"
import { useCurrency } from "data/settings/Currency"
import { toInput } from "txs/utils"
import { useTranslation } from "react-i18next"

const Submit = () => {
  const { form, getWalletName, goToStep } = useSend()
  const { register, formState, watch, setValue } = form
  const { errors } = formState
  const { assetInfo, recipient, input } = watch()
  const currency = useCurrency()
  const { t } = useTranslation()
  if (!assetInfo || !recipient) return null
  return (
    <>
      <InputInLine
        disabled
        label={"To"}
        extra={truncate(recipient)}
        value={getWalletName(recipient)}
      />
      {/* <SendAmount
        displayType="token"
        tokenIcon={assetInfo.tokenImg}
        symbol={assetInfo.symbol}
        amount={input ?? 0}
        secondaryAmount={input ?? 0}
        price={assetInfo.price ?? 0}
        currencySymbol={currency.symbol}
        amountInputAttrs={{
          ...register("input", {
            required: true,
            valueAsNumber: true,
            validate: validate.input(
              toInput(assetInfo.balance, assetInfo.decimals),
              assetInfo.decimals
            ),
          }),
        }}
      /> */}
      <SendAmount
        setValue={setValue}
        tokenInputAttr={{
          ...register("input", {
            required: true,
            valueAsNumber: true,
            validate: validate.input(
              toInput(assetInfo.balance, assetInfo.decimals),
              assetInfo.decimals
            ),
            // validate: validate.input(
            //   toInput(100000000, 6),
            //   8,
            //   "Token amount",
            // ),
          }),
        }}
        tokenAmount={watch("input") || 0}
        currencyInputAttrs={{
          ...register("currencyAmount", {
            valueAsNumber: true,
            required: true,
            deps: ["input"],
          }),
        }}
        currencyAmount={watch("currencyAmount") || 0}
        tokenIcon={assetInfo.tokenImg}
        symbol={assetInfo.symbol}
        currencySymbol={currency.symbol}
        price={assetInfo.price ?? 0}
        formState={formState}
      />
      <TokenSingleChainListItem {...assetInfo} />
      <InputWrapper
        label={`${t("Memo")} (${t("optional")})`}
        error={errors.memo?.message}
      >
        <Input
          // onFocus={() => max?.reset()}
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
        disabled={input !== undefined && !formState.isValid}
        variant="primary"
        onClick={() => goToStep(5)}
        label={t("Continue")}
      />
    </>
  )
}
export default Submit
