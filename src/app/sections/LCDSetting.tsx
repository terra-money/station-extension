import { useNetworkName, useNetworkOptions } from "data/wallet"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNetworks } from "app/InitNetworks"
import { useEffect, useMemo } from "react"
// import { Input } from "components/form"
import styles from "./LCDSetting.module.scss"
import { useValidateLCD } from "data/queries/tendermint"
import { LoadingCircular } from "components/feedback"
import ClearIcon from "@mui/icons-material/Clear"
import CheckIcon from "@mui/icons-material/Check"
import { Flex } from "components/layout"
import { useCustomLCDs } from "utils/localStorage"
import { Dropdown, Button, Input, Form, InputWrapper } from "station-ui"
import classNames from "classnames"
import DeleteIcon from "@mui/icons-material/Delete"

const cx = classNames.bind(styles)
interface FormValues {
  network: string
  chainID: string
  lcd?: string
}

const LCDSetting = () => {
  const networkName = useNetworkName()
  const networkOptions = useNetworkOptions()
  const { networks } = useNetworks()
  const { t } = useTranslation()
  const { customLCDs, changeCustomLCDs } = useCustomLCDs()
  const form = useForm<FormValues>({ mode: "onChange" })
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form
  const { network, chainID, lcd } = watch()
  const networksList = useMemo(
    () =>
      Object.values(networks[network] ?? {})
        .sort((a, b) => {
          if (a?.prefix === "terra") return -1
          if (b?.prefix === "terra") return 1
          return 0
        })
        .map((c) => ({ value: c.chainID, image: c.icon, label: c.name })),
    [networks, network]
  )

  useEffect(() => {
    if (!network) {
      const index = networkOptions.findIndex((n) => n.value === networkName)
      setValue("network", networkOptions[index].value)
    }
  }, [network, networkName, networkOptions, setValue])

  useEffect(() => {
    if (!networksList.length) return
    setValue("chainID", networksList[0].value)
  }, [setValue, networksList])

  useEffect(() => {
    setValue("lcd", customLCDs[chainID] ?? "")
  }, [setValue, customLCDs, chainID])

  const { data: errorMessage, isLoading } = useValidateLCD(
    lcd,
    chainID,
    customLCDs[chainID] !== lcd
  )

  const isDisabled = !!errorMessage || isLoading
  const isSaved = (!customLCDs[chainID] && !lcd) || customLCDs[chainID] === lcd

  if (!networkOptions) return null

  const renderIsValidLCD = () => {
    if (!lcd) return
    return (
      <span
        className={cx({
          loading: isLoading,
          error: errorMessage,
          success: !isLoading && !errorMessage,
        })}
      >
        <Flex gap={4} start>
          {isLoading && (
            <>
              <LoadingCircular size={10} /> Loading...
            </>
          )}
          {errorMessage && (
            <>
              <ClearIcon fontSize="inherit" className={styles.icon} />
              Invalid
            </>
          )}
          {!isLoading && !errorMessage && (
            <>
              <CheckIcon fontSize="inherit" className={styles.icon} />
              Valid
            </>
          )}
        </Flex>
      </span>
    )
  }

  const submit = ({ chainID, lcd }: FormValues) => {
    if (isDisabled) return
    changeCustomLCDs(chainID, lcd)
  }

  const reset = (chainID: string) => {
    changeCustomLCDs(chainID, undefined)
    setValue("lcd", undefined)
  }

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <InputWrapper label={t("Network")} error={errors.network?.message}>
        <Dropdown
          options={networkOptions}
          value={network}
          onChange={(network) => setValue("network", network)}
        />
      </InputWrapper>

      <InputWrapper label={t("Source Chain")} error={errors?.chainID?.message}>
        <Dropdown
          options={networksList}
          value={chainID}
          onChange={(chainID) => setValue("chainID", chainID)}
        />
      </InputWrapper>

      <InputWrapper
        label={t("Custom URL")}
        error={errorMessage}
        extra={renderIsValidLCD()}
      >
        <Input
          type="text"
          placeholder={networks[network]?.[chainID]?.lcd}
          actionIcon={
            lcd || !isSaved
              ? {
                  icon: (
                    <span className={styles.loading}>
                      <DeleteIcon />
                    </span>
                  ),
                  onClick: () => reset(chainID),
                }
              : undefined
          }
          {...register("lcd", {
            value: customLCDs[chainID] ?? "",
          })}
        />
      </InputWrapper>
      <div className={styles.button__padding} />
      <section className={styles.button__conainer}>
        <Button
          variant="primary"
          disabled={isDisabled || isSaved}
          type="submit"
        >
          {isLoading ? (
            <>
              <LoadingCircular size={18} /> Loading...
            </>
          ) : (
            <>Create Custom RPC</>
          )}
        </Button>
      </section>
    </Form>
  )
}

export default LCDSetting
