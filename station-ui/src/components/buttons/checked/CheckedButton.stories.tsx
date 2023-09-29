import type { Meta, StoryObj } from '@storybook/react';
import CheckedButton, { CheckedButtonProps } from './CheckedButton';
import { useState } from 'react';

const meta: Meta<CheckedButtonProps> = {
  title: 'Components/Buttons/Checked/CheckedButton',
  component: CheckedButton,
  argTypes: {
    label: {
      control: 'text',
      defaultValue: 'Button',
      description: 'The label of the Button.',
      table: {
        defaultValue: { summary: 'Button' },
        type: { summary: 'string' },
      }
    },
    active: {
      control: 'boolean',
      defaultValue: false,
      description: 'Sets the active state of the Button.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      }
    },
  },
} as Meta;

export default meta;

export const Playground: StoryObj<CheckedButtonProps> = {
  render: ({ active, label }: CheckedButtonProps) =>
    <CheckedButton
      active={active}
      label={label}
    />,
  args: {
    active: false,
    label: 'Button',
  },
  argTypes: {
    active: {
      control: 'boolean',
      description: 'false',
    },
    label: {
      control: 'text',
    }
  },
};

export const NotActive: StoryObj<CheckedButtonProps> = {
  render: ({ active, label }: CheckedButtonProps) =>
    <CheckedButton
      active={active}
      label={label}
    />,
  args: {
    active: false,
    label: 'Button',
  },
};

export const Active: StoryObj<CheckedButtonProps> = {
  render: ({ active, label }: CheckedButtonProps) =>
    <CheckedButton
      active={active}
      label={label}
    />,
  args: {
    active: true,
    label: 'Button',
  },
};

const StoryBookExample = () => {
  const seedPhrase = 'these are some words that make';

  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <div style={{ width: '342px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {seedPhrase.split(' ').map((word, index) => (
        <CheckedButton
          key={index}
          active={activeIndex === index}
          label={word}
          onClick={() => setActiveIndex(index)}
        />
      ))}
    </div>
  )
};

export const NewWalletExample: StoryObj<CheckedButtonProps> = {
  render: () => {
    return <StoryBookExample />
  },
  argTypes: {
    active: {
      control: false,
    },
    label: {
      control: false,
    },
  },
};
