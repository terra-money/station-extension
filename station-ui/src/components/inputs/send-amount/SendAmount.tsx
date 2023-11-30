/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect, InputHTMLAttributes } from "react"
import classNames from "classnames/bind"
import styles from "./SendAmount.module.scss"
import { SwapArrowsIcon } from "assets"

const cx = classNames.bind(styles)

export interface SendAmountProps {
  setValue: any;
  tokenInputAttr: InputHTMLAttributes<HTMLInputElement>;
  tokenAmount: number;
  currencyInputAttrs: InputHTMLAttributes<HTMLInputElement>;
  currencyAmount: number;
  symbol: string;
  tokenIcon: string;
  currencySymbol: string;
  price: number;
  formState: any;
}

const SendAmount: React.FC<SendAmountProps> = ({
  setValue,
  tokenInputAttr,
  tokenAmount,
  currencyInputAttrs,
  currencyAmount,
  symbol,
  tokenIcon,
  currencySymbol,
  price,
  formState,
}) => {
  const [tokenFixedValue, setTokenFixedValue] = useState<string>("0")
  const [currencyFixedValue, setCurrencyFixedValue] = useState<string>("0")
  const [inputWidth, setInputWidth] = useState("29px")
  const inputRef = useRef<HTMLInputElement>(null)
  const mirrorSpanRef = useRef<HTMLSpanElement>(null)
  const [displayMode, setDisplayMode] = useState("token")

  useEffect(() => {
    if (mirrorSpanRef.current && !(mirrorSpanRef.current.offsetWidth < 29)) {
      setInputWidth(`${mirrorSpanRef.current.offsetWidth + 4}px`)
    } else {
      setInputWidth("29px")
    }
  }, [tokenFixedValue, currencyFixedValue, displayMode])

  useEffect(() => {
    const formatValue = (value: number, decimalLimit: number) => {
      const valueString = value.toString().replace(/^0+(?!$|\.)/, "") || "0"
      const parts = valueString.split(".")
      if (parts.length === 2 && parts[1].length > decimalLimit) {
        return parseFloat(valueString).toFixed(decimalLimit)
      }
      return valueString
    }

    const updateValues = (tokenValue: number, currencyValue: number) => {
      const tokenFormatted = formatValue(tokenValue, 8)
      const currencyFormatted = formatValue(currencyValue, 2)

      setTokenFixedValue(tokenFormatted)
      setValue(tokenInputAttr.name || "tokenAmount", tokenFormatted)

      setCurrencyFixedValue(currencyFormatted)
      setValue(currencyInputAttrs.name || "currencyAmount", currencyFormatted)
    }

    updateValues(tokenAmount, currencyAmount)
  }, [displayMode, setValue, tokenAmount, currencyAmount, tokenInputAttr.name, currencyInputAttrs.name])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    tokenInputAttr.onChange && tokenInputAttr.onChange(e)
    const inputValue = e.target.value
    const cursorPosition = e.target.selectionStart
    const isTokenMode = displayMode === "token"

    const cleanedValue = inputValue
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1")
      .replace(/^0+(?!$|\.)/, "") || "0"

    const formatValue = (value: string, decimalLimit: number) => {
      const parts = value.split(".")
      if (parts.length === 2 && parts[1].length > decimalLimit) {
        return parseFloat(value).toFixed(decimalLimit)
      }
      return value
    }

    const updateValue = (value: string, isToken: boolean) => {
      const decimalLimit = isToken ? 8 : 2
      const formattedValue = formatValue(value, decimalLimit)
      const numericValue = parseFloat(formattedValue) || 0

      if (isToken) {
        setTokenFixedValue(formattedValue)
        setValue(tokenInputAttr.name || "tokenAmount", formattedValue)

        const currencyValue = formatValue((numericValue * price).toString(), 2)
        setCurrencyFixedValue(currencyValue)
        setValue(currencyInputAttrs.name || "currencyAmount", currencyValue)
      } else {
        setCurrencyFixedValue(formattedValue)
        setValue(currencyInputAttrs.name || "currencyAmount", formattedValue)

        const tokenValue = formatValue((numericValue / price).toString(), 8)
        setTokenFixedValue(tokenValue)
        setValue(tokenInputAttr.name || "tokenAmount", tokenValue)
      }
    }

    updateValue(cleanedValue, isTokenMode)

    // Cursor position management
    if (inputRef.current && cursorPosition !== null) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.selectionStart = cursorPosition
          inputRef.current.selectionEnd = cursorPosition
        }
      }, 0);
    }
  }

  const forceSwitch = () => {
    if (displayMode === "token") {
      setDisplayMode("currency")
    } else {
      setDisplayMode("token")
    }
  }

  return (
    <div className={styles.send__amount__container}>
      <div className={styles.input__group}>
        {displayMode === "token" ? (
          <>
            <input
              ref={inputRef}
              type="text"
              className={styles.actual__input}
              value={tokenFixedValue}
              style={{ width: inputWidth }}
              autoFocus
              {...tokenInputAttr}
              onChange={handleInputChange}
            />
            <span className={styles.large__label}>{symbol}</span>
            <span ref={mirrorSpanRef} className={styles.mirror__span} aria-hidden="true">
              {tokenFixedValue}
            </span>
          </>
        ) : (
          <>
            <span className={styles.large__label} style={{ marginLeft: "0px" }}>{currencySymbol}</span>
            <input
              ref={inputRef}
              type="text"
              className={styles.actual__input}
              value={currencyFixedValue}
              style={{ width: inputWidth }}
              autoFocus
              {...currencyInputAttrs}
              onChange={handleInputChange}
            />
            <span ref={mirrorSpanRef} className={cx(styles.mirror__span, styles.mirror__span__currency)} aria-hidden="true">
              {currencyFixedValue}
            </span>
          </>
        )}
      </div>
      <div className={styles.secondary}>
        {displayMode === "token" ? (
          <div className={styles.secondary__mode__token}>
            <span>{currencySymbol}
            {parseFloat(currencyFixedValue) < 0.01 && parseFloat(tokenFixedValue) > 0 ? (
              <span>{"<"}0.01</span>
            ) : (
              <span>{currencyFixedValue}</span>
            )}</span>
            <SwapArrowsIcon onClick={forceSwitch} fill="var(--token-dark-900)" height={16} width={16} />
          </div>
        ) : (
          <div className={styles.secondary__mode__currency}>
            <img src={tokenIcon} width={16} height={16} />
            {tokenFixedValue}
            <span>{symbol}</span>
            <SwapArrowsIcon onClick={forceSwitch} fill="var(--token-dark-900)" height={16} width={16} />
          </div>
        )}
      </div>
      {formState.errors[tokenInputAttr.name || "tokenAmount"] || formState.errors[currencyInputAttrs.name || "currencyAmount"] ? (
        formState.errors[tokenInputAttr.name || "tokenAmount"] ? (
          <div className={styles.error__message}>{formState.errors[tokenInputAttr.name || "tokenAmount"].message}</div>
        ) : (
          <div className={styles.error__message}>{formState.errors[currencyInputAttrs.name || "currencyAmount"].message}</div>
        )
      ) : null}
    </div>
  )
}

export default SendAmount
