import type { Meta, StoryObj } from '@storybook/react';
import WalletList from './WalletList';

const meta: Meta = {
  title: 'Components/Displays/Wallet List',
  component: WalletList,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj = {
  render: () => (
    <WalletList
      activeWallet={{
        name: 'my-wallet',
        address: 'terra5dnwe3fc...pazdy5',
        settingsOnClick: () => {},
      }}
      otherWallets={
        [{
          name: 'other-wallet-1',
          address: 'terra5dnwe3fc...pazdy5',
          onClick: () => {},
          settingsOnClick: () => {},
        },
        {
          name: 'other-wallet-2',
          address: 'terra5dnwe3fc...pazdy5',
          onClick: () => {},
          settingsOnClick: () => {},
        },{
          name: 'other-wallet-3',
          address: 'terra5dnwe3fc...pazdy5',
          onClick: () => {},
          settingsOnClick: () => {},
        }]
      }
    />
  ),
};
