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
      { id: "terra", label: "Terra", image: 'https://c05ccb16.station-assets.pages.dev/img/chains/Terra.svg' },
      { id: "axelar", label: "Axelar", image: 'https://c05ccb16.station-assets.pages.dev/img/chains/Axelar.svg' },
      { id: "carbon", label: "Carbon", image: 'https://c05ccb16.station-assets.pages.dev/img/chains/Carbon.svg' },
      { id: "cosmos", label: "Cosmos", image: 'https://c05ccb16.station-assets.pages.dev/img/chains/Cosmos.svg' },
      { id: "crescent", label: "Crescent", image: 'https://c05ccb16.station-assets.pages.dev/img/chains/Crescent.svg' },
      { id: "juno", label: "Juno", image: 'https://c05ccb16.station-assets.pages.dev/img/chains/Juno.svg' },
      { id: "mars", label: "Mars", image: 'https://c05ccb16.station-assets.pages.dev/img/chains/Mars.svg' },
    ];

    return (
      <StandardDropdown
        options={options}
        onChange={() => {}}
        selectedId="terra"
      />
    )
  },
  argTypes: {},
};

export const DefaultTextOnly: StoryObj<StandardDropdownProps> = {
  render: () => {
    const options = [
      { id: "terra", label: "Terra" },
      { id: "axelar", label: "Axelar" },
      { id: "carbon", label: "Carbon" },
      { id: "cosmos", label: "Cosmos" },
      { id: "crescent", label: "Crescent" },
      { id: "juno", label: "Juno" },
      { id: "mars", label: "Mars" },
    ];

    return (
      <StandardDropdown
        options={options}
        onChange={() => {}}
        selectedId="terra"
      />
    )
  },
  argTypes: {},
};
