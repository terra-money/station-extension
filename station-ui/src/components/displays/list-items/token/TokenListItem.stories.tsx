/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import TokenListItem, { TokenListItemProps } from './default/TokenListItem';
import TokenSingleChainListItem, { TokenSingleChainListItemProps } from './single-chain/TokenSingleChainListItem';
import TokenCheckboxListItem, { TokenCheckboxListItemProps } from './single-chain/TokenCheckboxListItem';

const meta: Meta<TokenListItemProps> = {
  title: 'Components/List Items/Token/Stories',
  component: TokenListItem,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj<TokenListItemProps> = {
  render: () => {
    return (
      <div style={{ height: "150px", display: "flex", alignItems: "flex-end" }}>
        <TokenListItem
          priceNode={<span>$ 421.00</span>}
          chains={[{name: "terra",  icon: "https://station-assets.terra.dev/img/chains/Terra.svg", balance: '100' }, { balance: '320' , name: "axelar", icon: "https://station-assets.terra.dev/img/chains/Axelar.svg"}]}
          tokenImg={"https://station-assets.terra.dev/img/coins/Luna.svg"}
          symbol={"LUNA"}
          price={1}
          change={0.1}
          amountNode={<span>420.00</span>}
        />
      </div>
    )
  },
  argTypes: {},
};

export const DefaultSingleChain: StoryObj<TokenListItemProps> = {
  render: () => {
    return (
      <TokenListItem
        priceNode={<span>$ 421.00</span>}
        chains={[{name: "terra",  icon: "https://station-assets.terra.dev/img/chains/Terra.svg", balance: '100' }]}
        tokenImg={"https://station-assets.terra.dev/img/coins/Luna.svg"}
        symbol={"LUNA"}
        price={1}
        change={0.1}
        amountNode={<span>420.00</span>}
      />
    )
  },
  argTypes: {},
};

export const ChainDisplay: StoryObj<TokenSingleChainListItemProps> = {
  render: () => {
    return (
      <TokenSingleChainListItem
        priceNode={<span>$42000</span>}
        tokenImg={"https://station-assets.terra.dev/img/coins/Luna.svg"}
        symbol={"LUNA"}
        price={1}
        amountNode={<span>420.00</span>}
        chain={{ icon: "https://station-assets.terra.dev/img/chains/Terra.svg", label: "Terra" }}
      />
    )
  },
  argTypes: {},
};

export const SendBack: StoryObj<TokenSingleChainListItemProps> = {
  render: () => {
    return (
      <TokenSingleChainListItem
        priceNode={<span>$ 42000</span>}
        tokenImg={"https://station-assets.terra.dev/img/coins/Luna.svg"}
        symbol={"LUNA"}
        price={1}
        amountNode={<span>420.00</span>}
        chain={{ icon: "https://station-assets.terra.dev/img/chains/Terra.svg", label: "Terra" }}
        isSendBack
      />
    )
  },
  argTypes: {},
};

export const WithChainCheckbox: StoryObj<TokenCheckboxListItemProps> = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <TokenCheckboxListItem
        tokenImg={"https://station-assets.terra.dev/img/coins/Luna.svg"}
        symbol={"LUNA"}
        onClick={() => setChecked(!checked)}
        checked={checked}
        chain={{ icon: "https://station-assets.terra.dev/img/chains/Terra.svg", label: "Terra" }}
      />
    )
  },
  argTypes: {},
};
