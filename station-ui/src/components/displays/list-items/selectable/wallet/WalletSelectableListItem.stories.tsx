import type { Meta, StoryObj } from '@storybook/react';
import WalletSelectableListItem, { WalletSelectableListItemProps } from './WalletSelectableListItem';

const meta: Meta<WalletSelectableListItemProps> = {
  title: 'Components/List Items/Selectable/Wallet',
  component: WalletSelectableListItem,
  argTypes: {},
} as Meta;

export default meta;

export const ActiveWallet: StoryObj<WalletSelectableListItemProps> = {
  render: () => {
    return (
      <WalletSelectableListItem
        label={"lots-of-money-here"}
        walletName='Money'
        emoji='https://station-assets.terra.dev/img/chains/Stride.png'
        subLabel={"terra1hod3...pazdy5"}
        copyValue={"terra1u28fgu0p99eh9xc4623k6cw6qmfdnl9un23yxs"}
        active={true}
        onClick={() => console.log("clicked!")}
        settingsOnClick={() => console.log('settings clicked!')}
      />
    )
  },
  argTypes: {},
};

export const NonActiveWallet: StoryObj<WalletSelectableListItemProps> = {
  render: () => {
    return (
      <WalletSelectableListItem
        walletName='Big Money'
        emoji='https://station-assets.terra.dev/img/chains/Stride.png'
        label={"lots-of-money-here"}
        copyValue={"terra1u28fgu0p99eh9xc4623k6cw6qmfdnl9un23yxs"}
        subLabel={"terra1hod3...pazdy5"}
        active={false}
        onClick={() => {}}
        settingsOnClick={() => {}}
      />
    )
  },
  argTypes: {},
};
