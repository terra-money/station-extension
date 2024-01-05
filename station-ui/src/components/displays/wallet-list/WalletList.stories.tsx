import type { Meta, StoryObj } from '@storybook/react';
import WalletList from './WalletList';

const meta: Meta = {
  title: 'Components/Displays/Wallet List/Stories',
  component: WalletList,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj = {
  render: () => (
    <WalletList
      activeWallet={{
        name: 'my-wallet',
        address: 'terra1u28fgu0p99eh9xc4623k6cw6qmfdnl9un23yxs',
        settingsOnClick: () => {},
        isMultisig: true
      }}
      otherWallets={
        [{
          name: 'other-wallet-1',
          address: 'terra1u28fgu0p99eh9xc4623k6cw6qmfdnl9un23yxs',
          onClick: () => {},
          settingsOnClick: () => {},
          isMultisig: true
        },
        {
          name: 'other-wallet-2',
          address: 'terra1u28fgu0p99eh9xc4623k6cw6qmfdnl9un23yxs',
          onClick: () => {},
          settingsOnClick: () => {},
          isLedger: true
        },{
          name: 'other-wallet-3',
          address: 'terra1u28fgu0p99eh9xc4623k6cw6qmfdnl9un23yxs',
          onClick: () => {},
          settingsOnClick: () => {},
        }]
      }
    />
  ),
};

export const OthersOnly: StoryObj = {
  render: () => (
    <WalletList
      otherWallets={
        [{
          name: 'other-wallet-1',
          address: 'terra1u28fgu0p99eh9xc4623k6cw6qmfdnl9un23yxs',
          onClick: () => {},
        },
        {
          name: 'other-wallet-2',
          address: 'terra1u28fgu0p99eh9xc4623k6cw6qmfdnl9un23yxs',
          onClick: () => {},
        },{
          name: 'other-wallet-3',
          address: 'terra1u28fgu0p99eh9xc4623k6cw6qmfdnl9un23yxs',
          onClick: () => {},
        }]
      }
    />
  ),
};
