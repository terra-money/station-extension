import type { Meta, StoryObj } from '@storybook/react';
import InputInLine, { InputInLineProps } from './InputInLine';
import Paste from 'components/general/paste/Paste';
import { useState } from 'react';

const meta: Meta<InputInLineProps> = {
  title: 'Components/Inputs/InLine/Stories',
  component: InputInLine,
  argTypes: {
    label: {
      control: {
        type: 'text'
      },
      description: 'Text for the In-Line Label.',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      }
    },
    extra: {
      control: {
        disable: true
      },
      description: 'Adds extra content to the In-Line Input.',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'ReactNode' },
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

export const Default: StoryObj<InputInLineProps> = {
  render: () => (
    <InputInLine
      label={'To'}
      placeholder='Primary input'
    />
  ),
  argTypes: {
    placeholder: {
      control: false,
    },
  },
};

export const WithTextExtra: StoryObj<InputInLineProps> = {
  render: () => (
    <InputInLine
      label={'To'}
      extra={'extra'}
      placeholder='Primary input'
    />
  ),
  argTypes: {
    placeholder: {
      control: false,
    },
  },
};

const ExampleComponent = () => {
  const [value, setValue] = useState('');

  return (
    <InputInLine
      label={'To'}
      extra={
        <Paste
          onPaste={(text) => setValue(text)}
        />
      }
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder='Primary input'
    />
  )
};

export const ExampleWithExtraPaste: StoryObj<InputInLineProps> = {
  render: () => (
    <ExampleComponent />
  ),
  argTypes: {
    placeholder: {
      control: false,
    },
  },
};
