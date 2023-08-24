import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { InputWrapper, InputWrapperProps } from './InputWrapper';
import { Input } from 'components/inputs';

import { ReactComponent as WalletIcon } from 'assets/icon/Wallet16.svg';

const meta: Meta = {
  title: 'Components/Form Helpers/Wrappers/InputWrapper',
  component: InputWrapper,
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

// export const FullFormExample: StoryObj = {
//   render: () => (
//     <>
//       <InputWrapper label={'Name'}>
//         <Input
//           // {...register('name', {})}
//           placeholder={'mainnet'}
//           autoFocus
//         />
//       </InputWrapper>

//       <InputWrapper label={'Chain ID'}>
//         <Input
//           // {...register('chainID', { required: true })}
//           placeholder={'phoenix-1'}
//         />
//       </InputWrapper>

//       <InputWrapper label={'LCD'}>
//         <Input
//           // {...register('lcd', { required: true })}
//           placeholder={'https://phoenix-lcd.terra.dev'}
//         />
//       </InputWrapper>
//     </>
//   ),
// };

interface PlaygroundArgs extends InputWrapperProps {
  addExtra: boolean
  addError: boolean
  addWarning: boolean
}

export const Playground: StoryObj<PlaygroundArgs> = {
  render: ({ addExtra, addError, addWarning, label }: PlaygroundArgs) => (
    <InputWrapper
      label={label}
      extra={
        addExtra && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <WalletIcon fill='var(--token-dark-900)' />
            <span>8,334.02 LUNA</span>
          </div>
        )
      }
      error={addError ? 'This is an error message' : ''}
      warning={addWarning ? 'This is a warning message' : ''}
    >
      <Input
        // {...register('input-label', {})}
        placeholder={'Placeholder'}
      />
    </InputWrapper>
  ),
  args: {
    addExtra: true,
    addWarning: false,
    addError: false,
    label: 'Input Label',
  },
  argTypes: {
    addExtra: {
      control: {
        type: 'boolean',
      },
      description: 'For Playground only',
    },
    addError: {
      control: {
        type: 'boolean',
      },
      description: 'For Playground only',
    },
    addWarning: {
      control: {
        type: 'boolean',
      },
      description: 'For Playground only',
    },
    label: {
      control: {
        type: 'text',
      },
      description: 'Label for the input',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      }
    },
    extra: {
      control: false,
      description: 'Extra content to be displayed on the right side of the label',
      table: {
        type: { summary: 'ReactNode' },
      }
    },
    error: {
      control: false,
      description: 'Error message to be displayed below the input',
      table: {
        type: { summary: 'string' },
      }
    },
    warning: {
      control: false,
      description: 'Warning message to be displayed below the input',
      table: {
        type: { summary: 'string' },
      }
    },
  },
};

export const Default: StoryObj = {
  render: () => (
    <InputWrapper label={'Input Label'}>
      <Input
        // {...register('input-label', {})}
        placeholder={'Placeholder'}
        autoFocus
      />
    </InputWrapper>
  ),
};

export const WithExtra: StoryObj = {
  render: () => (
    <InputWrapper
      label={'Input Label'}
      extra={
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <WalletIcon fill='var(--token-dark-900)' />
          <span>8,334.02 LUNA</span>
        </div>
      }
    >
      <Input
        // {...register('input-label', {})}
        placeholder={'Placeholder'}
        autoFocus
      />
    </InputWrapper>
  ),
};

export const WithError: StoryObj = {
  render: () => (
    <InputWrapper
      label={'Input Label'}
      error={'This is an error message'}
    >
      <Input
        // {...register('input-label', {})}
        placeholder={'Placeholder'}
      />
    </InputWrapper>
  ),
};

export const WithWarning: StoryObj = {
  render: () => (
    <InputWrapper
      label={'Input Label'}
      warning={'This is a warning message'}
    >
      <Input
        // {...register('input-label', {})}
        placeholder={'Placeholder'}
      />
    </InputWrapper>
  ),
};