import type { Meta, StoryFn, StoryObj } from '@storybook/react';
// import AssetSelector, { AssetSelectorFromProps } from './AssetSelectorFrom';
import AssetSelectorFrom, { AssetSelectorFromProps } from './AssetSelectorFrom';
import AssetSelectorTo, { AssetSelectorToProps } from './AssetSelectorTo';
import { ReactComponent as WalletIcon } from 'assets/icon/Wallet16.svg';
import { walletBalance, tokensBySymbol, tokensPerDollar } from './fakedata';
import { useState } from 'react';
import { useForm } from "react-hook-form";

const meta: Meta<AssetSelectorFromProps> = {
  title: 'Components/Inputs/AssetSelector/Stories',
  component: AssetSelectorFrom,
  argTypes: {

  },
  parameters: {
    controls: {
      hideNoControlsWarning: true,
      expanded: true,
    },
    backgrounds: {
      disable: true,
    }
  },
  decorators: [
    (Story: StoryFn) => (
      <div className="story__decorator" style={{
        padding: '48px 24px',
        backgroundColor: 'var(--token-dark-200)',
        margin: '-20px -10px',
        borderRadius: '8px',
        fontSize: 'var(--token-font-size-small)'
      }}>
        <Story />
      </div>
    ),
  ],
} as Meta;

export default meta;

const StorybookExample = () => {
  const [fromSymbol, setFromSymbol] = useState('LUNA');
  const [toSymbol, setToSymbol] = useState('axlUSDC');

  const { register, handleSubmit, watch } = useForm();
  const onSubmit = handleSubmit(data => console.log(data));

  const toAmount = parseFloat(watch("fromamount")) * tokensPerDollar[fromSymbol] / tokensPerDollar[toSymbol];

  return (
    <form onSubmit={onSubmit}>
      <AssetSelectorFrom
        extra={
          <>
            <WalletIcon width={12} height={12} fill='var(--token-dark-900)' />
            <p>
              {`${walletBalance[fromSymbol]} ${fromSymbol}`}
            </p>
          </>
        }
        symbol={fromSymbol}
        tokenIcon={tokensBySymbol[fromSymbol].tokenIcon}
        onSymbolClick={() => {}}
        chainIcon={tokensBySymbol[fromSymbol].chainIcon}
        chainName={tokensBySymbol[fromSymbol].chainName}
        amountInputAttrs={{...register("fromamount", { required: true, valueAsNumber: true })}}
        currencyAmount={`$${(parseFloat(watch("fromamount")) * tokensPerDollar[fromSymbol]).toFixed(6)}`}
      />
      <br />
      <br />
      <br />
      <AssetSelectorTo
        extra={
          <>
            <WalletIcon width={12} height={12} fill='var(--token-dark-900)' />
            <p>
              {`${walletBalance[toSymbol]} ${toSymbol}`}
            </p>
          </>
        }
        symbol={toSymbol}
        tokenIcon={tokensBySymbol[toSymbol].tokenIcon}
        onSymbolClick={() => {}}
        chainIcon={tokensBySymbol[toSymbol].chainIcon}
        chainName={tokensBySymbol[toSymbol].chainName}
        amount={`${toAmount}`}
        currencyAmount={`$${(toAmount * tokensPerDollar[toSymbol]).toFixed(6)}`}
      />
    </form>
  );
}

export const Example: StoryObj<AssetSelectorFromProps> = {
  render: () => (
    <StorybookExample />
  ),
  argTypes: {

  },
};

export const From: StoryObj<AssetSelectorFromProps> = {
  render: () => {
    const fromAmount = "10000";

    return (
      <AssetSelectorFrom
        extra={
          <>
            <WalletIcon width={12} height={12} fill='var(--token-dark-900)' />
            <p>
              {`${walletBalance?.LUNA} LUNA`}
            </p>
          </>
        }
        symbol='LUNA'
        tokenIcon={tokensBySymbol.LUNA.tokenIcon}
        onSymbolClick={() => {}}
        chainIcon={tokensBySymbol.LUNA.chainIcon}
        chainName={tokensBySymbol.LUNA.chainName}
        amountInputAttrs={{ value: fromAmount }}
        currencyAmount={`$${(parseFloat(fromAmount) * tokensPerDollar.LUNA).toFixed(6)}`}
      />
    )
  },
  argTypes: {

  },
};

export const To: StoryObj<AssetSelectorFromProps> = {
  render: () => {
    const fromAmount = "10000";

    return (
      <AssetSelectorTo
        extra={
          <>
            <WalletIcon width={12} height={12} fill='var(--token-dark-900)' />
            <p>
              {`${walletBalance.axlUSDC} axlUSDC`}
            </p>
          </>
        }
        symbol='axlUSDC'
        tokenIcon={tokensBySymbol.axlUSDC.tokenIcon}
        onSymbolClick={() => {}}
        chainIcon={tokensBySymbol.axlUSDC.chainIcon}
        chainName={tokensBySymbol.axlUSDC.chainName}
        amount={`${(parseFloat(fromAmount) * tokensPerDollar.LUNA / tokensPerDollar.axlUSDC).toFixed(6)}`}
        currencyAmount={`$${(parseFloat(fromAmount) * tokensPerDollar.LUNA).toFixed(6)}`}
      />
    )
  },
  argTypes: {

  },
};
