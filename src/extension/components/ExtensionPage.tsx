import { ErrorBoundary, WithFetching } from "components/feedback"
import { PropsWithChildren, ReactNode } from "react"
import styles from "./ExtensionPage.module.scss"
import { ReactComponent as BackIcon } from "styles/images/icons/BackButton.svg"
import { ReactComponent as CloseIcon } from "styles/images/icons/Close.svg"

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

const ExtensionPage = (props: PropsWithChildren<Props>) => {
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
              backgroundColor === "main" && styles.main__bg__color,
              fullHeight && styles.full__height,
              modal && styles.modal
            )}
          >
            {header && (
              <header className={styles.header}>
                <Container className={styles.container}>{header}</Container>
              </header>
            )}

            <section
              className={cx(
                styles.main,
                fullHeight && styles.full__height__body
              )}
            >
              <Container
                className={cx(
                  styles.container,
                  styles.main,
                  fullHeight && styles.full__height__body
                )}
              >
                {title && (
                  <div
                    className={cx(
                      styles.close__container,
                      modal && !backButtonPath && styles.container__with__icon
                    )}
                  >
                    <header className={styles.header}>
                      <div className={styles.header_container}>
                        {backButtonPath && (
                          <BackIcon
                            className={styles.back__icon}
                            width={20}
                            height={20}
                            onClick={() => navigate(backButtonPath)}
                            fill="currentColor"
                          />
                        )}
                        <div className={styles.title__container}>
                          {img && (
                            <div
                              className={cx(styles.img__container, {
                                img__with__label: !!label,
                              })}
                            >
                              {typeof img === "string" ? (
                                <img src={img} alt={title} />
                              ) : (
                                img
                              )}
                            </div>
                          )}
                          <h1
                            className={cx(
                              styles.title,
                              backButtonPath
                                ? styles.skew_title
                                : subtitle && styles.with_subtitle
                            )}
                          >
                            {title}
                          </h1>
                          {label && <h5 className={styles.label}>{label}</h5>}
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
                          )}
                        </div>
                      </div>
                    </header>
                    {modal && (
                      <CloseIcon
                        width={16}
                        height={16}
                        className={styles.modal__close__icon}
                        onClick={() => navigate("/")}
                        fill="currentColor"
                      />
                    )}
                  </div>
                )}
                {wrong ? (
                  <Card>{wrong}</Card>
                ) : (
                  <ErrorBoundary>{children}</ErrorBoundary>
                )}
              </Container>
            </section>

            {backgroundColor !== "main" && <ExtensionFooter />}
          </article>
        </>
      )}
    </WithFetching>
  )
}

export default ExtensionPage
