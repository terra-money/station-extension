import type { Meta, StoryObj } from '@storybook/react';
import WalletNavButton, { WalletNavButtonProps } from './WalletNavButton';

const meta: Meta = {
  title: 'Dashboard/Buttons/Wallet/WalletNavButton',
  component: WalletNavButton,
} as Meta;

export default meta;

export const Default: StoryObj<WalletNavButtonProps> = {
  render: () =>
    <WalletNavButton
      walletName='my-wallet'
    />,
};
