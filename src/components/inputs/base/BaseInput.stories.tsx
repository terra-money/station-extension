import type { Meta, StoryObj } from '@storybook/react';
import { ReactComponent as WalletIcon } from 'assets/icon/Wallet16.svg';
import Input, { InputProps } from './Input';

const meta: Meta<InputProps> = {
  title: 'Components/Inputs/Base/Stories',
  component: Input,
  argTypes: {
    actionIcon: {
      control: {
        disable: true
      },
      description: 'Adds action icon button to the Input.',
      table: {
        defaultValue: { summary: '{ icon: </>, onClick: () => {}}' },
        type: { summary: 'object' },
      }
    },
    emoji: {
      control: {
        disable: true
      },
      description: 'Adds emoji to the Input.',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      }
    },
    placeholder: {
      control: 'text',
      defaultValue: '',
      description: 'The placeholder of the Input.',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      }
    },
  },
} as Meta;

export default meta;

export const Playground: StoryObj<InputProps> = {
  render: (args) => (
    <Input
      {...args}
    />
  ),
  args: {
    placeholder: 'This is a placeholder',
    emoji: '🔥',
  }
};

export const Default: StoryObj<InputProps> = {
  render: () => (
    <Input
      placeholder='Primary input'
    />
  ),
  argTypes: {
    placeholder: {
      control: false,
    },
  },
};

export const SubIcon: StoryObj<InputProps> = {
  render: () => (
    <Input
      actionIcon={{
        icon: <WalletIcon fill='var(--token-dark-900)' />,
        onClick: () => console.log('clicked')
      }}
      placeholder='Primary with sub icon'
    />
  ),
  argTypes: {
    placeholder: {
      control: false,
    },
  }
};

export const Emoji: StoryObj<InputProps> = {
  render: () => (
    <Input
      emoji={'🔥'}
      placeholder='Primary with emoji'
    />
  ),
  argTypes: {
    placeholder: {
      control: false,
    },
  }
};
