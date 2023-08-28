import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import MultiInputWrapper, { MultiInputWrapperProps } from './MultiInputWrapper';
import { Input } from 'components/inputs';

const meta: Meta = {
  title: 'Components/Form Helpers/Wrappers/MultiInputWrapper',
  component: MultiInputWrapper,
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

interface PlaygroundArgs extends MultiInputWrapperProps {
  showError: boolean
  showWarning: boolean
}

export const Playground: StoryObj<PlaygroundArgs> = {
  render: ({ showError, showWarning, label, layout }: PlaygroundArgs) => (
    <MultiInputWrapper
      label={label}
      error={showError ? 'This is an error message' : ''}
      warning={showWarning ? 'This is a warning message' : ''}
      layout={layout}
    >
      <Input
        // {...register('input-label1', {})}
        placeholder={'Placeholder'}
      />
      <Input
        // {...register('input-label2', {})}
        placeholder={'Placeholder'}
      />
      <Input
        // {...register('input-label3', {})}
        placeholder={'Placeholder'}
      />
    </MultiInputWrapper>
  ),
  args: {
    layout: 'horizontal',
    showWarning: false,
    showError: false,
    label: 'Input Label',
  },
  argTypes: {
    layout: {
      options: ['horizontal', 'vertical'],
      control: {
        type: 'select',
      },
      description: 'Sets the layout direction of the inputs',
    },
    showError: {
      control: {
        type: 'boolean',
      },
      description: 'For Playground only',
    },
    showWarning: {
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

export const LayoutHorizontal: StoryObj = {
  render: () => (
    <MultiInputWrapper
      label={'Input Label'}
      layout='horizontal'
    >
      <Input
        // {...register('input-label', {})}
        placeholder={'Placeholder'}
      />
      <Input
        // {...register('input-label', {})}
        placeholder={'Placeholder'}
      />
      <Input
        // {...register('input-label', {})}
        placeholder={'Placeholder'}
      />
    </MultiInputWrapper>
  ),
};

export const LayoutVertical: StoryObj = {
  render: () => (
    <MultiInputWrapper
      label={'Input Label'}
      layout='vertical'
    >
      <Input
        // {...register('input-label', {})}
        placeholder={'Placeholder'}
      />
      <Input
        // {...register('input-label', {})}
        placeholder={'Placeholder'}
      />
      <Input
        // {...register('input-label', {})}
        placeholder={'Placeholder'}
      />
    </MultiInputWrapper>
  ),
};

export const WithError: StoryObj = {
  render: () => (
    <MultiInputWrapper
      label={'Input Label'}
      error={'This is an error message'}
      layout='horizontal'
    >
      <Input
        // {...register('input-label', {})}
        placeholder={'Placeholder'}
      />
      <Input
        // {...register('input-label', {})}
        placeholder={'Placeholder'}
      />
      <Input
        // {...register('input-label', {})}
        placeholder={'Placeholder'}
      />
    </MultiInputWrapper>
  ),
};

export const WithWarning: StoryObj = {
  render: () => (
    <MultiInputWrapper
      label={'Input Label'}
      warning={'This is a warning message'}
      layout='horizontal'
    >
      <Input
        // {...register('input-label', {})}
        placeholder={'Placeholder'}
      />
      <Input
        // {...register('input-label', {})}
        placeholder={'Placeholder'}
      />
      <Input
        // {...register('input-label', {})}
        placeholder={'Placeholder'}
      />
    </MultiInputWrapper>
  ),
};