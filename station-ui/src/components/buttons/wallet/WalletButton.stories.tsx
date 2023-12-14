import type { Meta, StoryObj } from '@storybook/react';
import WalletButton, { WalletButtonProps } from './WalletButton';

const meta: Meta<WalletButtonProps> = {
  title: 'Components/Buttons/Wallet/WalletButton',
  component: WalletButton,
  argTypes: {},
} as Meta;

export default meta;

export const WithEmoji: StoryObj<WalletButtonProps> = {
  render: () => {
    return (
      <WalletButton
        emoji={"🔥"}
        walletName="my-wallet"
        walletAddress="terra1hod3...pazdy5"
        chainIcon="https://station-assets.terra.dev/img/chains/Terra.svg"
        onClick={() => console.log("clicked!")}
      />
    )
  },
  argTypes: {},
};

export const NoEmoji: StoryObj<WalletButtonProps> = {
  render: () => {
    return (
      <WalletButton
        walletName="my-wallet"
        walletAddress="terra1hod3...pazdy5"
        chainIcon="https://station-assets.terra.dev/img/chains/Terra.svg"
        onClick={() => console.log("clicked!")}
      />
    )
  },
  argTypes: {},
};

export const Secondary: StoryObj<WalletButtonProps> = {
  render: () => {
    return (
      <WalletButton
        variant='secondary'
        walletName="my-wallet"
        walletAddress="Multiple Addresses"
        onClick={() => console.log("clicked!")}
      />
    )
  },
  argTypes: {},
};
