/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react"
import { useForm } from "react-hook-form"
import type { Meta, StoryObj } from "@storybook/react"
// import AssetSelectorFromV2, { AssetSelectorFromV2Props } from "./AssetSelectorFromV2"
import AssetSelectorFrom, { AssetSelectorFromProps } from "./AssetSelectorFrom"
import AssetSelectorTo from "./AssetSelectorTo"
import AssetSelectorSkeleton from "./skeleton/AssetSelectorSkeleton"
import { walletBalance, tokensBySymbol, tokenPrices } from "./fakedata"
import { Modal } from "components/feedback/modals"
import { FlexColumn, Input } from "components"
import { InputWrapper } from "components/form-helpers"
import StandardDropdown from "../dropdown/Dropdown"
import SectionHeader from "components/headers/section/SectionHeader"
import TokenSingleChainListItem from "components/displays/list-items/token/single-chain/TokenSingleChainListItem"

const meta: Meta<AssetSelectorFromProps> = {
  title: "Components/Inputs/AssetSelector/Stories",
  component: AssetSelectorFrom,
  argTypes: {},
} as Meta

export default meta

const StorybookExample = () => {
  const [fromSymbol, setFromSymbol] = useState("LUNA")
  const [toSymbol, setToSymbol] = useState("axlUSDC")
  const [assetModalOpen, setAssetModalOpen] = useState(false)
  const [direction, setDirection] = useState("")

  const { register, handleSubmit, watch, setValue } = useForm()
  const onSubmit = handleSubmit(data => console.log(data))
  const toAmount = parseFloat(watch("fromAmount")) * tokenPrices[fromSymbol] / tokenPrices[toSymbol]

  const handleFromSymbolClick = (direction: string) => {
    setAssetModalOpen(!assetModalOpen)
    setDirection(direction)
  }

  const options = [
    { value: "terra", label: "Terra" },
    { value: "axelar", label: "Axelar" },
    { value: "carbon", label: "Carbon" },
    { value: "cosmos", label: "Cosmos" },
    { value: "crescent", label: "Crescent" },
    { value: "juno", label: "Juno" },
    { value: "mars", label: "Mars" },
  ]

  const handleTokenSelection = (token: string) => {
    if (direction === "from") {
      setFromSymbol(token)
      setAssetModalOpen(!assetModalOpen)
      setDirection("")
    } else if (direction === "to") {
      setToSymbol(token)
      setAssetModalOpen(!assetModalOpen)
      setDirection("")
    }
  }

  const maxClick = () => {
    setValue("fromAmount", walletBalance[fromSymbol])
    // setValue("currencyAmount", parseFloat(walletBalance[fromSymbol]) * tokenPrices[fromSymbol])
  }

  return (
    <>
      <Modal
        isOpen={assetModalOpen}
        onRequestClose={() => setAssetModalOpen(false)}
        title="Select Asset"
      >
        <FlexColumn gap={24} style={{ width: "100%" }}>
          <InputWrapper label="Chains">
            <StandardDropdown
              options={options}
              onChange={() => {}}
              value="terra"
            />
          </InputWrapper>

          <SectionHeader
            title="Tokens"
            withLine
          />

          <InputWrapper label="Search Tokens">
            <Input
              placeholder="Search Tokens"
              onChange={() => {}}
            />
          </InputWrapper>

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
            {Object.keys(tokensBySymbol).map((token, index) => (
              <TokenSingleChainListItem
                key={index}
                priceNode={<span>$ {tokenPrices[token]}</span>}
                tokenImg={tokensBySymbol[token].tokenIcon}
                symbol={tokensBySymbol[token].symbol}
                amountNode={<span>{walletBalance[token]}</span>}
                chain={{ icon: tokensBySymbol[token].chainIcon, label: tokensBySymbol[token].chainName }}
                onClick={() => handleTokenSelection(token)}
              />
            ))}
          </div>

        </FlexColumn>
      </Modal>
      <form onSubmit={onSubmit}>
        <AssetSelectorFrom
          setValue={setValue}
          walletAmount={parseFloat(walletBalance[fromSymbol])}
          handleMaxClick={maxClick}
          symbol={fromSymbol}
          onSymbolClick={() => handleFromSymbolClick("from")}
          tokenIcon={tokensBySymbol[fromSymbol].tokenIcon}
          chainIcon={tokensBySymbol[fromSymbol].chainIcon}
          chainName={tokensBySymbol[fromSymbol].chainName}
          amountInputAttrs={{...register("fromAmount", { required: true, valueAsNumber: true })}}
          amount={watch("fromAmount") || 0}
          currencyAmount={tokenPrices[fromSymbol]}
          currencySymbol={"$"}
        />
        <br />
        <br />
        <br />
        <AssetSelectorTo
          walletAmount={parseFloat(walletBalance[toSymbol])}
          symbol={toSymbol}
          tokenIcon={tokensBySymbol[toSymbol].tokenIcon}
          onSymbolClick={() => handleFromSymbolClick("to")}
          chainIcon={tokensBySymbol[toSymbol].chainIcon}
          chainName={tokensBySymbol[toSymbol].chainName}
          amount={toAmount || 0}
          currencyAmount={tokenPrices[toSymbol]}
          currencySymbol={"$"}
        />
      </form>
    </>
  )
}

