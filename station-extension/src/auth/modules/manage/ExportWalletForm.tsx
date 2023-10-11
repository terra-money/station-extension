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
  Flex,
  Copy,
  Banner,
  Button,
} from "station-ui"
import { isPasswordValid } from "auth/scripts/keystore"
import styles from "./ExportWalletForm.module.scss"
import { useNavigate } from "react-router-dom"

interface Values {
  password: string
}

interface Props {
  walletName: string
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

  /* submit */
  const [encoded, setEncoded] = useState<string>()
  const submit = ({ password }: Values) => {
    if (!isPasswordValid(password)) {
      setError("password", { message: t("Invalid password") })
      return
    }

    const encoded = encodeEncryptedWallet(walletName, password)
    setEncoded(encoded)
  }

  if (encoded) {
    return (
      <FlexColumn gap={24}>
        <QRCode value={`terrastation://wallet_recover/?payload=${encoded}`} />
        <Banner
          variant="warning"
          title={t(
            "Your seed key gives FULL access to your wallet, make sure to keep it safe!"
          )}
        />
        <InputWrapper label={t("Seed key")} extra={<Copy copyText={encoded} />}>
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
    <Form onSubmit={handleSubmit(submit)} style={{ height: "100%" }}>
      <FlexColumn className={styles.form__container}>
        <InputWrapper label={t("Password")} error={errors.password?.message}>
          <Input {...register("password")} type="password" />
        </InputWrapper>

        <Flex gap={24} className={styles.form__footer}>
          <SubmitButton
            disabled={!password || !isValid}
            variant="secondary"
            label={t("Submit")}
          />
        </Flex>
      </FlexColumn>
    </Form>
  )
}

export default ExportWalletForm
