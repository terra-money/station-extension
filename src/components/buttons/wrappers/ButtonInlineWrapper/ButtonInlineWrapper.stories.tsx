import type { Meta, StoryObj } from '@storybook/react';
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
} as Meta;

export default meta;

export const CancelWithSubmit: StoryObj<ButtonInlineWrapperProps> = {
  render: () => (
    <ButtonInlineWrapper>
        <SubmitButton variant='secondary' label='Cancel' />,
        <SubmitButton variant='primary' label='Submit'/>
      </ButtonInlineWrapper>
  ),
};

export const CancelWithDelete: StoryObj<ButtonInlineWrapperProps> = {
  render: () => (
    <ButtonInlineWrapper>
        <SubmitButton variant='secondary' label='Cancel' />,
        <SubmitButton
          variant='warning'
          label='Delete'
          icon={<TrashCan fill='var(--token-error-500)' stroke='var(--token-error-500)' />}/>
        </ButtonInlineWrapper>
  ),
};

export const StakeExample: StoryObj<ButtonInlineWrapperProps> = {
  render: () => (
    <ButtonInlineWrapper>
        <SubmitButton variant='secondary' label='Claim Rewards' />,
        <SubmitButton
          variant='primary'
          label='Stake'
          icon={<Stake fill='var(--token-light-white)' />}
        />
        </ButtonInlineWrapper>
  ),
};
