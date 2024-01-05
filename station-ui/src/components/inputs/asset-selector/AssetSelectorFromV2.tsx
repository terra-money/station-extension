// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { InputHTMLAttributes, useEffect, useRef, useState } from "react"
// import classNames from "classnames/bind"
// import { SwapArrowsIcon, WalletIcon, DropdownArrowIcon } from "assets"
// import styles from "./AssetSelector.module.scss"

// const cx = classNames.bind(styles)

// export interface AssetSelectorFromV2Props {
//   walletAmount: string
//   handleMaxClick: () => void
//   symbol: string
//   tokenIcon: string
//   onSymbolClick?: () => void
//   chainIcon: string
//   chainName: string
//   tokenInputAttr: InputHTMLAttributes<HTMLInputElement>
//   tokenAmount: number
//   currencyInputAttrs: InputHTMLAttributes<HTMLInputElement>
//   currencyAmount: number
//   currencySymbol: string
//   price: number | undefined
//   formState: any
//   setValue: any
// }

// const AssetSelectorFromV2 = ({
//   walletAmount,
//   handleMaxClick,
//   symbol,
//   tokenIcon,
//   onSymbolClick,
//   chainIcon,
//   chainName,
//   tokenInputAttr,
//   tokenAmount,
//   currencyInputAttrs,
//   currencyAmount,
//   currencySymbol,
//   price,
//   formState,
//   setValue,
// }: AssetSelectorFromProps) => {
//   const [displayMode, setDisplayMode] = useState("token")
//   const [inputWidth, setInputWidth] = useState("55px")
//   const mirrorSpanRef = useRef<HTMLSpanElement>(null)
//   const [fontSize, setFontSize] = useState(24);
//   const inputRef = useRef<HTMLInputElement>(null)

//   const formatValue = (value: string, decimalLimit: number) => {
//     if (value === "-") return value
//     const parts = value.split(".")
//     if (parts.length === 2 && parts[1].length > decimalLimit) {
//       return parseFloat(value).toFixed(decimalLimit)
//     }
//     return value
//   }

//   const adjustFontSize = () => {
//     if (inputRef.current) {
//       const parentWidth =
//         displayMode === "currency" ?
//           (inputRef.current.parentElement?.parentElement?.clientWidth || inputRef.current.clientWidth)
//           : inputRef.current.clientWidth;

//       const hasOverflow = inputRef.current.scrollWidth > parentWidth;
//       let newFontSize = fontSize;

//       if (hasOverflow && newFontSize > 12) {
//         newFontSize -= 2
//       } else if (!hasOverflow && newFontSize < 24) {

//         inputRef.current.style.fontSize = `${newFontSize + 2}px`
//         if (inputRef.current.scrollWidth <= parentWidth) {
//           newFontSize += 2
//         }

//         inputRef.current.style.fontSize = `${newFontSize}px`
//       }
//       setFontSize(newFontSize);
//     }
//   }

//   const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     tokenInputAttr.onChange && tokenInputAttr.onChange(e)
//     const inputValue = e.target.value

//     const cleanedValue =
//       inputValue
//         .replace(/[^0-9.]/g, "")
//         .replace(/(\..*)\./g, "$1")
//         .replace(/^0+(?!$|\.)/, "") || "0"

//         if (inputRef.current) {
//           const parentWidth =
//             displayMode === "currency" ?
//               (inputRef.current.parentElement?.parentElement?.clientWidth || inputRef.current.clientWidth)
//               : inputRef.current.clientWidth;

//           const hasOverflow = inputRef.current.scrollWidth > parentWidth;
//           let newFontSize = fontSize;

//           if (hasOverflow && newFontSize > 12) {
//             newFontSize -= 2
//           } else if (!hasOverflow && newFontSize < 24) {

//             inputRef.current.style.fontSize = `${newFontSize + 2}px`
//             if (inputRef.current.scrollWidth <= parentWidth) {
//               newFontSize += 2
//             }

//             inputRef.current.style.fontSize = `${newFontSize}px`
//           }
//           setFontSize(newFontSize);
//         }

//     if (displayMode === "token") {
//       const tokenInputValue = formatValue(cleanedValue, 6)
//       const pricePerToken = price ? parseFloat(tokenInputValue) * price : "—"
//       setValue(tokenInputAttr.name || "tokenAmount", tokenInputValue)
//       setValue(currencyInputAttrs.name || "currencyAmount", formatValue(pricePerToken.toString(), 2))
//     } else if (displayMode === "currency") {
//       const tokenInputValue = formatValue(cleanedValue, 6)
//       const pricePerToken = price ? parseFloat(tokenInputValue) / price : "—"
//       setValue(currencyInputAttrs.name || "currencyAmount",  formatValue(cleanedValue, 2))
//       setValue(tokenInputAttr.name || "tokenAmount", formatValue(pricePerToken.toString(), 6))
//     }
//   }

//   useEffect(() => {
//     if (mirrorSpanRef.current) {
//       if (currencyAmount === 0) {
//         setInputWidth("55px")
//       } else {
//         setInputWidth(`${mirrorSpanRef.current.offsetWidth}px`)
//       }
//     }

