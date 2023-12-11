import { ErrorBoundary, WithFetching } from "components/feedback"
import { PropsWithChildren, ReactNode } from "react"
import styles from "./ExtensionPageV2.module.scss"
// import { ReactComponent as BackIcon } from "styles/images/icons/BackButton.svg"
import { BackArrowIcon, CloseIcon } from "@terra-money/station-ui"
// import { ReactComponent as CloseIcon } from "styles/images/icons/Close.svg"

import Container from "../layouts/Container"
import { Card } from "components/layout"
import classNames from "classnames"
import ExtensionFooter from "./ExtensionFooter"
import { useNavigate } from "react-router-dom"

interface Props extends QueryState {
  header?: ReactNode
  title?: string
  label?: string
  subtitle?: string
  backButtonPath?: string
  backgroundColor?: "main"
  fullHeight?: boolean
  modal?: boolean
  img?: string | ReactNode
}

const ExtensionPageV2 = (props: PropsWithChildren<Props>) => {
  const {
    header,
    title,
    label,
    subtitle,
    backButtonPath,
    children,
    backgroundColor,
    fullHeight,
    modal,
    img,
  } = props
  console.log(
    "🚀 ~ file: ExtensionPageV2.tsx:38 ~ ExtensionPageV2 ~ backButtonPath:",
    backButtonPath
  )
  const cx = classNames.bind(styles)
  const navigate = useNavigate()

  return (
    <WithFetching {...props}>
      {(progress, wrong) => (
        <>
          {progress}

          <article
            className={cx(
              styles.page,
              fullHeight && styles.full__height,
              modal && styles.modal
            )}
          >
            {/* {header && (
              <header className={styles.header}>
                <Container className={styles.container}>{header}</Container>
              </header>
            )} */}

            <Container
              className={cx(
                styles.container,
                modal && backButtonPath && styles.container__with__back__icon
              )}
            >
              <header className={styles.header}>
                <div className={styles.left__wrapper}>
                  {backButtonPath && (
                    <BackArrowIcon
                      fill={"var(--token-light-100)"}
                      className={styles.back__icon}
                      width={20}
                      height={20}
                      onClick={() => navigate(backButtonPath)}
                    />
                  )}
                  {header ? (
                    <div className={styles.header__container}>{header}</div>
                  ) : (
                    <div className={styles.title__container}>
                      <h1
                        className={cx(
                          styles.title,
                          subtitle && styles.with_subtitle
                        )}
                      >
                        {title}
                      </h1>
                      {/* {label && <h5 className={styles.label}>{label}</h5>}
                      {subtitle && (
                        <h3
                          className={cx(
                            backButtonPath
                              ? styles.small__subtitle
                              : styles.subtitle
                          )}
                        >
                          {subtitle}
                        </h3>
                      )} */}
                    </div>
                  )}
                </div>
                {modal && (
                  <CloseIcon
                    width={16}
                    height={16}
                    className={styles.modal__close__icon}
                    onClick={() => navigate("/")}
                    stroke="var(--token-light-100)"
                  />
                )}
              </header>
            </Container>
            {wrong ? (
              <Card>{wrong}</Card>
            ) : (
              <ErrorBoundary>{children}</ErrorBoundary>
            )}

            {backgroundColor !== "main" && <ExtensionFooter />}
          </article>
        </>
      )}
    </WithFetching>
  )
}

export default ExtensionPageV2
