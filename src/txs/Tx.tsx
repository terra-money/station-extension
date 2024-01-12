import { ReactNode } from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { QueryKey, useQuery, useQueryClient } from "react-query"
import { useRecoilValue, useSetRecoilState } from "recoil"
import classNames from "classnames"
import BigNumber from "bignumber.js"
import { isNil } from "ramda"

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
import { isDenom } from "@terra-money/terra-utils"
import { Coin, Coins, CreateTxOptions } from "@terra-money/feather.js"
import { Fee } from "@terra-money/feather.js"

import { has } from "utils/num"
import { getErrorMessage } from "utils/error"
import { getLocalSetting, SettingKey } from "utils/localStorage"
import { combineState, RefetchOptions } from "data/query"
import { queryKey } from "data/query"
import { useNetwork } from "data/wallet"
import {
  isBroadcastingState,
  latestTxState,
  useOsmosisGas,
} from "data/queries/tx"
import { useIsWalletEmpty } from "data/queries/bank"

import { Pre } from "components/general"
import { Grid, Flex } from "components/layout"
import { Read } from "components/token"
import ConnectWallet from "app/sections/ConnectWallet"
import useToPostMultisigTx from "pages/multisig/utils/useToPostMultisigTx"
import { isWallet, useAuth } from "auth"
import { toInput, CoinInput, calcTaxes } from "./utils"
import styles from "./Tx.module.scss"
import { useInterchainLCDClient } from "data/queries/lcdClient"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { getShouldTax, useTaxCap, useTaxRate } from "data/queries/treasury"
import { useCarbonFees, useOsmosisGas } from "data/queries/tx"
import {
  Banner,
  Button,
  Checkbox,
  Input,
  InputWrapper,
  SubmitButton,
  Modal,
} from "@terra-money/station-ui"
import { getStoredPassword, shouldStorePassword } from "auth/scripts/keystore"
import { openURL } from "extension/storage"
import DisplayFees from "./feeAbstraction/DisplayFees"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { usePendingIbcTx } from "./useIbcTxs"
import { useNavigate } from "react-router-dom"
import { useAddCachedTx } from "data/queries/activity"

const cx = classNames.bind(styles)

interface Props<TxValues> {
  /* Only when the token is paid out of the balance held */
  token?: Token
  baseDenom?: string
  decimals?: number
  amount?: Amount
  coins?: CoinInput[]
  balance?: Amount
  gasAdjustment?: number
  memo?: string

  /* tx simulation */
  estimationTxValues?: TxValues
  createTx: (values: TxValues) => CreateTxOptions | undefined
  taxRequired?: boolean
  excludeGasDenom?: (denom: string) => boolean
  chain: string

  /* render */
  disabled?: string | false
  children: (props: RenderProps<TxValues>) => ReactNode
  onChangeMax?: (input: number) => void

  /* on tx success */
  isIbc?: boolean
  onPost?: () => void
  hideLoader?: boolean
  onSuccess?: () => void
  redirectAfterTx?: { label: string; path: string }
  queryKeys?: QueryKey[]
}

type RenderMax = (onClick?: (max: Amount) => void) => ReactNode
interface RenderProps<TxValues> {
  max: { amount: Amount; render: RenderMax; reset: () => void }
  fee: {
    render: (
      descriptions?: { label: ReactNode; value: ReactNode }[]
    ) => ReactNode
    amount: string
    denom: string
    decimals: number | undefined
  }
  submit: { fn: (values: TxValues) => Promise<void>; button: ReactNode }
}

