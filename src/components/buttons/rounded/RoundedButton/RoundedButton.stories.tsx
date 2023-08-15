import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { ReactComponent as SendArrow } from 'assets/icon/SendArrow.svg';
import { ReactComponent as Receive } from 'assets/icon/Receive.svg';
import { ReactComponent as FlipArrows } from 'assets/icon/FlipArrows.svg';
import { ReactComponent as SwapArrows } from 'assets/icon/SwapArrows.svg';
import RoundedButton, { RoundedButtonConfig } from './RoundedButton';

const meta: Meta<RoundedButtonConfig> = {
  title: 'Components/Buttons/Rounded/Base',
  component: RoundedButton,
  argTypes: {
    color: {
      options: ['primary', 'secondary'],
      control: {
        type: 'select',
      },
      defaultValue: 'primary',
      description: 'The color of the Button.',
      table: {
        defaultValue: { summary: '"primary"' },
        type: { summary: 'string' },
      }
    },
    icon: {
      control: false,
      description: 'Adds an icon to the Button.',
      table: {
        type: { summary: 'ReactComponent' },
      }
    },
    size: {
      options: ['default', 'small', 'large'],
      control: {
        type: 'select',
      },
      defaultValue: 'default',
      description: 'The size of the Button.',
      table: {
        defaultValue: { summary: '"default"' },
        type: { summary: 'string' },
      }
    },
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

type StoryRoundedButtonConfig = RoundedButtonConfig & { label?: string };

export const Playground: StoryObj<StoryRoundedButtonConfig> = {
  render: (args: StoryRoundedButtonConfig) =>
    <RoundedButton
      {...args}
    />,
  args: {
    color: 'primary',
    size: 'default',
    icon: <SendArrow fill='var(--token-light-white)' />,
  },
};

export const Primary: StoryObj<StoryRoundedButtonConfig> = {
  render: (args: StoryRoundedButtonConfig) =>
    <RoundedButton
      {...args}
    />,
  args: {
    color: 'primary',
    size: 'default',
    icon: <SendArrow fill='var(--token-light-white)' />,
  },
  argTypes: {
    color: {
      control: false,
    },
    size: {
      control: false,
    },
  },
};

export const Secondary: StoryObj<StoryRoundedButtonConfig> = {
  render: (args: StoryRoundedButtonConfig) =>
    <RoundedButton
      {...args}
    />,
  args: {
    color: 'secondary',
    size: 'default',
    icon: <Receive fill='var(--token-light-white)' />,
  },
  argTypes: {
    color: {
      control: false,
    },
    size: {
      control: false,
    },
  },
};

export const Small: StoryObj<StoryRoundedButtonConfig> = {
  render: (args: StoryRoundedButtonConfig) =>
    <RoundedButton
      {...args}
    />,
  args: {
    color: 'secondary',
    size: 'small',
    icon: <FlipArrows fill='var(--token-light-100)' />,
  },
  argTypes: {
    color: {
      control: false,
    },
    size: {
      control: false,
    },
  },
};

export const Large: StoryObj<StoryRoundedButtonConfig> = {
  render: (args: StoryRoundedButtonConfig) =>
    <RoundedButton
      {...args}
    />,
  args: {
    color: 'primary',
    size: 'large',
    icon: <SwapArrows fill='var(--token-light-white)' />,
  },
  argTypes: {
    color: {
      control: false,
    },
    size: {
      control: false,
    },
  },
};