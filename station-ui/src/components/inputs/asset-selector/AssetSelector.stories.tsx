/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import AssetSelectorFrom, { AssetSelectorFromProps } from './AssetSelectorFrom';
import AssetSelectorTo from './AssetSelectorTo';
import AssetSelectorSkeleton from './skeleton/AssetSelectorSkeleton';
import { ReactComponent as WalletIcon } from 'assets/icon/Wallet.svg';
import { walletBalance, tokensBySymbol, tokenPrices } from './fakedata';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { Modal } from 'components/feedback/modals';
import { FlexColumn, Input } from 'components';
import { InputWrapper } from 'components/form-helpers';
import StandardDropdown from '../dropdown/Dropdown';
import SectionHeader from 'components/headers/section/SectionHeader';
import TokenSingleChainListItem from 'components/displays/list-items/token/single-chain/TokenSingleChainListItem';

const meta: Meta<AssetSelectorFromProps> = {
  title: 'Components/Inputs/AssetSelector/Stories',
  component: AssetSelectorFrom,
  argTypes: {},
} as Meta;

export default meta;

const StorybookExample = () => {
  const [fromSymbol, setFromSymbol] = useState('LUNA');
  const [toSymbol, setToSymbol] = useState('axlUSDC');
  const [assetModalOpen, setAssetModalOpen] = useState(false);
  const [direction, setDirection] = useState('');

  const { register, handleSubmit, watch, setValue } = useForm();
  const onSubmit = handleSubmit(data => console.log(data));
  const toAmount = parseFloat(watch("fromAmount")) * tokenPrices[fromSymbol] / tokenPrices[toSymbol];

  const handleFromSymbolClick = (direction: string) => {
    setAssetModalOpen(!assetModalOpen);
    setDirection(direction);
  }

  const options = [
    { value: "terra", label: "Terra" },
    { value: "axelar", label: "Axelar" },
    { value: "carbon", label: "Carbon" },
    { value: "cosmos", label: "Cosmos" },
    { value: "crescent", label: "Crescent" },
    { value: "juno", label: "Juno" },
    { value: "mars", label: "Mars" },
  ];

  const handleTokenSelection = (token: string) => {
    if (direction === 'from') {
      setFromSymbol(token);
      setAssetModalOpen(!assetModalOpen);
      setDirection('');
    } else if (direction === 'to') {
      setToSymbol(token);
      setAssetModalOpen(!assetModalOpen);
      setDirection('');
    }
  }

  return (
    <>
      <Modal
        isOpen={assetModalOpen}
        onRequestClose={() => setAssetModalOpen(false)}
        title='Select Asset'
      >
        <FlexColumn gap={24} style={{ width: '100%' }}>
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

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
          walletAmount={walletBalance[fromSymbol]}
          handleMaxClick={() => {
            setValue("fromAmount", walletBalance[fromSymbol])
          }}
          symbol={fromSymbol}
          tokenIcon={tokensBySymbol[fromSymbol].tokenIcon}
          onSymbolClick={() => handleFromSymbolClick('from')}
          chainIcon={tokensBySymbol[fromSymbol].chainIcon}
          chainName={tokensBySymbol[fromSymbol].chainName}
          amountInputAttrs={{...register("fromAmount", { required: true, valueAsNumber: true })}}
          currencyAmount={`$${(parseFloat(watch("fromAmount")) * tokenPrices[fromSymbol]).toFixed(6)}`}
        />
        <br />
        <br />
        <br />
        <AssetSelectorTo
          extra={
            <>
              <WalletIcon width={12} height={12} fill='var(--token-dark-900)' />
              <p>
                {`${walletBalance[toSymbol] || 0} ${toSymbol}`}
              </p>
            </>
          }
          symbol={toSymbol}
          tokenIcon={tokensBySymbol[toSymbol].tokenIcon}
          onSymbolClick={() => handleFromSymbolClick('to')}
          chainIcon={tokensBySymbol[toSymbol].chainIcon}
          chainName={tokensBySymbol[toSymbol].chainName}
          amount={`${toAmount}`}
          currencyAmount={`$${(toAmount * tokenPrices[toSymbol]).toFixed(6)}`}
        />
      </form>
    </>
  );
};

export const Example: StoryObj<AssetSelectorFromProps> = {
  render: () => (
    <StorybookExample />
  ),
};

export const From: StoryObj<AssetSelectorFromProps> = {
  render: () => {
    const fromAmount = "10000";

    return (
      <AssetSelectorFrom
        walletAmount={walletBalance?.LUNA}
        handleMaxClick={() => {}}
        symbol='LUNA'
        tokenIcon={tokensBySymbol.LUNA.tokenIcon}
        onSymbolClick={() => {}}
        chainIcon={tokensBySymbol.LUNA.chainIcon}
        chainName={tokensBySymbol.LUNA.chainName}
        amountInputAttrs={{ value: fromAmount }}
        currencyAmount={`$${(parseFloat(fromAmount) * tokenPrices.LUNA).toFixed(6)}`}
      />
    )
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
        amount={`${(parseFloat(fromAmount) * tokenPrices.LUNA / tokenPrices.axlUSDC).toFixed(6)}`}
        currencyAmount={`$${(parseFloat(fromAmount) * tokenPrices.LUNA).toFixed(6)}`}
      />
    )
  },
};

export const SendExample: StoryObj<AssetSelectorFromProps> = {
  render: () => {
    const [fromSymbol, setFromSymbol] = useState('LUNA');
    const [assetModalOpen, setAssetModalOpen] = useState(false);

    const { register, handleSubmit, watch, setValue } = useForm();
    const onSubmit = handleSubmit(data => console.log(data));

    const maxClick = () => {
      setValue("fromAmount", walletBalance[fromSymbol]);
    }

    const handleFromSymbolClick = () => {
      setAssetModalOpen(!assetModalOpen);
    }

    const options = [
      { value: "terra", label: "Terra" },
      { value: "axelar", label: "Axelar" },
      { value: "carbon", label: "Carbon" },
      { value: "cosmos", label: "Cosmos" },
      { value: "crescent", label: "Crescent" },
      { value: "juno", label: "Juno" },
      { value: "mars", label: "Mars" },
    ];

    const handleTokenSelection = (token: string) => {
      setFromSymbol(token);
      setAssetModalOpen(!assetModalOpen);
    }

    return (
      <>
        <Modal
          isOpen={assetModalOpen}
          onRequestClose={() => setAssetModalOpen(false)}
          title='Select Asset'
        >
          <FlexColumn gap={24} style={{ width: '100%' }}>
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

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
            walletAmount={walletBalance[fromSymbol]}
            handleMaxClick={maxClick}
            symbol={fromSymbol}
            onSymbolClick={handleFromSymbolClick}
            tokenIcon={tokensBySymbol[fromSymbol].tokenIcon}
            chainIcon={tokensBySymbol[fromSymbol].chainIcon}
            chainName={tokensBySymbol[fromSymbol].chainName}
            amountInputAttrs={{...register("fromAmount", { required: true, valueAsNumber: true })}}
            currencyAmount={`$${(parseFloat(watch("fromAmount")) * tokenPrices[fromSymbol]).toFixed(6)}`}
          />
        </form>
      </>
    )
  },
};

export const Skeleton: StoryObj<AssetSelectorFromProps> = {
  render: () => {
    return (
      <AssetSelectorSkeleton />
    )
  },
};
