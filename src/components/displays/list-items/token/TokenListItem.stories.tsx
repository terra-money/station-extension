import type { Meta, StoryObj } from '@storybook/react';
import TokenListItem, { TokenListItemProps } from './default/TokenListItem';
import TokenSingleChainListItem, { TokenSingleChainListItemProps } from './single-chain/TokenSingleChainListItem';
import TokenCheckboxListItem, { TokenCheckboxListItemProps } from './single-chain/TokenCheckboxListItem';

const meta: Meta<TokenListItemProps> = {
  title: 'Components/list-items/Token',
  component: TokenListItem,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj<TokenListItemProps> = {
  render: () => {
    return (
      <TokenListItem
        balance={"420.00"}
        chains={["terra", "axelar"]}
        currency={{ id: 'usd', symbol: '$', name: 'USD' }}
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

export const DefaultSingleChain: StoryObj<TokenListItemProps> = {
  render: () => {
    return (
      <TokenListItem
        balance={"420.00"}
        chains={["terra"]}
        currency={{ id: 'usd', symbol: '$', name: 'USD' }}
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
        balance={"420.00"}
        currency={{ id: 'usd', symbol: '$', name: 'USD' }}
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
        balance={"420.00"}
        currency={{ id: 'usd', symbol: '$', name: 'USD' }}
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
    return (
      <TokenCheckboxListItem
        tokenImg={"https://station-assets.terra.dev/img/coins/Luna.svg"}
        symbol={"LUNA"}
        onClick={() => { }}
        chain={{ icon: "https://station-assets.terra.dev/img/chains/Terra.svg", label: "Terra" }}
      />
    )
  },
  argTypes: {},
};