function Tx<TxValues>(props: Props<TxValues>) {
  const { token, decimals, amount, balance, chain, baseDenom, hideLoader, memo } =
    props
  const { estimationTxValues, createTx, gasAdjustment: txGasAdjustment } = props
  const { children, onChangeMax } = props
  const { onPost, redirectAfterTx, queryKeys, onSuccess, isIbc } = props

  const [isMax, setIsMax] = useState(false)
  const [gasDenom, setGasDenom] = useState<string>("")
  const addCachedTx = useAddCachedTx()
  const queryClient = useQueryClient()

  /* context */
  const { t } = useTranslation()
  const lcd = useInterchainLCDClient()
  const networks = useNetwork()
  const { wallet, validatePassword, ...auth } = useAuth()
  const addresses = useInterchainAddresses()
  const isWalletEmpty = useIsWalletEmpty()
  const setLatestTx = useSetRecoilState(latestTxState)
  const isBroadcasting = useRecoilValue(isBroadcastingState)
  const { data: carbonFees } = useCarbonFees()
  const { addTx: trackIbcTx } = usePendingIbcTx()
  const { data: osmosisGas } = useOsmosisGas(!chain?.startsWith("osmosis-"))

  /* taxes */
  const isClassic = networks[chain]?.isClassic
  const shouldTax = isClassic && getShouldTax(token, isClassic)
  const { data: taxRate = "0", ...taxRateState } = useTaxRate(!shouldTax)
  const { data: taxCap = "0", ...taxCapState } = useTaxCap(token)
  const taxState = combineState(taxRateState, taxCapState)
  const taxes = isClassic
    ? calcTaxes(
        props.coins ?? ([{ input: 0, denom: token }] as CoinInput[]),
        { taxRate, taxCap },
        !!isClassic
      )
    : undefined

  /* simulation: estimate gas */
  const simulationTx = estimationTxValues && createTx(estimationTxValues)
  const gasAdjustmentSetting = SettingKey.GasAdjustment
  const gasAdjustment =
    networks[chain]?.gasAdjustment *
    getLocalSetting<number>(gasAdjustmentSetting)

  const key = {
    address: addresses?.[chain],
    //network: networks,
    gasAdjustment: gasAdjustment * (txGasAdjustment ?? 1),
    estimationTxValues,
    msgs: simulationTx?.msgs.map((msg) => msg.toData(isClassic)["@type"]),
  }

  const carbonFee = useMemo(() => {
    const fee =
      carbonFees?.costs[key.msgs?.[0] ?? ""] ?? carbonFees?.costs["default_fee"]
    return Number(fee)
  }, [carbonFees, key.msgs])

  const { data: estimatedGas, ...estimatedGasState } = useQuery(
    [queryKey.tx.create, key, isWalletEmpty, carbonFee],
    async () => {
      if (!key.address || isWalletEmpty) return 0
      if (!wallet) return 0
      if (!simulationTx || !simulationTx.msgs.length) return 0
      try {
        if (chain.startsWith("carbon-")) return carbonFee
        const unsignedTx = await lcd.tx.create([{ address: key.address }], {
          ...simulationTx,
          feeDenoms: [gasDenom],
        })
        return Math.ceil(unsignedTx.auth_info.fee.gas_limit)
      } catch (error) {
        console.error(error)
        return 200_000
      }
    },
    {
      ...RefetchOptions.INFINITY,
      // To handle sequence mismatch
      retry: 3,
      retryDelay: 1000,
      // Because the focus occurs once when posting back from the extension
      refetchOnWindowFocus: false,
      enabled: !isBroadcasting,
    }
  )

  const getGasAmount = useCallback(
    (denom: CoinDenom) => {
      const gasPrice = chain?.startsWith("carbon-")
        ? carbonFees?.prices[denom]
        : chain?.startsWith("osmosis-")
        ? (osmosisGas || 0.0025) * 10
        : networks[chain]?.gasPrices[denom]

      if (isNil(estimatedGas) || !gasPrice) return "0"

      return new BigNumber(estimatedGas)
        .times(gasPrice)
        .integerValue(BigNumber.ROUND_CEIL)
        .toString()
    },
    [chain, carbonFees?.prices, osmosisGas, networks, estimatedGas]
  )

  const gasAmount = getGasAmount(gasDenom)
  const gasFee = { amount: gasAmount, denom: gasDenom, decimals }

  /* tax */
  const taxAmount =
    token && amount && shouldTax
      ? calcMinimumTaxAmount(amount, { rate: taxRate, cap: taxCap })
      : undefined

  /* max */
  const getNativeMax = () => {
    if (!balance) return
    return gasFee.denom === token
      ? new BigNumber(balance)
          .minus(gasFee.amount)
          .minus(taxAmount ?? 0)
          .toString()
      : balance
  }

  const max = !gasFee.amount
    ? undefined
    : isDenom(token)
    ? getNativeMax()
    : balance

  /* (effect): Call the onChangeMax function whenever the max changes */
  useEffect(() => {
    if (max && isMax && onChangeMax) onChangeMax(toInput(max, decimals))
  }, [decimals, isMax, max, onChangeMax])

  /* (effect): Log error on console */
  const failed = getErrorMessage(taxState.error ?? estimatedGasState.error)
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && failed) {
      console.groupCollapsed("Fee estimation failed")
      console.info(
        simulationTx?.msgs.map((msg) => msg.toData(networks[chain].isClassic))
      )
      console.info(failed)
      console.groupEnd()
    }
  }, [failed, simulationTx, networks, chain])

  /* submit */
  const passwordRequired = isWallet.single(wallet)
  const [password, setPassword] = useState("")
  const [rememberPassword, setRememberPassword] = useState(
    shouldStorePassword()
  )
  const [showPasswordInput, setShowPasswordInput] = useState(false)
  const [incorrect, setIncorrect] = useState<string>()
  const [feesReady, setFeesReady] = useState(false)
  const navigate = useNavigate()

  // autofill stored password if exists
  useEffect(() => {
    getStoredPassword().then((password) => {
      setPassword(password ?? "")
      setShowPasswordInput(!password)
    })
  }, []) // eslint-disable-line

  const disabled = estimatedGasState.isLoading
    ? t("Estimating fee...")
    : taxState.isLoading
    ? t("Loading tax data...")
    : taxState.error
    ? t("Failed to load tax data")
    : estimatedGasState.error
    ? t("Fee estimation failed")
    : isBroadcasting
    ? t("Broadcasting a tx...")
    : props.disabled || ""

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<Error>()
  const toPostMultisigTx = useToPostMultisigTx()
  const submit = async (values: TxValues) => {
    setSubmitting(true)

    try {
      if (disabled) throw new Error(disabled)
      if (
        !estimatedGas ||
        !setFeesReady ||
        (!has(gasAmount) && networks[chain]?.gasPrices[gasDenom])
      )
        throw new Error("Fee is not estimated")

        const gasCoins = new Coins([Coin.fromData(gasFee)])
        const taxCoin =
          token && taxAmount && has(taxAmount) && new Coin(token, taxAmount)
        const taxCoins = sanitizeTaxes(taxes) ?? taxCoin
        const feeCoins = taxCoins ? gasCoins.add(taxCoins) : gasCoins
        const fee = new Fee(estimatedGas, feeCoins)

      const tx = { ...createTx(values), fee, memo } as CreateTxOptions

      if (!tx) throw new Error("Tx is not defined")

      if (isWallet.multisig(wallet)) {
        // TODO: broadcast only to terra if wallet is multisig
        const unsignedTx = await auth.create(tx)
        const { pathname, search } = toPostMultisigTx(unsignedTx)
        openURL([pathname, search].join("?"))
        return
      } else if (wallet) {
        const result = await auth.post(tx,
          password,
          undefined,
          // use broadcast mode = "block" if we are not showing the broadcast loader
          isIbc || hideLoader
        )

        if (!hideLoader && !isIbc) {
          setLatestTx({
            txhash: result.txhash,
            queryKeys,
            onSuccess: onSuccess,
            redirectAfterTx: redirectAfterTx,
            chainID: chain,
          })
        } else {
          // refetch balances and standard post-tx stuff
          queryKeys?.forEach((queryKey) => {
            queryClient.invalidateQueries(queryKey)
          })
          queryClient.invalidateQueries(queryKey.History)
          queryClient.invalidateQueries(queryKey.bank.balances)
          queryClient.invalidateQueries(queryKey.tx.create)

          // if the transaction is an ibc one start the IBC tracking
          isIbc && trackIbcTx({ ...(result as any), chain } as ActivityItem)
          // add the transaction to the activity cache so it shows up immediately on the activity list
          addCachedTx({ ...(result as any), chain } as ActivityItem)
          // run the onSuccess function if it has been set
          onSuccess?.()
          // navigate to the activity page
          navigate("/#1")
        }
      }

      onPost?.()
    } catch (error) {
      setError(error as Error)
    }

    setSubmitting(false)
  }

  const submittingLabel =
    hideLoader || isIbc ? t("Broadcasting") : t("Submitting")

  const availableGasDenoms = useMemo(() => {
    return Object.keys(networks[chain]?.gasPrices ?? {})
  }, [chain, networks])

  useEffect(() => {
    if (availableGasDenoms.includes(gasDenom)) return
    setGasDenom(availableGasDenoms[0])
  }, [availableGasDenoms, gasDenom])

  /* element */
  const resetMax = () => setIsMax(false)
  const renderMax: RenderMax = (onClick) => {
    if (!(max && has(max))) return null

    return (
      <button
        type="button"
        className={cx({ muted: !isMax })}
        onClick={onClick ? () => onClick(max) : () => setIsMax(!isMax)}
      >
        <Flex gap={4}>
          <AccountBalanceWalletIcon
            fontSize="inherit"
            className={styles.icon}
          />
          <Read amount={max} token={baseDenom ?? token} decimals={decimals} />
        </Flex>
      </button>
    )
  }

  const renderFee = (
    descriptions?: { label: ReactNode; value: ReactNode }[]
  ) => {
    return (
      <DisplayFees
        chainID={chain}
        gas={estimatedGas}
        gasDenom={gasDenom}
        setGasDenom={setGasDenom}
        descriptions={descriptions}
        onReady={(state: boolean) => setFeesReady(state)}
      />
    )
  }

  const walletError = !availableGasDenoms.length
    ? t("Insufficient balance to pay transaction fee")
    : isWalletEmpty
    ? t("Coins required to post transactions")
    : ""

  const submitButton = (
    <>
      {walletError && <Banner variant="error" title={walletError} />}

      {!addresses ? (
        <ConnectWallet
          renderButton={(open) => (
            <Button
              variant="secondary"
              onClick={open}
              label={t("Connect wallet")}
            />
          )}
        />
      ) : (
        <Grid gap={12}>
          {failed && <Banner variant="error" title={failed} />}
          {passwordRequired && showPasswordInput && !incorrect && (
            <>
              <InputWrapper label={t("Password")} error={incorrect}>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setIncorrect(undefined)
                    setPassword(e.target.value)
                  }}
                />
              </InputWrapper>

              <InputWrapper>
                <Checkbox
                  label={t("Save password")}
                  checked={rememberPassword}
                  onChange={() => setRememberPassword((r) => !r)}
                />
              </InputWrapper>
            </>
          )}

          {error && (isIbc || hideLoader) && (
            <Banner variant="error" title={error.message} />
          )}

          {feesReady && (
            <SubmitButton
              variant="primary"
              className={styles.submit}
              icon={<CheckCircleIcon />}
              disabled={
                !estimatedGas || !!disabled || !!walletError || !feesReady
              }
              loading={submitting}
              label={(submitting ? submittingLabel : disabled) || t("Submit")}
            />
          )}
        </Grid>
      )}
    </>
  )

  const modal =
    !error || isIbc || hideLoader
      ? undefined
      : {
          title: error?.toString().includes("UserDenied")
            ? t("Transaction was denied by user")
            : t("Error"),
          children: error?.toString().includes("UserDenied") ? null : (
            <Pre height={120} normal break>
              {error.message}
            </Pre>
          ),
        }

  return (
    <>
      {children({
        max: { amount: max ?? "0", render: renderMax, reset: resetMax },
        fee: { render: renderFee, ...gasFee },
        submit: { fn: submit, button: submitButton },
      })}

      {modal && (
        <Modal
          {...modal}
          icon={<ErrorOutlineIcon fontSize="inherit" className="danger" />}
          onRequestClose={() => setError(undefined)}
          isOpen
        />
      )}
    </>
  )
}

export default Tx

/* utils */
export const calcMinimumTaxAmount = (
  amount: BigNumber.Value,
  { rate, cap }: { rate: BigNumber.Value; cap: BigNumber.Value }
) => {
  return BigNumber.min(new BigNumber(amount).times(rate), cap)
    .integerValue(BigNumber.ROUND_FLOOR)
    .toString()
}

const sanitizeTaxes = (taxes?: Coins) => {
  return taxes?.toArray().filter((tax) => has(tax.amount.toString())).length
    ? taxes
    : undefined
}

/* hooks */
export const useTxKey = () => {
  const { txhash } = useRecoilValue(latestTxState)
  const [key, setKey] = useState(txhash)

  useEffect(() => {
    if (txhash) setKey(txhash)
  }, [txhash])

  return key
}
