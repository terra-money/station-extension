import type { Meta, StoryObj } from '@storybook/react';
import { Decorator } from "DocsHelpers"
import { DEFAULT_PARAMS } from 'Constants';
// import Input, { InputProps } from './Input';
import StandardDropdown, { StandardDropdownProps } from './Dropdown';

const meta: Meta<StandardDropdownProps> = {
  title: 'Components/Inputs/Dropdown/Stories',
  component: StandardDropdown,
  argTypes: {},
  parameters: { ...DEFAULT_PARAMS },
  decorators: [Decorator],
} as Meta;

export default meta;

export const Default: StoryObj<StandardDropdownProps> = {
  render: () => {
    const options = [
      { id: "mainnet", label: "Mainnet", image: '' },
      { id: "classic", label: "Classic", image: '' },
      { id: "ropsten", label: "Ropsten", image: '' },
      { id: "kovan", label: "Kovan", image: '' },
    ];

    return (
      <StandardDropdown
        options={options}
        onChange={() => {}}
        selectedId="mainnet"
      />
    )
  },
  argTypes: {},
};
