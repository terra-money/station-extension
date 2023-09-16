/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import StandardDropdown, { StandardDropdownProps } from './Dropdown';
import { useState } from 'react';

const meta: Meta<StandardDropdownProps> = {
  title: 'Components/Inputs/Dropdown/Stories',
  component: StandardDropdown,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj<StandardDropdownProps> = {
  render: () => {
    const options = [
      { value: "terra", label: "Terra", image: 'https://station-assets.terra.dev/img/chains/Terra.svg' },
      { value: "axelar", label: "Axelar", image: 'https://station-assets.terra.dev/img/chains/Axelar.svg' },
      { value: "carbon", label: "Carbon", image: 'https://station-assets.terra.dev/img/chains/Carbon.svg' },
      { value: "cosmos", label: "Cosmos", image: 'https://station-assets.terra.dev/img/chains/Cosmos.svg' },
      { value: "crescent", label: "Crescent", image: 'https://station-assets.terra.dev/img/chains/Crescent.svg' },
      { value: "juno", label: "Juno", image: 'https://station-assets.terra.dev/img/chains/Juno.svg' },
      { value: "mars", label: "Mars", image: 'https://station-assets.terra.dev/img/chains/Mars.svg' },
    ];

    const [selectedValue, setSelectedValue] = useState('terra');

    return (
      <StandardDropdown
        options={options}
        onChange={(value) => setSelectedValue(value)}
        value={selectedValue}
      />
    )
  },
  argTypes: {},
};

export const DefaultTextOnly: StoryObj<StandardDropdownProps> = {
  render: () => {
    const options = [
      { value: "terra", label: "Terra" },
      { value: "axelar", label: "Axelar" },
      { value: "carbon", label: "Carbon" },
      { value: "cosmos", label: "Cosmos" },
      { value: "crescent", label: "Crescent" },
      { value: "juno", label: "Juno" },
      { value: "mars", label: "Mars" },
    ];

    const [selectedValue, setSelectedValue] = useState('terra');

    return (
      <StandardDropdown
        options={options}
        onChange={(value) => setSelectedValue(value)}
        value={selectedValue}
      />
    )
  },
  argTypes: {},
};
