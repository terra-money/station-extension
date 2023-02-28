import { ReactNode } from "react"
import QrCodeIcon from "@mui/icons-material/QrCode"
import { Flex, Grid } from "components/layout"
import WalletQR from "app/sections/WalletQR"
import { isWallet, useAuth } from "auth"
import MultisigBadge from "auth/components/MultisigBadge"
import Copy from "./Copy"
import styles from "./WalletCard.module.scss"
import { useAddress } from "data/wallet"
import { useInterchainAddresses } from "auth/hooks/useAddress"

interface Props {
  extra?: ReactNode
  chainId?: string
}

const WalletCard = ({ extra, chainId }: Props) => {
  const { wallet } = useAuth()
  const address = useAddress()
  const addresses = useInterchainAddresses()

  if (!wallet || !address) return null
  const name = isWallet.local(wallet) ? wallet.name : undefined

  return (
    <div className={styles.wallet}>
      <Grid>
        {name && (
          <Flex gap={4} start>
            {isWallet.multisig(wallet) && <MultisigBadge />}
            <h1>{name}</h1>
          </Flex>
        )}

        <Flex gap={4} className={styles.address}>
          <p>{chainId ? addresses?.[chainId] ?? address : address}</p>
          <Copy
            text={chainId ? addresses?.[chainId] ?? address : address}
          ></Copy>
          <WalletQR
            renderButton={(open) => (
              <button onClick={open}>
                <QrCodeIcon style={{ fontSize: 26, padding: 4 }} />
              </button>
            )}
          />
        </Flex>
      </Grid>

      {extra}
    </div>
  )
}

export default WalletCard
