import { useTranslation } from "react-i18next"
import styles from "./GasHelper.module.scss"
import { useNativeDenoms } from "data/token"
import {
  AssetSelectorFrom,
  Banner,
  Flex,
  GasHelperCard,
  GasIcon,
  Grid,
  Input,
  InputWrapper,
  LoadingCircular,
  Modal,
  SubmitButton,
  WalletIcon,
} from "@terra-money/station-ui"
import {
  useIsBalanceEnough,
  useIsBalanceLoading,
  useSubmitTx,
  useSwapRoute,
  useSwappableDenoms,
} from "./utils"
import { useEffect, useState } from "react"
import { useChainID, useNetwork } from "data/wallet"
import { Read } from "components/token"
import { isWallet, useAuth } from "auth"
import { Fee, TxInfo } from "@terra-money/feather.js"
import { getStoredPassword } from "auth/scripts/keystore"
import SwapTokenSelector from "txs/swap/components/SwapTokenSelector"
import { useExchangeRates } from "data/queries/coingecko"
import { useCurrency } from "data/settings/Currency"

interface State {
  tx?: TxInfo
  time?: number
  submitting: boolean
  chainID?: string
}

export default function GasHelper({
  chainID,
  gas,
  gasPrice,
  gasDenom,
  setState,
}: {
  chainID: string
  gas: number
  gasPrice: number
  gasDenom: string
  setState: (state: State | ((s: State) => State)) => void
}) {
  const { t } = useTranslation()
  const networks = useNetwork()
  const readNativeDenom = useNativeDenoms()
  const swappableDenoms = useSwappableDenoms()
  const { wallet } = useAuth()
  const { data: prices } = useExchangeRates()
  const { symbol: currency } = useCurrency()

  const terraChainID = useChainID()
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [swapDenom, setSwapDenom] = useState<{
    denom: string
    chainId: string
  }>({ denom: "uluna", chainId: terraChainID })
  const isBalanceLoading = useIsBalanceLoading(swapDenom.chainId)
  const readSwapDenom = readNativeDenom(swapDenom.denom, swapDenom.chainId)

  const offerAsset = {
    symbol: readSwapDenom.symbol,
    icon: readSwapDenom.icon,
    chainName: networks[swapDenom.chainId]?.name,
    chainIcon: networks[swapDenom.chainId]?.icon,
  }
  const [swapAmount, setSwapAmount] = useState<number | undefined>()
  const {
    data: minimumSwapData,
    isLoading: minimumLoading,
    isError: minimumError,
  } = useSwapRoute({
    toDenom: gasDenom,
    toChain: chainID,
    fromDenom: swapDenom.denom,
    fromChain: swapDenom.chainId,
    amount: Math.ceil(gasPrice * gas * 1.2),
    type: "out",
  })

  const isDefaultAmount =
    minimumLoading || !swapAmount || swapAmount === minimumSwapData?.amount_in

  const isLessThanMinimum =
    minimumSwapData && (swapAmount ?? 0) < minimumSwapData.amount_in

  const {
    data: fixedSwapData,
    isLoading: fixedLoading,
    isError: fixedError,
  } = useSwapRoute(
    {
      toDenom: gasDenom,
      toChain: chainID,
      fromDenom: swapDenom.denom,
      fromChain: swapDenom.chainId,
      amount: swapAmount ?? 0,
      type: "in",
    },
    isDefaultAmount || minimumError || !swapAmount
  )

  const isLoading = isDefaultAmount
    ? minimumLoading
    : minimumLoading || fixedLoading
  const isError = isDefaultAmount ? minimumError : minimumError || fixedError
  const gasAmount = isDefaultAmount
    ? Number(minimumSwapData?.gasAmount)
    : Number(fixedSwapData?.gasAmount) ?? Number(minimumSwapData?.gasAmount)
  const feeAmount = isDefaultAmount
    ? Number(minimumSwapData?.feeAmount)
    : Number(fixedSwapData?.feeAmount) ?? Number(minimumSwapData?.feeAmount)
  const txsNumber = Math.ceil(
    (fixedSwapData?.amount_out ?? 0) / Math.ceil(gasPrice * gas * 1.2)
  )

  useEffect(() => {
    if (minimumSwapData?.amount_in && !swapAmount)
      setSwapAmount(minimumSwapData.amount_in)
  }, [minimumSwapData?.amount_in]) // eslint-disable-line

  const { isBalanceEnough, getBalanceAmount } = useIsBalanceEnough()
  const submitTx = useSubmitTx()
  const [passwordState, setPasswordState] = useState<{
    password: string
    loading: boolean
    stored: boolean
  }>({
    password: "",
    loading: true,
    stored: false,
  })

  useEffect(() => {
    getStoredPassword().then((password) => {
      password
        ? setPasswordState({ password, loading: false, stored: true })
        : setPasswordState({ password: "", loading: false, stored: false })
    })
  }, []) // eslint-disable-line

  const insufficientBalance =
    !isBalanceLoading &&
    !isBalanceEnough(
      swapDenom.denom,
      swapDenom.chainId,
      (swapAmount ?? 0) + feeAmount
    )

  // gas helper not supported for multisig wallets
  if (isWallet.multisig(wallet)) {
    return (
      <GasHelperCard className={styles.card} progressColor="gray">
        <h3 className={styles.title}>{t("Not Enough Gas!")}</h3>
        <p className={styles.description}>
          {t(
            "You don't have enough {{token}} to complete all the steps in this transaction.",
            { token: readNativeDenom(gasDenom, chainID).symbol }
          )}
        </p>
      </GasHelperCard>
    )
  }

  return (
    <>
      <Modal
        isOpen={!!isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        title={t("Select Asset")}
      >
        <SwapTokenSelector
          tokenOnClick={(t) => {
            setSwapAmount(undefined)
            setSwapDenom(t)
            setModalOpen(false)
          }}
          tokens={swappableDenoms.map(({ denom, chainID }) => {
            const {
              name,
              symbol,
              token: originDenom,
              decimals,
              icon,
            } = readNativeDenom(denom, chainID)

            return {
              name,
              symbol,
              denom,
              originDenom,
              decimals,
              chainId: chainID,
              balance: `${getBalanceAmount(denom, chainID) ?? 0}`,
              value:
                (getBalanceAmount(denom, chainID) / 10 ** decimals) *
                  (prices?.[originDenom]?.price ?? 0) ?? 0,
              price: prices?.[originDenom]?.price ?? 0,
              chain: networks[chainID],
              icon,
            }
          })}
        />
      </Modal>
      <div className={styles.hepler__container}>
        <GasHelperCard className={styles.card} progressColor="gray">
          <h3 className={styles.title}>
            <GasIcon fill="var(--token-warning-500)" width={20} height={20} />{" "}
            {t("Not Enough Gas!")}
          </h3>
          <p className={styles.description}>
            {t(
              "You don't have enough {{token}} to complete all the steps in this transaction, but we can fix that for you! Please select an available token below to convert for gas fees.",
              { token: readNativeDenom(gasDenom, chainID).symbol }
            )}
          </p>
          <div className={styles.asset__selector__container}>
            <AssetSelectorFrom
              extra={
                <Flex justify="space-between">
                  <Flex gap={8} justify="flex-start">
                    <WalletIcon fill="currentColor" width={12} height={12} />
                    <p>
                      <Read
                        className={
                          insufficientBalance
                            ? styles.amount__error
                            : styles.amount
                        }
                        amount={getBalanceAmount(
                          swapDenom.denom,
                          swapDenom.chainId
                        )}
                        decimals={readSwapDenom.decimals}
                        fixed={2}
                      />{" "}
                      {readSwapDenom.symbol}
                    </p>
                  </Flex>
                  {!isDefaultAmount && !!minimumSwapData?.amount_in && (
                    <button
                      onClick={() => setSwapAmount(minimumSwapData.amount_in)}
                    >
                      {t("RESET")}
                    </button>
                  )}
                </Flex>
              }
              symbol={offerAsset.symbol}
              chainIcon={offerAsset.chainIcon}
              chainName={offerAsset.chainName}
              tokenIcon={offerAsset.icon ?? ""}
              onSymbolClick={() => setModalOpen(true)}
              currencyAmount={
                currency +
                " " +
                (
                  ((swapAmount ?? 0) / 10 ** readSwapDenom.decimals) *
                  (prices?.[readSwapDenom.token]?.price ?? 0)
                ).toFixed(2)
              }
              amountInputAttrs={{
                value:
                  swapAmount === undefined
                    ? ""
                    : `${swapAmount / 10 ** readSwapDenom.decimals}`,
                onChange: (e) =>
                  setSwapAmount(
                    e.target.value
                      ? Math.round(
                          Number(e.target.value) * 10 ** readSwapDenom.decimals
                        )
                      : undefined
                  ),
              }}
            />
          </div>

          {isLoading ? (
            <Flex className={styles.loader__container}>
              <LoadingCircular />
            </Flex>
          ) : isError ? (
            <div className={styles.error__banner__container}>
              <Banner
                variant="error"
                title={t("The selected asset cannot be swapped")}
              />
            </div>
          ) : !isLoading && insufficientBalance ? (
            <div className={styles.error__banner__container}>
              <Banner
                variant="error"
                title={t(
                  "You need at least {{required_amount}} {{token}} to convert for gas fees, but you only have {{balance}} {{token}} in your wallet",
                  {
                    required_amount:
                      ((swapAmount ?? 0) + feeAmount) /
                      10 ** readSwapDenom.decimals,
                    token: readSwapDenom.symbol,
                    balance:
                      getBalanceAmount(swapDenom.denom, swapDenom.chainId) /
                      10 ** readSwapDenom.decimals,
                  }
                )}
              />
            </div>
          ) : (
            <Grid gap={16} style={{ marginTop: 24 }}>
              <Flex
                justify="space-between"
                className={styles.amount__container}
              >
                <p>{t("Minimum Required")}</p>
                <Read
                  className={
                    insufficientBalance
                      ? styles.amount__error
                      : isLessThanMinimum
                      ? styles.amount__warning
                      : styles.amount
                  }
                  denom={swapDenom.denom}
                  amount={minimumSwapData?.amount_in}
                  decimals={readSwapDenom.decimals}
                />
              </Flex>
              <Flex
                justify="space-between"
                className={styles.amount__container}
              >
                <p>{t("Transaction Fee")}</p>
                <Read
                  className={
                    insufficientBalance ? styles.amount__error : styles.amount
                  }
                  denom={swapDenom.denom}
                  amount={feeAmount}
                  decimals={readSwapDenom.decimals}
                />
              </Flex>

              {!isDefaultAmount && !!fixedSwapData && (
                <Flex
                  justify="space-between"
                  className={styles.amount__container}
                >
                  <p>
                    {fixedSwapData.amount_in / 10 ** readSwapDenom.decimals}{" "}
                    {readSwapDenom.symbol} ={" "}
                    {fixedSwapData.amount_out /
                      10 ** readNativeDenom(gasDenom, chainID).decimals}{" "}
                    {readNativeDenom(gasDenom, chainID).symbol}
                  </p>
                  <p
                    className={
                      !txsNumber ? styles.amount__error : styles.amount
                    }
                  >
                    ~ {txsNumber} Txs
                  </p>
                </Flex>
              )}
            </Grid>
          )}
        </GasHelperCard>

        {!isLoading &&
          !isError &&
          !insufficientBalance &&
          !isLessThanMinimum && (
            <Grid gap={14}>
              {error && <Banner variant="error" title={error} />}
              {!passwordState.stored && !passwordState.loading && (
                <InputWrapper label={t("Password")}>
                  <Input
                    type="password"
                    value={passwordState.password}
                    onChange={(e) => {
                      setPasswordState((d) => ({
                        ...d,
                        password: e.target.value,
                      }))
                    }}
                  />
                </InputWrapper>
              )}
              <SubmitButton
                onClick={() => {
                  setState({
                    submitting: true,
                    time: new Date().getTime(),
                    chainID: swapDenom.chainId,
                  })
                  submitTx(
                    {
                      chainID: swapDenom.chainId,
                      msgs: [
                        isDefaultAmount
                          ? minimumSwapData!.msg
                          : fixedSwapData!.msg,
                      ],
                      fee: new Fee(gasAmount, {
                        [swapDenom.denom]: feeAmount,
                      }),
                    },
                    passwordState.password
                  )
                    .then((tx) => {
                      setState((s) => ({
                        ...s,
                        tx,
                      }))
                    })
                    .catch((e) => {
                      setError(e.message || e.toString() || "Unknown error")
                      setState({
                        submitting: false,
                      })
                    })
                }}
                label={t("Get me some gas!")}
                loading={isLoading || passwordState.loading}
                disabled={
                  isLoading || !passwordState.password || passwordState.loading
                }
              />
            </Grid>
          )}
      </div>
    </>
  )
}
