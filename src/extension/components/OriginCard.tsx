import axios from "axios"
import { useEffect, useState } from "react"
import { FlexColumn, Grid } from "@terra-money/station-ui"
import styles from "./OriginCard.module.scss"

interface Props {
  hostname: string
}

interface ManifestResult {
  title?: string
  faviconUrl?: string
}

async function getIconAndTitle(baseUrl: string): Promise<ManifestResult> {
  try {
    const { data: manifest } = await axios.get(`${baseUrl}/manifest.json`)

    const title = manifest.name ?? manifest.short_name
    let faviconUrl

    // Find an appropriate icon from the manifest
    if (manifest.icons && manifest.icons.length > 0) {
      const icon = manifest.icons[0] // Select the first icon as a fallback
      faviconUrl = icon.src

      // If the URL is relative, make it absolute
      if (
        !faviconUrl.startsWith("https://") &&
        !faviconUrl.startsWith("http://")
      ) {
        const url = new URL(baseUrl)
        faviconUrl = new URL(faviconUrl, url).href
      }
    }

    return {
      title,
      faviconUrl,
    }
  } catch (e) {
    return {
      title: undefined,
      faviconUrl: undefined,
    }
  }
}

const OriginCard = ({ hostname }: Props) => {
  const baseUrl =
    hostname.startsWith("https://") || hostname.startsWith("http://")
      ? hostname
      : `https://${hostname}`

  const [metadata, setMetadata] = useState<ManifestResult>({})

  useEffect(() => {
    ;(async () => {
      const res = await getIconAndTitle(baseUrl)
      setMetadata(res)
    })()
  }, [baseUrl])

  return (
    <div className={styles.origin}>
      <FlexColumn gap={16} justify="center">
        {metadata.faviconUrl && (
          <img
            src={metadata.faviconUrl}
            alt={metadata.title ?? baseUrl}
            className={styles.icon}
            onError={() =>
              setMetadata((m) => ({ ...m, faviconUrl: undefined }))
            }
          />
        )}
        <Grid gap={8}>
          <h2>{metadata.title ?? baseUrl}</h2>
          <p>{baseUrl}</p>
        </Grid>
      </FlexColumn>
    </div>
  )
}

export default OriginCard
