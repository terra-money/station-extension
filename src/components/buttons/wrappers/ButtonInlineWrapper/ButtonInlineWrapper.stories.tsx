import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import ButtonInlineWrapper, { ButtonInlineWrapperProps } from './ButtonInlineWrapper';
import { ReactComponent as TrashCan } from 'assets/icon/TrashCan.svg';
import { ReactComponent as Stake } from 'assets/icon/Stake.svg';
import SubmitButton from '../../submit/SubmitButton/SubmitButton';

const meta: Meta<ButtonInlineWrapperProps> = {
  title: 'Components/Buttons/Wrappers/ButtonInlineWrapper',
  component: ButtonInlineWrapper,
  argTypes: {
    buttons: {
      control: false,
      description: 'Array of buttons',
      table: {
        type: { summary: 'ReactElement[]' },
      }
    },
  },
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

export const CancelWithSubmit: StoryObj<ButtonInlineWrapperProps> = {
  render: () => (
    <ButtonInlineWrapper
      buttons={[
        <SubmitButton variant='secondary' label='Cancel' />, 
        <SubmitButton variant='primary' label='Submit'/> 
      ]}
    />
  ),
};

export const CancelWithDelete: StoryObj<ButtonInlineWrapperProps> = {
  render: () => (
    <ButtonInlineWrapper
    buttons={[
      <SubmitButton variant='secondary' label='Cancel' />, 
      <SubmitButton
          variant='destructive'
          label='Delete'
          icon={<TrashCan fill='var(--token-error-500)' stroke='var(--token-error-500)' />}
          />
    ]}
        />
  ),
};

export const StakeExample: StoryObj<ButtonInlineWrapperProps> = {
  render: () => (
    <ButtonInlineWrapper
      buttons={[
        <SubmitButton variant='secondary' label='Claim Rewards' />,
       <SubmitButton
          variant='primary'
          label='Stake'
          icon={<Stake fill='var(--token-light-white)' />}
        />
    ]}
    />
  ),
};