//     if (tokenAmount !== 0 && currencyAmount !== 0) {
//       if (displayMode === "token") {
//         const tokenInputValue = formatValue(tokenAmount.toString(), 6)
//         const pricePerToken = price ? parseFloat(tokenInputValue) * price : "—"
//         setValue(tokenInputAttr.name || "tokenAmount", tokenInputValue)
//         setValue(currencyInputAttrs.name || "currencyAmount", formatValue(pricePerToken.toString(), 2))
//       } else if (displayMode === "currency") {
//         const tokenInputValue = formatValue(tokenAmount.toString(), 6)
//         const pricePerToken = price ? parseFloat(tokenInputValue) * price : "—"
//         setValue(currencyInputAttrs.name || "currencyAmount",  formatValue(pricePerToken.toString(), 2))
//         setValue(tokenInputAttr.name || "tokenAmount", tokenInputValue)
//       }
//     }
//   }, [currencyAmount, tokenAmount, displayMode, price, setValue, currencyInputAttrs.name, tokenInputAttr.name])

//   useEffect(() => {
//     console.log("🚀 ~ file: AssetSelectorFrom.tsx:158 ~ useEffect ~ displayMode:", displayMode)
//     if (inputRef.current) {
//       const parentWidth =
//       displayMode === "currency" ?
//       (inputRef.current.parentElement?.parentElement?.clientWidth || inputRef.current.clientWidth)
//       : inputRef.current.clientWidth;

//       console.log("🚀 ~ file: AssetSelectorFrom.tsx:157 ~ useEffect ~ parentWidth:", parentWidth)
//       const hasOverflow = inputRef.current.scrollWidth > parentWidth;
//       console.log("🚀 ~ file: AssetSelectorFrom.tsx:164 ~ useEffect ~ inputRef.current.scrollWidth:", inputRef.current.scrollWidth)
//       console.log("🚀 ~ file: AssetSelectorFrom.tsx:164 ~ useEffect ~ hasOverflow:", hasOverflow)
//       let newFontSize = fontSize;

//       if (hasOverflow && newFontSize > 12) {
//         newFontSize -= 2
//       } else if (!hasOverflow && newFontSize < 24) {

//         inputRef.current.style.fontSize = `${newFontSize + 2}px`
//         if (inputRef.current.scrollWidth <= parentWidth) {
//           newFontSize += 2
//         }

//         inputRef.current.style.fontSize = `${newFontSize}px`
//       }
//       setFontSize(newFontSize);
//     }
//   }, [displayMode, fontSize])

//   const handleInputChange = () => {

//     if (displayMode === "currency") {
//       setDisplayMode("token")
//     } else {
//       setDisplayMode("currency")
//     }
//   }

//   return (
//     <div className={styles.asset__selector_wrapper}>
//       <div className={styles.header}>
//         <div className={styles.left}>
//           <WalletIcon width={12} height={12} fill="var(--token-dark-900)" />
//           <div className={styles.wallet__text__wrapper}>
//             <p className={cx({ [styles.has__value]: parseFloat(walletAmount) > 1 })}>{walletAmount}</p>
//             <p>{symbol}</p>
//           </div>
//         </div>
//         <div className={styles.right}>
//           <button
//             className={styles.max__button}
//             type="button"
//             onClick={handleMaxClick}
//           >
//             Max
//           </button>
//         </div>
//       </div>

//       <div className={styles.inputs}>
//         <div className={styles.token__selector}>
//           <img src={tokenIcon} width={26} height={26} />
//           <div className={styles.token__wrapper}>
//             {onSymbolClick ? (
//               <div className={styles.symbol}>
//                 <button
//                   type="button"
//                   className={styles.symbol__button}
//                   onClick={() => {
//                     onSymbolClick()
//                   }}
//                 >
//                   {symbol}
//                   <DropdownArrowIcon fill="var(--token-light-white)" />
//                 </button>
//               </div>
//             ) : (
//               <div className={styles.symbol}>{symbol}</div>
//             )}
//             <div className={styles.chain__wrapper}>
//               <img src={chainIcon} width={12} height={12} />
//               <div className={styles.chain__name}>{chainName}</div>
//             </div>
//           </div>
//         </div>

//         <div className={styles.amounts__wrapper}>
//           <div className={styles.input__amount}>
//           {displayMode === "token" ? (
//             <input
//               className={cx(styles.large__input, styles.amount__token)}
//               type="number"
//               inputMode="decimal"
//               placeholder="0.00"
//               step={0.000000000000000001}
//               {...tokenInputAttr}
//               ref={inputRef}
//               onChange={handleInputOnChange}
//               style={{ fontSize: `${fontSize}px` }}
//               max={999999999999999}
//               value={tokenAmount}
//             />
//           ) : (
//             <>
//               {currencySymbol}
//               <input
//                 className={cx(styles.large__input, styles.amount__token)}
//                 type="number"
//                 inputMode="decimal"
//                 placeholder="0.00"
//                 step={0.000000000000000001}
//                 {...currencyInputAttrs}
//                 ref={inputRef}
//                 onChange={handleInputOnChange}
//                 style={{ width: inputWidth, fontSize: `${fontSize}px` }}
//                 max={999999999999999}
//                 value={currencyAmount}
//               />
//               <span
//                 ref={mirrorSpanRef}
//                 className={styles.mirror__span}
//                 aria-hidden="true"
//                 style={{ fontSize: `${fontSize}px` }}
//               >
//                 {currencyAmount}
//               </span>
//             </>
//           )}
//           </div>
//           <div className={styles.amount__currency}>
//             <SwapArrowsIcon fill={"var(--token-dark-900)"} width={12} height={12} onClick={handleInputChange} />
//             {displayMode === "token" ? (
//               <span
//                 className={styles.bottom__value}
//               >
//                 {currencySymbol}{formatValue(currencyAmount.toString(), 2)}
//               </span>
//             ) : (
//               <span className={styles.bottom__value}>
//                 {formatValue(tokenAmount.toString(), 6)}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AssetSelectorFromV2
