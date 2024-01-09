import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { Form, Value } from "components/form"
import useAuth from "../../hooks/useAuth"
import QRCode from "../../components/QRCode"
import {
  InputWrapper,
  Input,
  SubmitButton,
  FlexColumn,
  Copy,
  Banner,
  Button,
  NavButton,
  ImportSeedIcon,
  KeyIcon,
} from "@terra-money/station-ui"
import { getWallet, isPasswordValid } from "auth/scripts/keystore"
import styles from "./ExportWalletForm.module.scss"
import { useNavigate } from "react-router-dom"
import { decrypt } from "auth/scripts/aes"

interface Values {
  password: string
}

interface Props {
  walletName: string
}

enum ExportType {
  SEED = "seed key",
  MNEMONIC = "mnemonic phrase",
}

const ExportWalletForm = ({ walletName }: Props) => {
  const { t } = useTranslation()
  const { encodeEncryptedWallet } = useAuth()
  const navigate = useNavigate()

  /* form */
  const form = useForm<Values>()

  const { register, watch, handleSubmit, formState, setError } = form
  const { errors, isValid } = formState
  const { password } = watch()

  const wallet = getWallet(walletName)

  /* submit */
  const [mode, setMode] = useState<ExportType | undefined>(
    wallet.encryptedMnemonic ? undefined : ExportType.SEED
  )
  const [encoded, setEncoded] = useState<string>()

  const submit = ({ password }: Values) => {
    if (!isPasswordValid(password)) {
      setError("password", { message: t("Invalid password") })
      return
    }

    const encoded =
      mode === ExportType.SEED
        ? encodeEncryptedWallet(walletName, password)
        : decrypt(wallet.encryptedMnemonic, password)
    setEncoded(encoded)
  }

  if (!mode) {
    return (
      <FlexColumn gap={32}>
        <FlexColumn gap={8}>
          <NavButton
            icon={<ImportSeedIcon fill="white" />}
            label={t("Recovery Phrase")}
            onClick={() => setMode(ExportType.MNEMONIC)}
          />
          <p className={styles.text}>
            {t("Export your 12 or 24-word recovery phrase.")}
          </p>
        </FlexColumn>
        <FlexColumn gap={8}>
          <NavButton
            icon={<KeyIcon fill="white" />}
            label={t("Seed Key")}
            onClick={() => setMode(ExportType.SEED)}
          />
          <p className={styles.text}>
            {t(
              "Export your seed key.  When importing your wallet utilizing the seed key, make sure to specify the same password you use to log in to this wallet."
            )}
          </p>
        </FlexColumn>
      </FlexColumn>
    )
  }

  if (encoded) {
    return (
      <FlexColumn gap={24}>
        {mode === ExportType.SEED && (
          <QRCode value={`terrastation://wallet_recover/?payload=${encoded}`} />
        )}
        <Banner
          variant="warning"
          title={t(
            "Your {{keyType}} allows for FULL access to your wallet.  Make sure to keep it safe!",
            { keyType: mode }
          )}
        />
        <InputWrapper
          label={
            mode === ExportType.SEED ? t("Seed key") : t("Recovery phrase")
          }
          extra={<Copy copyText={encoded} />}
        >
          <Value>{encoded}</Value>
        </InputWrapper>
        <Button
          variant="primary"
          label={t("Done")}
          onClick={() => navigate("/", { replace: true })}
          className={styles.button}
        />
      </FlexColumn>
    )
  }

  return (
    <Form onSubmit={handleSubmit(submit)} style={{ height: "90%" }}>
      <FlexColumn className={styles.form__container}>
        <InputWrapper label={t("Password")} error={errors.password?.message}>
          <Input {...register("password")} type="password" />
        </InputWrapper>
        <SubmitButton
          className={styles.form__footer}
          disabled={!password || !isValid}
          variant="primary"
          label={t("Submit")}
        />
      </FlexColumn>
    </Form>
  )
}

export default ExportWalletForm
