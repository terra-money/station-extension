import type { Meta, StoryObj } from '@storybook/react';
import AddressSelectableListItem, { AddressSelectableListItemProps } from './AddressSelectableListItem';

const meta: Meta<AddressSelectableListItemProps> = {
  title: 'Components/List Items/Selectable/Address',
  component: AddressSelectableListItem,
  argTypes: {},
} as Meta;

export default meta;

export const WithChainImg: StoryObj<AddressSelectableListItemProps> = {
  render: () => {
    return (
      <AddressSelectableListItem
        label={"Terra"}
        subLabel={"terra1hod3...pazdy5"}
        active={false}
        chain={{ icon: "https://station-assets.terra.dev/img/chains/Terra.svg", label: "Terra" }}
        onClick={() => console.log("clicked!")}
      />
    )
  },
  argTypes: {},
};

export const ActiveWithChainImg: StoryObj<AddressSelectableListItemProps> = {
  render: () => {
    return (
      <AddressSelectableListItem
        label={"Terra"}
        subLabel={"terra1hod3...pazdy5"}
        active={true}
        chain={{ icon: "https://station-assets.terra.dev/img/chains/Terra.svg", label: "Terra" }}
        onClick={() => console.log("clicked!")}
      />
    )
  },
  argTypes: {},
};

export const NoChainImg: StoryObj<AddressSelectableListItemProps> = {
  render: () => {
    return (
      <AddressSelectableListItem
        label={"Terra"}
        subLabel={"terra1hod3...pazdy5"}
        active={false}
        onClick={() => {}}
      />
    )
  },
  argTypes: {},
};