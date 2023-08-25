import type { Meta, StoryObj } from '@storybook/react';
import { Decorator } from "DocsHelpers"
import { DEFAULT_PARAMS } from 'Constants';
// import { ReactComponent as WalletIcon } from 'assets/icon/Wallet16.svg';
import InputInLine, { InputInLineProps } from './InputInLine';
import Paste from 'components/general/paste/Paste';
import { useState } from 'react';


const meta: Meta<InputInLineProps> = {
  title: 'Components/Inputs/InLine/Stories',
  component: InputInLine,
  argTypes: {
    inLineLabel: {
      control: {
        type: 'text'
      },
      description: 'Text for the In-Line Label.',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      }
    },
    inLineExtra: {
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
  parameters: { ...DEFAULT_PARAMS },
  decorators: [Decorator],

} as Meta;

export default meta;

// export const Playground: StoryObj<InputProps> = {
//   render: (args) => (
//     <Input
//       {...args}
//     />
//   ),
//   args: {
//     placeholder: 'This is a placeholder',
//     emoji: '🔥',
//   }
// };

export const Default: StoryObj<InputInLineProps> = {
  render: () => (
    <InputInLine
      inLineLabel={'To'}
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
      inLineLabel={'To'}
      inLineExtra={'extra'}
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
      inLineLabel={'To'}
      inLineExtra={
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

// export const SubIcon: StoryObj<InputProps> = {
//   render: () => (
//     <Input
//       actionIcon={{
//         icon: <WalletIcon fill='var(--token-dark-900)' />,
//         onClick: () => console.log('clicked')
//       }}
//       placeholder='Primary with sub icon'
//     />
//   ),
//   argTypes: {
//     placeholder: {
//       control: false,
//     },
//   }
// };

// export const Emoji: StoryObj<InputProps> = {
//   render: () => (
//     <Input
//       emoji={'🔥'}
//       placeholder='Primary with emoji'
//     />
//   ),
//   argTypes: {
//     placeholder: {
//       control: false,
//     },
//   }
// };

// export const Warning: StoryObj<InputProps> = {
//   render: () => (
//     <Input
//       placeholder='Primary with warning'
//       warning={!!'Warning message'}
//     />
//   ),
//   argTypes: {
//     error: {
//       control: false,
//     },
//     warning: {
//       control: false,
//     },
//     placeholder: {
//       control: false,
//     },
//   }
// };

// export const Error: StoryObj<InputProps> = {
//   render: () => (
//     <Input
//       placeholder='Primary with error'
//       error={!!'Error message'}
//     />
//   ),
//   argTypes: {
//     error: {
//       control: false,
//     },
//     warning: {
//       control: false,
//     },
//     placeholder: {
//       control: false,
//     },
//   }
// };
