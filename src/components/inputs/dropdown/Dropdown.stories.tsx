import type { Meta, StoryFn, StoryObj } from '@storybook/react';
// import Input, { InputProps } from './Input';
import StandardDropdown, { StandardDropdownProps } from './Dropdown';

const meta: Meta<StandardDropdownProps> = {
  title: 'Components/Inputs/Dropdown/Stories',
  component: StandardDropdown,
  argTypes: {
  },
  parameters: {
    controls: {
      hideNoControlsWarning: true,
      expanded: true,
    },
    backgrounds: {
      disable: true,
    }
  },
  decorators: [
    (Story: StoryFn) => (
      <div className="story__decorator" style={{
        padding: '48px 24px',
        backgroundColor: 'var(--token-dark-200)',
        margin: '-20px -10px',
        borderRadius: '8px',
        fontSize: 'var(--token-font-size-small)'
      }}>
        <Story />
      </div>
    ),
  ],
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
        onChange={() => { }}
        selectedId="mainnet"
      />
    )
  },
  argTypes: {
  },
};
