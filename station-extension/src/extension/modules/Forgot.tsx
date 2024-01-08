import ExtensionPage from "extension/components/ExtensionPage"
import {
  LockIcon,
  Banner,
  Checkbox,
  Button,
  Grid,
  Form,
} from "@terra-money/station-ui"
import { useTranslation } from "react-i18next"
import styles from "./Login.module.scss"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { FlexColumn } from "components/layout"

interface Values {
  checked: boolean
}

const Forgot = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const form = useForm<Values>({
    mode: "onChange",
    defaultValues: { checked: false },
  })
  const reset = async () => {
    window.location.reload()
    localStorage.clear()
    sessionStorage.clear()
    navigate("/")
  }

  const { register, watch } = form
  const { checked } = watch()

  return (
    <ExtensionPage title={t("Forgot Password?")} backButtonPath="/" fullHeight>
      <Form>
        <Grid gap={50} rows={2}>
          <FlexColumn gap={24}>
            <LockIcon width={54} height={54} fill={"var(--danger)"} />
            <p className={styles.content}>
              {t(
                "If you have forgotten your password, you will need to reset Station and re-import your connected wallets."
              )}
            </p>
          </FlexColumn>
          <FlexColumn gap={24}>
            <Banner
              variant="error"
              title={t(
                "Resetting Station will remove your connected wallets, and you will have to re-enter the seed phrase for each one again. If you don’t have access to your seed phrases, you will lose access to your wallets forever."
              )}
            />
            <Checkbox
              checked={checked}
              {...register("checked")}
              label={t("I have access to my seed phrase(s)")}
            />
            <Button
              icon={<LockIcon fill={"var(--danger)"} />}
              style={{ width: "100%" }}
              disabled={!checked}
              onClick={reset}
              variant="warning"
            >
              {t("Reset Station")}
            </Button>
          </FlexColumn>
        </Grid>
      </Form>
    </ExtensionPage>
  )
}

export default Forgot
