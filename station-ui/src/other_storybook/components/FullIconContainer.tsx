import { useState } from "react"
import IconContainer from "./IconContainer.tsx"
import {
  AddressBookIcon,
  AlertIcon,
  BackArrowIcon,
  BridgeIcon,
  BroadcastingIcon,
  BuyIcon,
  CloseIcon,
  SettingsIcon,
  ConnectIcon,
  CopyIcon,
  DropdownArrowIcon,
  ExternalLinkIcon,
  FavoriteIcon,
  FilterIcon,
  FlipArrowsIcon,
  GovernanceIcon,
  ImportSeedIcon,
  KeyIcon,
  LaughIcon,
  LedgerIcon,
  LoadingIcon,
  LockIcon,
  ManageAssetIcon,
  MultisigWalletIcon,
  QRCodeIcon,
  ReceiveIcon,
  RightArrowIcon,
  RoughlyEqualsIcon,
  SearchIcon,
  SendArrowIcon,
  SmallCircleCheckIcon,
  StakeIcon,
  SwapArrowsIcon,
  TrashIcon,
  TrendDownIcon,
  TrendUpIcon,
  WalletIcon,
  WalletConnectIcon,
} from "components"
import ColorDropdown from "./ColorDropdown.tsx"

const FullIconContainer = () => {
  const size = 20
  const [selectedColor, setSelectedColor] = useState("--token-light-white")

  const icons = [
    {
      name: "AddressBook",
      icon: <AddressBookIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<AddressBookIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "Alert",
      icon: <AlertIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<AlertIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "BackArrow",
      icon: <BackArrowIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<BackArrowIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "Bridge",
      icon: <BridgeIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<BridgeIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "Broadcasting",
      icon: <BroadcastingIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<BroadcastingIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "Buy",
      icon: <BuyIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<BuyIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "Close",
      icon: <CloseIcon stroke={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<CloseIcon stroke={"var(${selectedColor})"} />`
    },
    {
      name: "Settings",
      icon: <SettingsIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<SettingsIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "Connect",
      icon: <ConnectIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<ConnectIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "Copy",
      icon: <CopyIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<CopyIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "DropdownArrow",
      icon: <DropdownArrowIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<DropdownArrowIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "ExternalLink",
      icon: <ExternalLinkIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<ExternalLinkIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "Favorite",
      icon: <FavoriteIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<FavoriteIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "Filter",
      icon: <FilterIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<FilterIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "FlipArrows",
      icon: <FlipArrowsIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<FlipArrowsIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "Governance",
      icon: <GovernanceIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<GovernanceIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "ImportSeed",
      icon: <ImportSeedIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<ImportSeedIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "Key",
      icon: <KeyIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<KeyIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "Laugh",
      icon: <LaughIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<LaughIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "Ledger",
      icon: <LedgerIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<LedgerIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "Loading",
      icon: <LoadingIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<LoadingIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "Lock",
      icon: <LockIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<LockIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "ManageAsset",
      icon: <ManageAssetIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<ManageAssetIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "MultisigWallet",
      icon: <MultisigWalletIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<MultisigWalletIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "QRCode",
      icon: <QRCodeIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<QRCodeIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "Receive",
      icon: <ReceiveIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<ReceiveIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "RightArrow",
      icon: <RightArrowIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<RightArrowIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "RoughlyEquals",
      icon: <RoughlyEqualsIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<RoughlyEqualsIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "Search",
      icon: <SearchIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<SearchIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "SendArrow",
      icon: <SendArrowIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<SendArrowIcon fill={"var(${selectedColor})"} />`
    },
    {
      name:"SmallCircleCheck",
      icon: <SmallCircleCheckIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<SmallCircleCheckIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "Stake",
      icon: <StakeIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<StakeIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "SwapArrows",
      icon: <SwapArrowsIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<SwapArrowsIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "Trash",
      icon: <TrashIcon fill={`var(${selectedColor})`} stroke={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<TrashIcon fill={"var(${selectedColor})"} stroke={"var(${selectedColor})"} />`
    },
    {
      name: "TrendDown",
      icon: <TrendDownIcon fill={"var(--token-error-500)"} width={size} height={size} />,
      iconCopy: `<TrendDownIcon fill={"var(--token-error-500)"} />`
    },
    {
      name: "TrendUp",
      icon: <TrendUpIcon fill={"var(--token-success-500)"} width={size} height={size} />,
      iconCopy: `<TrendUpIcon fill={"var(--token-success-500)"} />`
    },
    {
      name: "Wallet",
      icon: <WalletIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<WalletIcon fill={"var(${selectedColor})"} />`
    },
    {
      name: "WalletConnect",
      icon: <WalletConnectIcon fill={`var(${selectedColor})`} width={size} height={size} />,
      iconCopy: `<WalletConnectIcon fill={"var(${selectedColor})"} />`
    },
  ]

  return (
    <div>
      <h3>SVG Color</h3>
      <ColorDropdown
        onChange={(value) => setSelectedColor(value)}
        value={selectedColor}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {icons.map((icon) => (
          <IconContainer
            iconName={icon.name}
            icon={icon.icon}
            iconCopy={icon.iconCopy}
          />
        ))}
      </div>
    </div>
  )
}

export default FullIconContainer