export const Example: StoryObj<AssetSelectorFromProps> = {
  render: () => (
    <StorybookExample />
  ),
}

export const From: StoryObj<AssetSelectorFromProps> = {
  render: () => {
    const [fromSymbol] = useState("LUNA")
    // const [toSymbol, setToSymbol] = useState("axlUSDC")
    const [assetModalOpen, setAssetModalOpen] = useState(false)
    const [direction, setDirection] = useState("")
    console.log("🚀 ~ file: AssetSelector.stories.tsx:158 ~ direction:", direction)

    const { register, handleSubmit, watch, setValue } = useForm()
    const onSubmit = handleSubmit(data => console.log(data))
    // const toAmount = parseFloat(watch("fromAmount")) * tokenPrices[fromSymbol] / tokenPrices[toSymbol]

    const handleFromSymbolClick = (direction: string) => {
      setAssetModalOpen(!assetModalOpen)
      setDirection(direction)
    }

    const maxClick = () => {
      setValue("fromAmount", walletBalance[fromSymbol])
      // setValue("currencyAmount", parseFloat(walletBalance[fromSymbol]) * tokenPrices[fromSymbol])
    }

    return (
      <form onSubmit={onSubmit}>
        <AssetSelectorFrom
          setValue={setValue}
          walletAmount={parseFloat(walletBalance[fromSymbol])}
          handleMaxClick={maxClick}
          symbol={fromSymbol}
          onSymbolClick={() => handleFromSymbolClick("from")}
          tokenIcon={tokensBySymbol[fromSymbol].tokenIcon}
          chainIcon={tokensBySymbol[fromSymbol].chainIcon}
          chainName={tokensBySymbol[fromSymbol].chainName}
          amountInputAttrs={{...register("fromAmount", { required: true, valueAsNumber: true })}}
          amount={watch("fromAmount") || 0}
          currencyAmount={tokenPrices[fromSymbol]}
          currencySymbol={"$"}
        />
      </form>
    )
  },
}

