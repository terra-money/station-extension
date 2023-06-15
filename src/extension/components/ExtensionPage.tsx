import { ErrorBoundary, WithFetching } from "components/feedback"
import { PropsWithChildren, ReactNode } from "react"
import styles from "./ExtensionPage.module.scss"
import { ArrowBack } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import Container from "../layouts/Container"
import { Card } from "components/layout"

interface Props extends QueryState {
  header?: ReactNode
  title?: string
  backButtonPath?: string
}

const ExtensionPage = (props: PropsWithChildren<Props>) => {
  const navigate = useNavigate()
  const { header, title, backButtonPath, children } = props

  return (
    <WithFetching {...props}>
      {(progress, wrong) => (
        <>
          {progress}

          <article className={styles.page}>
            {header && (
              <header className={styles.header}>
                <Container className={styles.container}>{header}</Container>
              </header>
            )}

            {title && (
              <header className={styles.header}>
                <h1 className={styles.title}>
                  <Container className={styles.container}>
                    {backButtonPath && (
                      <ArrowBack onClick={() => navigate(backButtonPath)} />
                    )}{" "}
                    {title}
                  </Container>
                </h1>
              </header>
            )}

            <section className={styles.main}>
              <Container className={styles.container}>
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
