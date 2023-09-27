import { useTranslation } from "react-i18next"
import { useThemeFavicon } from "data/settings/Theme"
import styles from "./Login.module.scss"
import ExtensionPage from "extension/components/ExtensionPage"
import { Input, InputWrapper, SubmitButton } from "station-ui"
import { atom, useRecoilState } from "recoil"
import { useRef, useState } from "react"

const loginState = atom<boolean>({
  key: "login-state",
  default: sessionStorage.getItem("login-state") === "true",
})

export const useLogin = () => {
  const [isLoggedIn, setIsLoggedin] = useRecoilState(loginState)

  return {
    isLoggedIn,
    login: () => {
      sessionStorage.setItem("login-state", "true")
      setIsLoggedin(true)
    },
    logout: () => {
      sessionStorage.setItem("login-state", "false")
      setIsLoggedin(false)
    },
  }
}

const Login = () => {
  const { t } = useTranslation()
  const icon = useThemeFavicon()

  const { login } = useLogin()
  const password = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<boolean>(false)

  function submit() {
    if (!password.current?.value) return setError(true)
    // TODO: validate password
    login()
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
        <form className={styles.password__container} onSubmit={submit}>
          <InputWrapper
            label={t("Password")}
            error={error ? t("Invalid password") : undefined}
          >
            <Input type="password" ref={password} />
          </InputWrapper>
          <SubmitButton variant="secondary" label={t("Sumbit")} />
        </form>
      </main>
    </ExtensionPage>
  )
}

export default Login
