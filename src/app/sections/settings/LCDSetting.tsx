import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router-dom"
import classNames from "classnames"
import { useNetworkName, useNetworkOptions } from "data/wallet"
import { useNetworks } from "app/InitNetworks"
import { useValidateLCD } from "data/queries/tendermint"
import { LoadingCircular } from "components/feedback"
import ClearIcon from "@mui/icons-material/Clear"
import CheckIcon from "@mui/icons-material/Check"
import DeleteButton from "components/form/DeleteButton"
import { useCustomLCDs } from "utils/localStorage"
import {
  Dropdown,
  Input,
  InputWrapper,
  ButtonInlineWrapper,
  SubmitButton,
  Flex,
  FlexColumn,
  Form,
} from "@terra-money/station-ui"
import styles from "./LCDSetting.module.scss"

const cx = classNames.bind(styles)

interface FormValues {
  network: string
  chainID: string
  lcd?: string
}

interface Props {
  selectedChainID?: string // for edit
}

const LCDSetting = (props: Props) => {
  const networkName = useNetworkName()
  const networkOptions = useNetworkOptions()
  const { networks } = useNetworks()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { customLCDs, changeCustomLCDs } = useCustomLCDs()
  const location = useLocation()
  const form = useForm<FormValues>({
    mode: "onChange",
    defaultValues: { network: networkName },
  })

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form
  const { network, chainID, lcd } = watch()
  const selectedChainID = location.state?.chainID ?? props.selectedChainID
  const networksList = useMemo(
    () =>
      Object.values(networks[network])
        .sort((a, b) => {
          if (a?.prefix === "terra") return -1
          if (b?.prefix === "terra") return 1
          return 0
        })
        .map((c) => ({ value: c.chainID, image: c.icon, label: c.name })),
    [networks, network]
  )

  useEffect(() => {
    if (!networksList?.length) return
    setValue("chainID", selectedChainID ?? networksList[0].value)
  }, [setValue, networksList, selectedChainID])

  useEffect(() => {
    setValue("lcd", customLCDs[selectedChainID ?? chainID] ?? "")
  }, [setValue, customLCDs, chainID, selectedChainID])

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
    navigate("/preferences/network")
  }

  const handleDelete = () => {
    changeCustomLCDs(chainID, undefined)
    navigate("/preferences/network")
  }

  return (
    <Form onSubmit={handleSubmit(submit)} spaceBetween>
      <FlexColumn gap={24}>
        <InputWrapper label={t("Network")} error={errors.network?.message}>
          <Dropdown
            options={networkOptions}
            value={network}
            onChange={(network) => setValue("network", network)}
          />
        </InputWrapper>

        <InputWrapper
          label={t("Source Chain")}
          error={errors?.chainID?.message}
        >
          <Dropdown
            withSearch
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
            {...register("lcd", {
              value: customLCDs[chainID] ?? "",
            })}
          />
        </InputWrapper>
      </FlexColumn>
      <ButtonInlineWrapper>
        {selectedChainID && <DeleteButton onClick={handleDelete} />}
        <SubmitButton
          loading={isLoading}
          disabled={isDisabled || isSaved}
          label="Create Custom RPC"
        />
      </ButtonInlineWrapper>
    </Form>
  )
}

export default LCDSetting
