import { FC, ReactNode } from "react"
import { Card } from "components/layout"
import { ErrorBoundary, WithFetching } from "components/feedback"
import Container from "../layouts/Container"
import styles from "./ExtensionPage.module.scss"

interface Props extends QueryState {
  header?: ReactNode
  title?: string
}

const ExtensionPage: FC<Props> = ({ header, title, children, ...props }) => {
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
                  <Container className={styles.container}>{title}</Container>
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
