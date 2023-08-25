import type { Meta, StoryObj } from '@storybook/react';
import { Decorator } from "DocsHelpers"
import { DEFAULT_PARAMS } from 'Constants';
import { ReactComponent as SendArrow } from 'assets/icon/SendArrow.svg';
import { ReactComponent as Receive } from 'assets/icon/Receive.svg';
import { ReactComponent as FlipArrows } from 'assets/icon/FlipArrows.svg';
import { ReactComponent as SwapArrows } from 'assets/icon/SwapArrows.svg';
import RoundedButton, { RoundedButtonConfig } from './RoundedButton';

const meta: Meta<RoundedButtonConfig> = {
  title: 'Components/Buttons/Rounded/Base',
  component: RoundedButton,
  argTypes: {
    variant: {
      options: ['primary', 'secondary'],
      control: {
        type: 'select',
      },
      defaultValue: 'primary',
      description: 'The variant of the Button.',
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
  parameters: { ...DEFAULT_PARAMS },
  decorators: [Decorator],

} as Meta;

export default meta;

type StoryRoundedButtonConfig = RoundedButtonConfig & { label?: string };

export const Playground: StoryObj<StoryRoundedButtonConfig> = {
  render: (args: StoryRoundedButtonConfig) =>
    <RoundedButton
      {...args}
    />,
  args: {
    variant: 'primary',
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
    variant: 'primary',
    size: 'default',
    icon: <SendArrow fill='var(--token-light-white)' />,
  },
  argTypes: {
    variant: {
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
    variant: 'secondary',
    size: 'default',
    icon: <Receive fill='var(--token-light-white)' />,
  },
  argTypes: {
    variant: {
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
    variant: 'secondary',
    size: 'small',
    icon: <FlipArrows fill='var(--token-light-100)' />,
  },
  argTypes: {
    variant: {
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
    variant: 'primary',
    size: 'large',
    icon: <SwapArrows fill='var(--token-light-white)' />,
  },
  argTypes: {
    variant: {
      control: false,
    },
    size: {
      control: false,
    },
  },
};
