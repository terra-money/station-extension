import type { StoryObj, Meta } from '@storybook/react'
import LedgerModal, { LedgerModalProps } from './LedgerModal'
// import { FormItem, Input } from 'components/Form Components';
import { InputWrapper } from 'components/form helpers/wrappers/InputWrapper/InputWrapper'
import { Input } from 'components/inputs'
import { SubmitButton } from 'components'

import styles from './Modal.module.scss'

const meta: Meta<LedgerModalProps> = {
  title: 'Components/Ledger/LedgerModal',
  component: LedgerModal,
  argTypes: {
    device: {
      options: ['nanox', 'nanos', 'nanosp'],
      defaultValue: 'nanox',
      control: { type: 'radio' },
      description: 'Model of the device that should be shown in the animation.',
    },
    action: {
      options: ['connect', 'unlock', 'openApp', 'confirm'],
      defaultValue: 'connect',
      control: { type: 'radio' },
      description: 'Action that the user should perform on the device.',
    },
    appName: {
      control: 'text',
      defaultValue: 'Terra',
      description:
        'Name of the app that the user should use to perform the action on the device.',
    },
  },
} as Meta

export default meta

export const Playground: StoryObj = {
  render: (props: any) => <LedgerModal {...props} />,
  args: {
    appName: 'Terra',
    action: 'connect',
  },
  argTypes: {},
}
