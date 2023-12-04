import { useTranslation } from "react-i18next"
import { useThemeFavicon } from "data/settings/Theme"
import styles from "./Login.module.scss"
import ExtensionPage from "extension/components/ExtensionPage"
import {
  Checkbox,
  Input,
  InputWrapper,
  SubmitButton,
} from "@terra-money/station-ui"
import { atom, useRecoilState } from "recoil"
import { useEffect, useRef, useState } from "react"
import {
  isLoginNeeded,
  lockWallet,
  setShouldStorePassword,
  shouldStorePassword,
  storePassword,
  unlockWallets,
} from "auth/scripts/keystore"

const LOGIN_ATOM = atom<{ isLoggedIn: boolean; isLoading: boolean }>({
  key: "login-state",
  default: {
    isLoggedIn: false,
    isLoading: true,
  },
})

export const useLogin = () => {
  const [loginState, setLoginState] = useRecoilState(LOGIN_ATOM)

  useEffect(() => {
    async function checkLogin() {
      const isNeeded = await isLoginNeeded()
      setLoginState({
        isLoading: false,
        isLoggedIn: !isNeeded,
      })
    }

    if (loginState.isLoading) checkLogin()
  }, []) // eslint-disable-line

  return {
    isLoggedIn: loginState.isLoggedIn,
    isLoading: loginState.isLoading,
    login: (password: string) => {
      unlockWallets(password)
      setLoginState({
        isLoading: false,
        isLoggedIn: true,
      })
    },
    logout: () => {
      lockWallet()
      setLoginState({
        isLoading: false,
        isLoggedIn: false,
      })
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
  const [rememberPassword, setRememberPassword] = useState<boolean>(
    shouldStorePassword()
  )

  async function submit() {
    try {
      if (!password.current?.value) return setError("Password is required")
      login(password.current?.value)

      if (rememberPassword) {
        setShouldStorePassword(true)
        storePassword(password.current?.value)
      } else {
        setShouldStorePassword(false)
      }
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
          <InputWrapper>
            <Checkbox
              label={t("Don't ask for password again")}
              checked={rememberPassword}
              onChange={(e) => setRememberPassword(e.target.checked)}
            />
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
