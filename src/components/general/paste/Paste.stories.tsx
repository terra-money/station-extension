import type { Meta, StoryObj } from '@storybook/react';
import Paste, { PasteProps } from './Paste';
// import { Input, FormItem } from 'components/Form Components'
import { Input } from 'components/inputs';
import { InputWrapper } from 'components/form helpers/wrappers/InputWrapper/InputWrapper';
import Copy from 'components/general/copy/Copy';
import { useState } from 'react';

const meta: Meta<PasteProps> = {
  title: 'Components/General/Paste',
  component: Paste,
  argTypes: {
    textOverride: {
      control: 'text',
      defaultValue: 'Paste',
      description: 'Overrides the text of the Paste button. Translations should be passed with this.',
      table: {
        defaultValue: { summary: '' },
      }
    },
    onPaste: {
      action: 'onPaste',
      description: 'Called when the Paste button is clicked.',
      table: {
        defaultValue: { summary: 'onPaste' },
      }
    },
    withIcon: {
      control: {
        type: 'boolean',
      },
      description: 'Adds an icon to the Paste button.',
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      }
    },
    className: {
      control: {
        disable: true
      },
      description: 'Adds a className override to the Paste button.',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      }
    },
  },
} as Meta;

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Paste
      textOverride={'Paste'}
      onPaste={() => console.log('Paste')}
    />
  ),
  argTypes: {
    withIcon: {
      control: {
        disable: true
      },
    },
    textOverride: {
      control: {
        disable: true
      },
    },
  },
};

export const WithIcon: StoryObj = {
  render: () => (
    <Paste
      textOverride={'Paste'}
      onPaste={() => console.log('Paste')}
      withIcon
    />
  ),
  argTypes: {
    withIcon: {
      control: {
        disable: true
      },
    },
    textOverride: {
      control: {
        disable: true
      },
    },
  },
};

const ExampleComponent = () => {
  const [inputValue, setInputValue] = useState('');

  // const paste = (lines: string[]) => {
  //   setInputValue(lines[0]);
  // };

  return (
    <div style={{ width: '400px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <h5>Copy This:</h5>
        <Copy iconOnly copyText={'terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v'} />
      </div>
      <InputWrapper
        label={'Address'}
        extra={
          <Paste
            onPaste={(text) => setInputValue(text)}
          />
        }
      >
        <Input value={inputValue} placeholder='terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v' />
      </InputWrapper>
    </div>
  );
};

export const Example: StoryObj = {
  render: () => (
    <ExampleComponent />
  ),
};
