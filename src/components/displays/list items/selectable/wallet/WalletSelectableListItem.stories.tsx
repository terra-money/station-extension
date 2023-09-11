import type { Meta, StoryObj } from '@storybook/react';
import WalletSelectableListItem, { WalletSelectableListItemProps } from './WalletSelectableListItem';

const meta: Meta<WalletSelectableListItemProps> = {
  title: 'Components/List Items/Wallet (Selectable)',
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
        subLabel={"terra1hod3...pazdy5"}
        active={false}
        onClick={() => {}}
        settingsOnClick={() => {}}
      />
    )
  },
  argTypes: {},
};