export const ToEmpty: StoryObj<AssetSelectorFromProps> = {
  render: () => {
    const toSymbol = "axlUSDC"
    const toAmount = 0

    return (
      <AssetSelectorTo
        walletAmount={parseFloat(walletBalance[toSymbol])}
        symbol={toSymbol}
        tokenIcon={tokensBySymbol[toSymbol].tokenIcon}
        onSymbolClick={() => {}}
        chainIcon={tokensBySymbol[toSymbol].chainIcon}
        chainName={tokensBySymbol[toSymbol].chainName}
        amount={toAmount || 0}
        currencyAmount={tokenPrices[toSymbol]}
        currencySymbol={"$"}
      />
    )
  },
}
export const To: StoryObj<AssetSelectorFromProps> = {
  render: () => {
    const toSymbol = "axlUSDC"
    const toAmount = 123786

    return (
      <AssetSelectorTo
        walletAmount={parseFloat(walletBalance[toSymbol])}
        symbol={toSymbol}
        tokenIcon={tokensBySymbol[toSymbol].tokenIcon}
        onSymbolClick={() => {}}
        chainIcon={tokensBySymbol[toSymbol].chainIcon}
        chainName={tokensBySymbol[toSymbol].chainName}
        amount={toAmount || 0}
        currencyAmount={tokenPrices[toSymbol]}
        currencySymbol={"$"}
      />
    )
  },
}

// export const SendExample: StoryObj<AssetSelectorFromV2Props> = {
//   render: () => {
//     const [fromSymbol, setFromSymbol] = useState("LUNA")
//     const [assetModalOpen, setAssetModalOpen] = useState(false)

//     const { register, handleSubmit, watch, setValue, formState } = useForm({mode: "onChange"})
//     const onSubmit = handleSubmit(data => console.log(data))

//     const maxClick = () => {
//       setValue("tokenAmount", walletBalance[fromSymbol])
//       setValue("currencyAmount", parseFloat(walletBalance[fromSymbol]) * tokenPrices[fromSymbol])
//     }

//     const handleFromSymbolClick = () => {
//       setAssetModalOpen(!assetModalOpen)
//     }

//     const options = [
//       { value: "terra", label: "Terra" },
//       { value: "axelar", label: "Axelar" },
//       { value: "carbon", label: "Carbon" },
//       { value: "cosmos", label: "Cosmos" },
//       { value: "crescent", label: "Crescent" },
//       { value: "juno", label: "Juno" },
//       { value: "mars", label: "Mars" },
//     ]

//     const handleTokenSelection = (token: string) => {
//       setFromSymbol(token)
//       setAssetModalOpen(!assetModalOpen)
//     }

//     return (
//       <>
//         <Modal
//           isOpen={assetModalOpen}
//           onRequestClose={() => setAssetModalOpen(false)}
//           title="Select Asset"
//         >
//           <FlexColumn gap={24} style={{ width: "100%" }}>
//             <InputWrapper label="Chains">
//               <StandardDropdown
//                 options={options}
//                 onChange={() => {}}
//                 value="terra"
//               />
//             </InputWrapper>

//             <SectionHeader
//               title="Tokens"
//               withLine
//             />

//             <InputWrapper label="Search Tokens">
//               <Input
//                 placeholder="Search Tokens"
//                 onChange={() => {}}
//               />
//             </InputWrapper>

//             <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
//               {Object.keys(tokensBySymbol).map((token, index) => (
//                 <TokenSingleChainListItem
//                   key={index}
//                   priceNode={<span>$ {tokenPrices[token]}</span>}
//                   tokenImg={tokensBySymbol[token].tokenIcon}
//                   symbol={tokensBySymbol[token].symbol}
//                   amountNode={<span>{walletBalance[token]}</span>}
//                   chain={{ icon: tokensBySymbol[token].chainIcon, label: tokensBySymbol[token].chainName }}
//                   onClick={() => handleTokenSelection(token)}
//                 />
//               ))}
//             </div>

//           </FlexColumn>
//         </Modal>
//         <form onSubmit={onSubmit}>
//           <AssetSelectorFromV2
//             walletAmount={walletBalance[fromSymbol]}
//             handleMaxClick={maxClick}
//             setValue={setValue}
//             tokenInputAttr={
//               {...register("tokenAmount", {
//                 required: true,
//                 valueAsNumber: true,
//               })}
//             }
//             tokenAmount={watch("tokenAmount") || 0}
//             currencyInputAttrs={
//               {...register("currencyAmount", {
//                 valueAsNumber: true,
//                 required: true,
//                 deps: ["tokenAmount"],
//               })}
//             }
//             currencyAmount={watch("currencyAmount") || 0}
//             symbol={fromSymbol}
//             onSymbolClick={handleFromSymbolClick}
//             tokenIcon={tokensBySymbol[fromSymbol].tokenIcon}
//             chainIcon={tokensBySymbol[fromSymbol].chainIcon}
//             chainName={tokensBySymbol[fromSymbol].chainName}
//             currencySymbol={"$"}
//             price={tokenPrices[fromSymbol]}
//             formState={formState}
//           />
//         </form>
//       </>
//     )
//   },
// }

