import { ErrorBoundary, WithFetching } from "components/feedback"
import { PropsWithChildren, ReactNode } from "react"
import styles from "./ExtensionPage.module.scss"
import { ReactComponent as BackIcon } from "styles/images/icons/BackButton.svg"

import { useNavigate } from "react-router-dom"
import Container from "../layouts/Container"
import { Card } from "components/layout"
import classNames from "classnames"

interface Props extends QueryState {
  header?: ReactNode
  title?: string
  backButtonPath?: string
  backgroundColor?: "main"
  fullHeight?: boolean
}

const ExtensionPage = (props: PropsWithChildren<Props>) => {
  const navigate = useNavigate()
  const {
    header,
    title,
    backButtonPath,
    children,
    backgroundColor,
    fullHeight,
  } = props
  const cx = classNames.bind(styles)

  return (
    <WithFetching {...props}>
      {(progress, wrong) => (
        <>
          {progress}

          <article
            className={cx(
              styles.page,
              backgroundColor === "main" && styles.main__bg__color,
              fullHeight && styles.full__height
            )}
          >
            {header && (
              <header className={styles.header}>
                <Container className={styles.container}>{header}</Container>
              </header>
            )}

            {title && (
              <Container className={styles.container}>
                <header className={styles.header}>
                  <div className={styles.title_container}>
                    {backButtonPath && (
                      <BackIcon
                        width={18}
                        height={18}
                        onClick={() => navigate(backButtonPath)}
                      />
                    )}{" "}
                    <h1
                      className={`${styles.title} ${
                        backButtonPath ? styles.skew_title : ""
                      }`}
                    >
                      {title}
                    </h1>
                  </div>
                </header>
              </Container>
            )}

            <section className={styles.main}>
              <Container
                className={cx(
                  styles.container,
                  fullHeight && styles.full__height
                )}
              >
                {wrong ? (
                  <Card>{wrong}</Card>
                ) : (
                  <ErrorBoundary>{children}</ErrorBoundary>
                )}
              </Container>
            </section>
          </article>
        </>
      )}
    </WithFetching>
  )
}

export default ExtensionPage
