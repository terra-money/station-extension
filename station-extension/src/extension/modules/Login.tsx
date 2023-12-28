import {
  isLoginNeeded,
  lockWallet,
  setShouldStorePassword,
  shouldStorePassword,
  storePassword,
  unlockWallets,
} from "auth/scripts/keystore"
import {
  Checkbox,
  Input,
  InputWrapper,
  StationIcon,
  SubmitButton,
} from "@terra-money/station-ui"
import ExtensionPage from "extension/components/ExtensionPage"
import { useEffect, useMemo, useRef, useState } from "react"
import { useThemeFavicon } from "data/settings/Theme"
import { useTranslation } from "react-i18next"
import { atom, useRecoilState } from "recoil"
import styles from "./Login.module.scss"

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

function getMomentOfTheDay() {
  const hour = new Date().getHours()

  if (hour >= 3 && hour < 12) {
    return "morning"
  } else if (hour >= 12 && hour < 18) {
    return "afternoon"
  } else if (hour >= 18 && hour < 21) {
    return "evening"
  }
}

function getRandomGreetings() {
  const greetings = [
    "Welcome back!",
    "Hey there!",
    "Nice to see you again!",
    getMomentOfTheDay() && `Good ${getMomentOfTheDay()}!`,
  ].filter((g) => !!g) as string[]

  return greetings[Math.floor(Math.random() * greetings.length)]
}

const Login = () => {
  const { t } = useTranslation()
  const icon = useThemeFavicon()

  const { login } = useLogin()
  const password = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | undefined>(undefined)
  const [isValid, setIsValid] = useState<boolean>(false)
  const [rememberPassword, setRememberPassword] = useState<boolean>(
    shouldStorePassword()
  )

  const greeting = useMemo(() => getRandomGreetings(), [])

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
      setIsValid(false)
    }
  }

  return (
    <ExtensionPage fullHeight>
      <main className={styles.login__container}>
        <section className={styles.login}>
          <StationIcon width={57} height={57} />
          <h1 className={styles.title}>{t(greeting)}</h1>
          <p className={styles.content}>
            {t(
              "You have been logged out, please enter your password to unlock Station."
            )}
          </p>
        </section>
        <form
          className={styles.password__container}
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <InputWrapper label={t("Password")} error={error}>
            <Input
              type="password"
              ref={password}
              onChange={(e) => {
                setIsValid(!!e.target.value)
                setError(undefined)
              }}
            />
          </InputWrapper>
          <InputWrapper>
            <Checkbox
              label={t("Save password")}
              checked={rememberPassword}
              onChange={(e) => setRememberPassword(e.target.checked)}
            />
          </InputWrapper>
          <SubmitButton
            variant="primary"
            label={t("Login")}
            disabled={!isValid}
          />
        </form>
      </main>
    </ExtensionPage>
  )
}

export default Login