export const SendExample: StoryObj<AssetSelectorFromProps> = {
  render: () => {
    const [fromSymbol, setFromSymbol] = useState("LUNA")
    const [assetModalOpen, setAssetModalOpen] = useState(false)

    const { register, handleSubmit, watch, setValue, formState } = useForm({mode: "onChange"})
    console.log("🚀 ~ file: AssetSelector.stories.tsx:352 ~ formState:", formState)
    const onSubmit = handleSubmit(data => console.log(data))

    const maxClick = () => {
      setValue("tokenAmount", walletBalance[fromSymbol])
      setValue("currencyAmount", parseFloat(walletBalance[fromSymbol]) * tokenPrices[fromSymbol])
    }

    const handleFromSymbolClick = () => {
      setAssetModalOpen(!assetModalOpen)
    }

    const options = [
      { value: "terra", label: "Terra" },
      { value: "axelar", label: "Axelar" },
      { value: "carbon", label: "Carbon" },
      { value: "cosmos", label: "Cosmos" },
      { value: "crescent", label: "Crescent" },
      { value: "juno", label: "Juno" },
      { value: "mars", label: "Mars" },
    ]

    const handleTokenSelection = (token: string) => {
      setFromSymbol(token)
      setAssetModalOpen(!assetModalOpen)
    }

    return (
      <>
        <Modal
          isOpen={assetModalOpen}
          onRequestClose={() => setAssetModalOpen(false)}
          title="Select Asset"
        >
          <FlexColumn gap={24} style={{ width: "100%" }}>
            <InputWrapper label="Chains">
              <StandardDropdown
                options={options}
                onChange={() => {}}
                value="terra"
              />
            </InputWrapper>

            <SectionHeader
              title="Tokens"
              withLine
            />

            <InputWrapper label="Search Tokens">
              <Input
                placeholder="Search Tokens"
                onChange={() => {}}
              />
            </InputWrapper>

            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
              {Object.keys(tokensBySymbol).map((token, index) => (
                <TokenSingleChainListItem
                  key={index}
                  priceNode={<span>$ {tokenPrices[token]}</span>}
                  tokenImg={tokensBySymbol[token].tokenIcon}
                  symbol={tokensBySymbol[token].symbol}
                  amountNode={<span>{walletBalance[token]}</span>}
                  chain={{ icon: tokensBySymbol[token].chainIcon, label: tokensBySymbol[token].chainName }}
                  onClick={() => handleTokenSelection(token)}
                />
              ))}
            </div>

          </FlexColumn>
        </Modal>
        <form onSubmit={onSubmit}>
          <AssetSelectorFrom
            setValue={setValue}
            walletAmount={parseFloat(walletBalance[fromSymbol])}
            handleMaxClick={maxClick}
            symbol={fromSymbol}
            onSymbolClick={handleFromSymbolClick}
            tokenIcon={tokensBySymbol[fromSymbol].tokenIcon}
            chainIcon={tokensBySymbol[fromSymbol].chainIcon}
            chainName={tokensBySymbol[fromSymbol].chainName}
            amountInputAttrs={{...register("tokenAmount", { required: true, valueAsNumber: true })}}
            amount={watch("tokenAmount") || 0}
            currencyAmount={tokenPrices[fromSymbol]}
            currencySymbol={"$"}
          />
        </form>
      </>
    )
  },
}

export const Skeleton: StoryObj<AssetSelectorFromProps> = {
  render: () => {
    return (
      <AssetSelectorSkeleton />
    )
  },
}
