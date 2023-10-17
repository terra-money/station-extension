import type { Meta, StoryObj } from '@storybook/react';
import WalletSummaryCard, { WalletSummaryCardProps } from './WalletSummaryCard';

const meta: Meta<WalletSummaryCardProps> = {
  title: 'Components/Cards/WalletSummary/Stories',
  component: WalletSummaryCard,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj<WalletSummaryCardProps> = {
  render: () => {
    return (
      <WalletSummaryCard
        walletType={"m/44’/330’"}
        walletAddress={"terra1si2hi2d2d...916sh2"}
        walletBalance={"0 LUNA"}
        prevTransactions={"0"}
      />
    )
  },
  argTypes: {},
};

export const HasValues: StoryObj<WalletSummaryCardProps> = {
  render: () => {
    return (
      <WalletSummaryCard
        walletType={"m/44’/330’"}
        walletAddress={"terra1si2hi2d2d...916sh2"}
        walletBalance={"10 LUNA"}
        prevTransactions={"1"}
      />
    )
  },
  argTypes: {},
};

export const IsActive: StoryObj<WalletSummaryCardProps> = {
  render: () => {
    return (
      <WalletSummaryCard
        walletType={"m/44’/330’"}
        walletAddress={"terra1si2hi2d2d...916sh2"}
        walletBalance={"10 LUNA"}
        prevTransactions={"1"}
        isActive
        onClick={() => { }}
      />
    )
  },
  argTypes: {},
};
