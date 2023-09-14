import type { Meta, StoryObj } from '@storybook/react';
import StandardDropdown, { StandardDropdownProps } from './Dropdown';

const meta: Meta<StandardDropdownProps> = {
  title: 'Components/Inputs/Dropdown/Stories',
  component: StandardDropdown,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj<StandardDropdownProps> = {
  render: () => {
    const options = [
      { value: "terra", label: "Terra", image: 'https://c05ccb16.station-assets.pages.dev/img/chains/Terra.svg' },
      { value: "axelar", label: "Axelar", image: 'https://c05ccb16.station-assets.pages.dev/img/chains/Axelar.svg' },
      { value: "carbon", label: "Carbon", image: 'https://c05ccb16.station-assets.pages.dev/img/chains/Carbon.svg' },
      { value: "cosmos", label: "Cosmos", image: 'https://c05ccb16.station-assets.pages.dev/img/chains/Cosmos.svg' },
      { value: "crescent", label: "Crescent", image: 'https://c05ccb16.station-assets.pages.dev/img/chains/Crescent.svg' },
      { value: "juno", label: "Juno", image: 'https://c05ccb16.station-assets.pages.dev/img/chains/Juno.svg' },
      { value: "mars", label: "Mars", image: 'https://c05ccb16.station-assets.pages.dev/img/chains/Mars.svg' },
    ];

    return (
      <StandardDropdown
        options={options}
        onChange={() => {}}
        value="terra"
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

    return (
      <StandardDropdown
        options={options}
        onChange={() => {}}
        value="terra"
      />
    )
  },
  argTypes: {},
};
