import { PropsWithChildren } from "react"
import { useNavigate } from "react-router-dom"
import classNames from "classnames"
import { ErrorBoundary } from "components/feedback"
import Container from "../layouts/Container"
import ExtensionFooter from "./ExtensionFooter"
import { BackArrowIcon, CloseIcon } from "@terra-money/station-ui"
import styles from "./ExtensionPageV2.module.scss"

interface Props extends QueryState {
  title?: string
  subtitle?: string
  fullHeight?: boolean
  overNavbar?: boolean
  backButtonPath?: string
  hideCloseButton?: boolean
}

const ExtensionPageV2 = (props: PropsWithChildren<Props>) => {
  const {
    title,
    subtitle,
    fullHeight,
    overNavbar,
    backButtonPath,
    hideCloseButton,
    children,
  } = props
  const cx = classNames.bind(styles)
  const navigate = useNavigate()

  return (
    <Container>
      <article
        className={cx(
          styles.page,
          fullHeight && styles.full__height,
          overNavbar && styles.over__navbar
        )}
      >
        {(title || backButtonPath) && (
          <div className={styles.header__container}>
            {backButtonPath && (
              <button
                className={styles.back__button}
                onClick={() => navigate(backButtonPath)}
              >
                <BackArrowIcon
                  width={20}
                  height={20}
                  fill={"var(--token-light-100)"}
                />
              </button>
            )}

            <header className={cx(styles.header, { [styles.header__with__back]: backButtonPath })}>
              <h1 className={cx(styles.title)}>{title}</h1>
              <h3 className={cx(styles.subtitle)}>
                {subtitle}
              </h3>
            </header>

            {!hideCloseButton && (
              <button type="button" className={styles.close} onClick={() => navigate("/")}>
                <CloseIcon
                  width={16}
                  height={16}
                  className={styles.close__icon}
                  onClick={() => navigate("/")}
                  stroke={"var(--token-light-100)"}
                />
              </button>
            )}
          </div>
        )}

        <section className={cx(styles.main)}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </section>

      </article>
      <ExtensionFooter />
    </Container>
  )
}

export default ExtensionPageV2
