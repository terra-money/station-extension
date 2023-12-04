import { useTranslation } from "react-i18next"
import styles from "./GasHelper.module.scss"
import { useNativeDenoms } from "data/token"
import {
  Banner,
  Dropdown,
  FlexColumn,
  Grid,
  Input,
  InputWrapper,
  LoadingCircular,
  SubmitButton,
} from "@terra-money/station-ui"
import {
  SkipTxStatus,
  checkSkipTxStatus,
  useIsBalanceEnough,
  useSubmitTx,
  useSwapRoute,
  useSwappableDenoms,
} from "./utils"
import { useEffect, useState } from "react"
import { useNetwork } from "data/wallet"
import { Read } from "components/token"
import { isWallet, useAuth } from "auth"
import { Fee } from "@terra-money/feather.js"
import { getStoredPassword } from "auth/scripts/keystore"
import { useThemeAnimation } from "data/settings/Theme"

const SEPARATOR = "°"

export default function GasHelper({
  chainID,
  gas,
  gasPrice,
  gasDenom,
  onSuccess,
}: {
  chainID: string
  gas: number
  gasPrice: number
  gasDenom: string
  onSuccess: () => void
}) {
  const { t } = useTranslation()
  const networks = useNetwork()
  const readNativeDenom = useNativeDenoms()
  const swappableDenoms = useSwappableDenoms()
  const loadingAnimation = useThemeAnimation()
  const { wallet } = useAuth()
  const [swapDenom, setSwapDenom] = useState<string>("")
  const {
    data: swapData,
    isLoading,
    isError,
  } = useSwapRoute({
    toDenom: gasDenom,
    toChain: chainID,
    fromDenom: swapDenom.split(SEPARATOR)[0],
    fromChain: swapDenom.split(SEPARATOR)[1],
    finalAmount: Math.ceil(gasPrice * gas * 1.2),
  })
  const { isBalanceEnough } = useIsBalanceEnough()
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
  const [error, setError] = useState<string | null>(null)
  const [txhash, setTxhash] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getStoredPassword().then((password) => {
      password
        ? setPasswordState({ password, loading: false, stored: true })
        : setPasswordState({ password: "", loading: false, stored: false })
    })
  }, []) // eslint-disable-line

  useEffect(() => {
    if (txhash) {
      const int = setInterval(() => {
        checkSkipTxStatus(txhash, swapDenom.split(SEPARATOR)[1]).then(
          ({ state, error }) => {
            if (state === SkipTxStatus.SUCCESS) {
              onSuccess()
              setTxhash(null)
              clearInterval(int)
            } else if (state === SkipTxStatus.FAILED) {
              // TODO: show actual error code
              setError(error || t("Transaction failed"))
              setTxhash(null)
              clearInterval(int)
            }
          }
        )
      }, 5 * 1000)

      return () => clearInterval(int)
    }
  }, [txhash]) // eslint-disable-line

  const insufficientBalance = !isBalanceEnough(
    swapDenom.split(SEPARATOR)[0],
    swapDenom.split(SEPARATOR)[1],
    Number(swapData?.amount) + Number(swapData?.gasAmount)
  )

  if (submitting || txhash) {
    return (
      <section className={styles.card}>
        <FlexColumn gap={20}>
          <img
            width={80}
            height={80}
            src={loadingAnimation}
            alt={t("Loading...")}
          />
          <p>{t("Loading...")}</p>
        </FlexColumn>
      </section>
    )
  }

  // gas helper not supported for multisig wallets
  if (isWallet.multisig(wallet)) {
    return (
      <section className={styles.card}>
        <h3 className={styles.title}>{t("Not Enough Gas!")}</h3>
        <p className={styles.description}>
          {t(
            "You don't have enough {{token}} to complete all the steps in this transaction.",
            { token: readNativeDenom(gasDenom, chainID).symbol }
          )}
        </p>
      </section>
    )
  }

  return (
    <div className={styles.hepler__container}>
      <section className={styles.card}>
        <h3 className={styles.title}>{t("Not Enough Gas!")}</h3>
        <p className={styles.description}>
          {t(
            "You don't have enough {{token}} to complete all the steps in this transaction but we can fix that for you! Please select an available token below to convert for gas fees.",
            { token: readNativeDenom(gasDenom, chainID).symbol }
          )}
        </p>
        <InputWrapper label={t("Available Tokens")}>
          <Dropdown
            options={[
              ...swappableDenoms.map(({ denom, chainID }) => ({
                value: [denom, chainID].join(SEPARATOR),
                label: `${readNativeDenom(denom, chainID).symbol} (${
                  networks[chainID]?.name ?? chainID
                })`,
                image: readNativeDenom(denom, chainID).icon,
              })),
            ]}
            onChange={(value) => setSwapDenom(value)}
            value={swapDenom}
          />
        </InputWrapper>

        {swapData && (
          <Read
            denom={swapDenom.split(SEPARATOR)[0]}
            amount={swapData.amount + swapData.gasAmount}
            decimals={
              readNativeDenom(
                swapDenom.split(SEPARATOR)[0],
                swapDenom.split(SEPARATOR)[1]
              ).decimals
            }
          />
        )}
        {isLoading && <LoadingCircular />}
        {isError ? (
          <Banner
            variant="error"
            title={t("The selected asset cannot be swapped")}
          />
        ) : (
          swapDenom.includes(SEPARATOR) &&
          !isLoading &&
          insufficientBalance && (
            <Banner
              variant="error"
              title={t(
                "You don't have enough {{token}} to complete this operation, please select another token.",
                {
                  token: readNativeDenom(
                    swapDenom.split(SEPARATOR)[0],
                    swapDenom.split(SEPARATOR)[1]
                  ).symbol,
                }
              )}
            />
          )
        )}
      </section>
      {swapData && !isError && !insufficientBalance && (
        <Grid gap={14}>
          {error && <Banner variant="error" title={error} />}
          {!passwordState.stored && !passwordState.loading && (
            <InputWrapper label={t("Password")}>
              <Input
                type="password"
                value={passwordState.password}
                onChange={(e) => {
                  setPasswordState((d) => ({ ...d, password: e.target.value }))
                }}
              />
            </InputWrapper>
          )}
          <SubmitButton
            onClick={() => {
              setSubmitting(true)
              submitTx(
                {
                  chainID: swapDenom.split(SEPARATOR)[1],
                  msgs: [swapData.msg],
                  fee: new Fee(swapData.gasAmount, {
                    [swapDenom.split(SEPARATOR)[0]]: swapData.feeAmount,
                  }),
                },
                passwordState.password
              )
                .then((txhash) => {
                  setTxhash(txhash)
                  setSubmitting(false)
                })
                .catch((e) => {
                  setError(e.message || e.toString() || "Unknown error")
                  setSubmitting(false)
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
  )
}
