import type { StoryObj, Meta } from '@storybook/react';
import Modal, { ModalProps } from './Modal';
// import { FormItem, Input } from 'components/Form Components';
import { InputWrapper } from 'components/form helpers/wrappers/InputWrapper/InputWrapper';
import { Input } from 'components/inputs';
import { SubmitButton } from 'components';

import styles from './Modal.module.scss';

const meta: Meta<ModalProps> = {
  title: 'Components/Feedback/Modals/Modal',
  component: Modal,
  argTypes: {
    title: {
      control: 'text',
      defaultValue: 'Modal Title',
      description: 'Sets the title of the Modal.',
      table: {
        defaultValue: { summary: 'Modal Title' },
      }
    },
    footer: {
      control: 'none',
      description: 'Sets the footer of the Modal. Should be a Button. (only LatestTx.tsx used)',
      table: {
        defaultValue: { summary: '() => ReactNode' },
      }
    },
    onRequestClose: {
      control: 'none',
      description: 'Sets what should happen when the Modal is closed.',
      table: {
        defaultValue: { summary: '() => void' },
      }
    },
    confirm: {
      control: 'boolean',
      defaultValue: false,
      description: 'Sets the confirm style of the Modal. (only changes font-size to inherit)',
      table: {
        defaultValue: { summary: false },
      }
    },
    minimal: {
      control: 'boolean',
      defaultValue: false,
      description: 'Sets the minimal style of the Modal. (changes width to fit-content and padding to 0px)',
      table: {
        defaultValue: { summary: false },
      }
    },
    maxHeight: {
      control: 'number',
      defaultValue: 320,
      description: 'Sets the max height of the children container of Modal.',
      table: {
        defaultValue: { summary: 320 },
      }
    },
    closeIcon: {
      control: 'none',
      description: 'Sets the close icon of the Modal.',
      table: {
        defaultValue: { summary: 'Close icon from @mui' },
      }
    },
    icon: {
      control: 'none',
      description: 'Adds an icon to the header of the Modal.',
      table: {
        defaultValue: { summary: 'ReactNode' },
      }
    },
    rootID: {
      control: 'none',
      description: 'Sets the root ID of the Modal.',
      table: {
        defaultValue: { summary: 'station' },
      }
    },
  },
} as Meta;

export default meta;

export const Playground: StoryObj = {
  render: (props) => (
    <Modal
      {...props}
      isOpen={true}
      onRequestClose={() => { }}
    >
      <p>Modal Content</p>
    </Modal>
  ),
  args: {
    title: 'Modal Title',
    confirm: false,
    minimal: false,
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
  },
};

export const Default: StoryObj = {
  render: () => (
    <Modal
      title="Modal Title"
      isOpen={true}
      onRequestClose={() => { }}
    >
      <InputWrapper
        label={'This is a label'}
      >
        <Input
          inputMode='text'
          placeholder={'am placeholder'}
        />
      </InputWrapper>

      <SubmitButton
        variant='primary'
        onClick={() => { }}
        label={'Submit'}
        className={styles.button__override}
      />
    </Modal>
  ),
  argTypes: {
    title: { control: 'none' },
    confirm: { control: 'none' },
    minimal: { control: 'none' },
    maxHeight: { control: 'none' },
  },
};

export const Confirm: StoryObj = {
  render: () => (
    <Modal
      title="Modal Title"
      isOpen={true}
      onRequestClose={() => { }}
      confirm
    >
      <InputWrapper
        label={'This is a label'}
      >
        <Input
          inputMode='text'
          placeholder={'am placeholder'}
        />
      </InputWrapper>

      <SubmitButton
        variant='primary'
        onClick={() => { }}
        label={'Submit'}
      />
    </Modal>
  ),
  argTypes: {
    title: { control: 'none' },
    confirm: { control: 'none' },
    minimal: { control: 'none' },
    maxHeight: { control: 'none' },
  },
};

export const Minimal: StoryObj = {
  render: () => (
    <Modal
      title="Modal Title"
      isOpen={true}
      onRequestClose={() => { }}
      minimal
    >
      <InputWrapper
        label={'This is a label'}
      >
        <Input
          inputMode='text'
          placeholder={'am placeholder'}
        />
      </InputWrapper>
      <SubmitButton
        variant='primary'
        onClick={() => { }}
        label='Submit'
      />
    </Modal>
  ),
  argTypes: {
    title: { control: 'none' },
    confirm: { control: 'none' },
    minimal: { control: 'none' },
    maxHeight: { control: 'none' },
  },
};

export const Footer: StoryObj = {
  render: () => (
    <Modal
      title="Modal Title"
      isOpen={true}
      onRequestClose={() => { }}
      footer={(close) => (
        <SubmitButton
          variant='primary'
          onClick={close}
          label='Submit'
        />
      )}
    >
      <InputWrapper
        label={'This is a label'}
      >
        <Input
          inputMode='text'
          placeholder={'am placeholder'}
        />
      </InputWrapper>
    </Modal>
  ),
  argTypes: {
    title: { control: 'none' },
    confirm: { control: 'none' },
    minimal: { control: 'none' },
    maxHeight: { control: 'none' },
    footer: { control: 'none' },
  },
};
