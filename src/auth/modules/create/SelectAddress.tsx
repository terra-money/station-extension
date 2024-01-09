import { useTranslation } from "react-i18next"
import { useQuery } from "react-query"
import { useForm } from "react-hook-form"
import { readAmount, truncate } from "@terra-money/terra-utils"
import { SeedKey, AccAddress } from "@terra-money/feather.js"
import { Coins } from "@terra-money/feather.js"
import { sortCoins } from "utils/coin"
import { useInterchainLCDClient } from "data/queries/lcdClient"
import { useCurrency } from "data/settings/Currency"
import { useThemeAnimation } from "data/settings/Theme"
import { Flex } from "@terra-money/station-ui"
import { Form, Submit } from "components/form"
import { useCreateWallet } from "./CreateWalletWizard"
import styles from "./SelectAddress.module.scss"
import { useNativeDenoms } from "data/token"
import { Banner, CheckedButton, FlexColumn } from "@terra-money/station-ui"

const SelectAddress = () => {
  const { t } = useTranslation()
  const currency = useCurrency()
  const lcd = useInterchainLCDClient()
  const readNativeDenom = useNativeDenoms()
  const { values, setValues, setStep } = useCreateWallet()
  const { mnemonic, index } = values
  const seed = SeedKey.seedFromMnemonic(mnemonic)

  /* query */
  const { data: results } = useQuery(
    // FIXME: remove mnemonic from this array
    ["mnemonic", seed, index],
    async () => {
      const results = await Promise.allSettled(
        ([330, 118] as const).map(async (bip) => {
          const mk = new SeedKey({ seed, coinType: bip, index })
          const address = mk.accAddress("terra")
          const [balance] = await lcd.bank.balance(address)
          // throws 404 if account doesn't exist
          const accountInfo = await lcd.auth
            .accountInfo(address)
            .catch(() => {})
          return {
            address,
            bip,
            index,
            balance,
            sequence: accountInfo?.getSequenceNumber() ?? 0,
          }
        })
      )

      return results.map((result) => {
        if (result.status === "rejected") throw new Error()
        return result.value
      })
    },
    {
      onSuccess: (results) => {
        const account118 = results.find(({ bip }) => bip === 118)
        if (!account118) return
        const { balance, sequence } = account118
        const is118Empty = !balance.toData().length && !sequence
        if (is118Empty) setStep(3)
      },
    }
  )

  /* form */
  const form = useForm<{ bip?: Bip }>()
  const { watch, setValue, handleSubmit } = form
  const { bip } = watch()

  const submit = ({ bip }: { bip?: Bip }) => {
    if (!bip) return
    setValues({ ...values, coinType: bip })
    setStep(3)
  }

  /* render */
  const animation = useThemeAnimation()

  if (!results)
    return (
      <Flex>
        <img src={animation} width={80} height={80} alt={t("Loading...")} />
      </Flex>
    )

  interface Details {
    address: AccAddress
    bip: Bip
    balance: Coins
    sequence: number
  }

  const renderDetails = ({ address, bip, ...rest }: Details) => {
    const { balance, sequence } = rest
    const coins = sortCoins(balance, currency.id)
    const length = coins.length

    return (
      <section className={styles.selector__container}>
        <div className={styles.selector__title}>
          <h1>m/44'/{bip}'</h1>
          <h4>{truncate(address)}</h4>
        </div>

        <div className={styles.selector__details}>
          <p>
            <span className={styles.muted}>Balance:</span>
            <span>
              {coins
                .slice(0, 1)
                .map((coin) =>
                  [
                    readAmount(coin.amount),
                    readNativeDenom(coin.denom).symbol,
                  ].join(" ")
                )
                .join(", ")}{" "}
              {length - 1 > 0 && (
                <span className="muted">
                  {t("+{{length}} coins", { length: length - 1 })}
                </span>
              )}
            </span>
          </p>

          <p>
            <span className={styles.muted}>Previous Txs:</span>

            <span>{sequence}</span>
          </p>
        </div>
      </section>
    )
  }

  return (
    <FlexColumn justify="space-between" style={{ height: "100%" }}>
      <Form onSubmit={handleSubmit(submit)}>
        <Banner
          variant="warning"
          title={t(
            "There are two wallets sharing this recovery phrase, each with a different token denominator. Please choose which version you want to import."
          )}
        />

        {results.map((item) => {
          return (
            <CheckedButton
              className={styles.button}
              onClick={() => setValue("bip", item.bip)}
              active={item.bip === bip}
              key={item.bip}
            >
              {renderDetails(item)}
            </CheckedButton>
          )
        })}

        <Submit>{t("Import Selected")}</Submit>
      </Form>
    </FlexColumn>
  )
}

export default SelectAddress
