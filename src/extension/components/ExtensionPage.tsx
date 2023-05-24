import { PropsWithChildren, ReactNode } from "react"
import { Card } from "components/layout"
import { ErrorBoundary, WithFetching } from "components/feedback"
import Container from "../layouts/Container"
import styles from "./ExtensionPage.module.scss"
import { ArrowBack } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

interface Props extends QueryState {
  header?: ReactNode
  title?: string
  backButtonPath?: string
}

const ExtensionPage = (props: PropsWithChildren<Props>) => {
  const navigate = useNavigate()
  const { header, title, children, backButtonPath } = props

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
                <div className={styles.titleWrapper}>
                  {backButtonPath && (
                    <ArrowBack onClick={() => navigate(backButtonPath)} />
                  )}
                  <h1 className={styles.title}>{title}</h1>
                </div>
                <Container className={styles.container}></Container>
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
