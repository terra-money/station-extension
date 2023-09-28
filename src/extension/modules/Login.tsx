import { useTranslation } from "react-i18next"
import { useThemeFavicon } from "data/settings/Theme"
import styles from "./Login.module.scss"
import ExtensionPage from "extension/components/ExtensionPage"
import { Input, InputWrapper, SubmitButton } from "station-ui"
import { atom, useRecoilState } from "recoil"
import { useRef, useState } from "react"
import { isLoginNeeded, lockWallet, unlockWallets } from "auth/scripts/keystore"

const loginState = atom<boolean>({
  key: "login-state",
  default: !isLoginNeeded(),
})

export const useLogin = () => {
  const [isLoggedIn, setIsLoggedin] = useRecoilState(loginState)

  return {
    isLoggedIn,
    login: (password: string) => {
      unlockWallets(password)
      setIsLoggedin(true)
    },
    logout: () => {
      lockWallet()
      setIsLoggedin(false)
    },
  }
}

const Login = () => {
  const { t } = useTranslation()
  const icon = useThemeFavicon()

  const { login } = useLogin()
  const password = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  async function submit() {
    try {
      if (!password.current?.value) return setError("Password is required")
      login(password.current?.value)
    } catch (e) {
      setError("Invalid password")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ExtensionPage fullHeight>
      <main className={styles.login__container}>
        <section className={styles.login}>
          <img src={icon} alt="Station" width={60} />
          <h1 className={styles.title}>{t("Login")}</h1>
          <p className={styles.content}>
            {t(
              "You have been logged out, please enter your password to unlock Station."
            )}
          </p>
        </section>
        <form
          className={styles.password__container}
          onSubmit={() => {
            setIsSubmitting(true)
            submit()
          }}
        >
          <InputWrapper label={t("Password")} error={error}>
            <Input type="password" ref={password} />
          </InputWrapper>
          <SubmitButton
            variant="secondary"
            label={t("Sumbit")}
            loading={isSubmitting}
          />
        </form>
      </main>
    </ExtensionPage>
  )
}

export default Login
