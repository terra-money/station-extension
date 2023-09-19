import type { Meta, StoryObj } from '@storybook/react';
import WalletSelectableListItem, { WalletSelectableListItemProps } from './WalletSelectableListItem';

const meta: Meta<WalletSelectableListItemProps> = {
  title: 'Components/list-items/Wallet (Selectable)',
  component: WalletSelectableListItem,
  argTypes: {},
} as Meta;

export default meta;

export const ActiveWallet: StoryObj<WalletSelectableListItemProps> = {
  render: () => {
    return (
      <WalletSelectableListItem
        label={"lots-of-money-here"}
        subLabel={"terra1hod3...pazdy5"}
        active={true}
        copyValue={"terra1u28fgu0p99eh9xc4623k6cw6qmfdnl9un23yxs"}
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
