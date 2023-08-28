import type { StoryObj, Meta } from '@storybook/react';
import ModalButton, { ModalButtonProps } from './ModalButton';
import { Button } from 'components/buttons';

const meta: Meta<ModalButtonProps> = {
  title: 'Components/Feedback/Modals/ModalButton',
  component: ModalButton,
  argTypes: {
    title: {
      control: 'text',
      defaultValue: 'Modal Title',
      description: 'Sets the title of the Modal. (Passed to <Modal />)',
      table: {
        defaultValue: { summary: 'Modal Title' },
      }
    },
    renderButton: {
      control: 'none',
      description: 'Sets the renderButton of the ModalButton.',
      table: {
        defaultValue: { summary: '() => ReactNode' },
      }
    },
    minimal: {
      control: 'boolean',
      defaultValue: false,
      description: 'Is passed to <Modal />. Sets the minimal style of the Modal. (changes width to fit-content and padding to 0px)',
      table: {
        defaultValue: { summary: false },
      }
    },
    isOpen: {
      control: 'boolean',
      defaultValue: false,
      description: 'Is an override for the ModalButton to open. (Only opens)',
      table: {
        defaultValue: { summary: false },
      }
    },
    confirm: {
      control: 'none',
      description: 'Is passed to <Modal />. Sets the confirm style of the Modal. (only changes font-size to inherit)',
      table: {
        defaultValue: { summary: false },
      }
    },
    maxHeight: {
      control: 'number',
      defaultValue: 320,
      description: 'Is passed to <Modal />. Sets the max height of the children container of Modal.',
      table: {
        defaultValue: { summary: 320 },
      }
    },
    closeIcon: {
      control: 'none',
      description: 'Is passed to <Modal />. Overrides the close icon of the Modal.',
      table: {
        defaultValue: { summary: 'Close icon from @mui' },
      }
    },
    icon: {
      control: 'none',
      description: 'Is passed to <Modal />. Adds an icon to the header of the Modal.',
      table: {
        defaultValue: { summary: 'ReactNode' },
      }
    },
    rootID: {
      control: 'none',
      description: 'Is passed to <Modal />. Sets the rootID of the Modal.',
      table: {
        defaultValue: { summary: 'string' },
      }
    },
  },
} as Meta;

export default meta;

export const Playground: StoryObj = {
  render: (props) => (
    <ModalButton
      {...props}
      renderButton={(open) =>
        <Button
          onClick={open}
          variant='primary'
          label='Open Modal'
        />
      }
    >
      <p>Modal Content</p>
    </ModalButton>
  ),
  args: {
    title: 'Modal Title',
    minimal: false,
    isOpen: false,
    confirm: false,
    maxHeight: 320,
  },
  argTypes: {
    title: {
      control: 'text',
      defaultValue: 'Modal Title',
      table: {
        defaultValue: { summary: 'Modal Title' },
      }
    },
    minimal: {
      control: 'boolean',
      defaultValue: false,
      table: {
        defaultValue: { summary: false },
      }
    },
    isOpen: {
      control: 'boolean',
      defaultValue: false,
      table: {
        defaultValue: { summary: false },
      }
    },
    confirm: {
      control: 'boolean',
      defaultValue: false,
      table: {
        defaultValue: { summary: false },
      }
    },
    maxHeight: {
      control: 'number',
      defaultValue: 320,
      table: {
        defaultValue: { summary: 320 },
      }
    },
  },
};

export const Default: StoryObj = {
  render: () => (
    <ModalButton
      renderButton={(open) =>
        <button onClick={open} type="button">
          Open Modal
        </button>
      }
    >
      <p>Modal Content</p>
    </ModalButton>
  ),
};
