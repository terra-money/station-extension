import { ForwardedRef, forwardRef, InputHTMLAttributes, ReactNode } from "react"
import classNames from "classnames/bind"
import { WithTokenItem } from "data/token"
import { Flex } from "../layout"
import styles from "./Input.module.scss"
import { InputWrapper } from "@terra-money/station-ui"

const cx = classNames.bind(styles)

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  token?: Token
  selectBefore?: ReactNode
  actionButton?: {
    icon: ReactNode
    onClick: () => void
  }
}

const Input = forwardRef(
  (
    { selectBefore, token, actionButton, ...attrs }: Props,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <div className={styles.wrapper}>
        {selectBefore}

        <input
          {...attrs}
          className={cx(styles.input, {
            before: token || actionButton,
            after: selectBefore,
          })}
          onWheel={(e) => e.currentTarget.blur()}
          step="any"
          autoComplete="off"
          ref={ref}
        />
        {token && (
          <WithTokenItem token={token}>
            {({ symbol }) => (
              <Flex className={cx(styles.symbol, styles.after)}>{symbol}</Flex>
            )}
          </WithTokenItem>
        )}

        {actionButton && (
          <button
            type="button"
            className={cx(styles.symbol, styles.after)}
            onClick={(e) => {
              actionButton.onClick()
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            {actionButton.icon}
          </button>
        )}
      </div>
    )
  }
)

export default Input

/* search */
export const SearchInput = forwardRef(
  (
    attrs: InputHTMLAttributes<HTMLInputElement> & {
      padding?: boolean
      small?: boolean
      inline?: boolean
      extra?: ReactNode
      label?: string
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <InputWrapper label={attrs.label}>
        <div
          className={cx(
            styles.wrapper,
            styles.search,
            attrs.small && styles.search__small,
            attrs.inline && styles.search__inline
          )}
          style={attrs.padding ? {} : { margin: 0 }}
        >
          <Input {...attrs} inputMode="search" autoComplete="off" ref={ref} />
          {attrs.extra}
        </div>
      </InputWrapper>
    )
  }
)
