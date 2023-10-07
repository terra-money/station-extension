import type { Meta, StoryObj } from '@storybook/react';
import WalletListItem, { WalletListItemProps } from './WalletListItem';

const meta: Meta<WalletListItemProps> = {
  title: 'Components/List Items/Wallet/Stories',
  component: WalletListItem,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj<WalletListItemProps> = {
  render: () => {
    return (
      <WalletListItem
        name={"lots-of-money-here"}
        address={"terra1hod3...pazdy5"}
        emoji={"🚀"}
      />
    )
  },
  argTypes: {},
};

export const WithBalance: StoryObj<WalletListItemProps> = {
  render: () => {
    return (
      <WalletListItem
        name={"lots-of-money-here"}
        address={"terra1hod3...pazdy5"}
        emoji={"🚀"}
        walletBalance={"$420.00"}
      />
    )
  },
  argTypes: {},
};

export const WithLetter: StoryObj<WalletListItemProps> = {
  render: () => {
    return (
      <WalletListItem
        name={"lots-of-money-here"}
        address={"terra1hod3...pazdy5"}
        emoji={"T"}
      />
    )
  },
  argTypes: {},
};
