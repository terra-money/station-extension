import {
  isLoginNeeded,
  isPasswordValid,
  lockWallet,
  setLogin,
  setShouldStorePassword,
  shouldStorePassword,
  storePassword,
} from "auth/scripts/keystore"
import {
  Checkbox,
  CornerBackgroundLogo,
  FlexColumn,
  Input,
  InputWrapper,
  StationIcon,
  SubmitButton,
} from "@terra-money/station-ui"
import ExtensionPage from "extension/components/ExtensionPage"
import { useEffect, useMemo, useRef, useState } from "react"
// import { useThemeFavicon } from "data/settings/Theme"
import { useTranslation } from "react-i18next"
import { atom, useRecoilState } from "recoil"
import styles from "./Login.module.scss"
import { useLocation, useNavigate } from "react-router-dom"
import Forgot from "./Forgot"

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
    login: (password: string): boolean => {
      if (!isPasswordValid(password)) {
        return false
      }
      setLogin(true)
      setLoginState({
        isLoading: false,
        isLoggedIn: true,
      })
      return true
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
  // const icon = useThemeFavicon()
  const navigate = useNavigate()
  const location = useLocation()

  const { login } = useLogin()
  const password = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | undefined>(undefined)
  const [isValid, setIsValid] = useState<boolean>(false)
  const [rememberPassword, setRememberPassword] = useState<boolean>(
    shouldStorePassword()
  )

  const greeting = useMemo(() => getRandomGreetings(), [])

  const submit = async () => {
    try {
      if (!password.current?.value) return setError("Password is required")
      if (!login(password.current?.value)) {
        setError("Invalid password")
        setIsValid(false)
        return
      }

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

  const ForgotButton = () => {
    return (
      <button
        type="button"
        className={styles.forgot__button}
        onClick={() => navigate("/forgot")}
      >
        {t("Forgot password?")}
      </button>
    )
  }

  if (location.pathname === "/forgot") {
    return <Forgot />
  }

  return (
    <ExtensionPage fullHeight>
      <main className={styles.login__container}>
        <CornerBackgroundLogo className={styles.logo__background} />
        <FlexColumn align={"center"} className={styles.login} gap={16}>
          <StationIcon width={57} height={54} />
          <h1 className={styles.title}>{t(greeting)}</h1>
          <p className={styles.content}>
            {t(
              "You have been logged out, please enter your password to unlock Station."
            )}
          </p>
        </FlexColumn>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <FlexColumn gap={24}>
            <FlexColumn gap={8} align="flex-start">
              <InputWrapper
                label={t("Password")}
                error={error}
                extra={<ForgotButton />}
              >
                <Input
                  type="password"
                  ref={password}
                  onChange={(e) => {
                    setIsValid(!!e.target.value)
                    setError(undefined)
                  }}
                />
              </InputWrapper>
              <Checkbox
                label={t("Save password")}
                checked={rememberPassword}
                onChange={(e) => setRememberPassword(e.target.checked)}
                className={styles.checkbox__override}
              />
            </FlexColumn>
            <SubmitButton
              variant="primary"
              label={t("Login")}
              disabled={!isValid}
            />
          </FlexColumn>
        </form>
      </main>
    </ExtensionPage>
  )
}

export default Login
