import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Form } from "components/form"
import { deleteWallet, isPasswordValid } from "../../scripts/keystore"
import useAuth from "../../hooks/useAuth"
import {
  Banner,
  Flex,
  Input,
  InputWrapper,
  SubmitButton,
  Button,
  FlexColumn,
  SummaryHeader,
} from "@terra-money/station-ui"
import styles from "./DeleteWalletForm.module.scss"

interface Values {
  password: string
}

interface Props {
  walletName: string
}

const DeleteWalletForm = ({ walletName }: Props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { disconnect } = useAuth()

  const [name, setName] = useState<string | undefined>(walletName)

  /* form */
  const form = useForm<Values>()
  const { register, handleSubmit, formState, setError } = form
  const { isValid, errors } = formState

  /* submit */
  const submit = (values: Values) => {
    if (!name) return
    if (!isPasswordValid(values.password)) {
      setError("password", { message: t("Invalid password") })
      return
    }

    disconnect()
    deleteWallet(walletName)
    setName(undefined)
  }

  return (
    <>
      {!name ? (
        <FlexColumn className={styles.form__container}>
          <SummaryHeader
            statusLabel={t("Success!")}
            statusMessage={t("Wallet removed")}
            status={"success"}
          />

          <Flex gap={24} className={styles.form__footer}>
            <Button
              onClick={() => navigate("/", { replace: true })}
              label={t("Done")}
              variant="primary"
              style={{ width: "100%" }}
            />
          </Flex>
        </FlexColumn>
      ) : (
        <Form onSubmit={handleSubmit(submit)} style={{ height: "100%" }}>
          <FlexColumn className={styles.form__container}>
            <FlexColumn gap={24}>
              <InputWrapper
                label={t("Password")}
                error={errors.password?.message}
              >
                <Input {...register("password")} type="password" />
              </InputWrapper>

              <Banner
                variant="error"
                title={t(
                  "This action can not be undone. You will need a private key or a mnemonic seed phrase to restore this wallet to the app."
                )}
              />
            </FlexColumn>

            <Flex gap={24} className={styles.form__footer}>
              <Button
                onClick={() => navigate("/", { replace: true })}
                label={t("Back")}
                variant="secondary"
                style={{ width: "100%" }}
              />
              <SubmitButton
                disabled={!isValid}
                label={t("Remove")}
                variant="warning"
                style={{ width: "100%" }}
              />
            </Flex>
          </FlexColumn>
        </Form>
      )}
    </>
  )
}

export default DeleteWalletForm
