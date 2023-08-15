import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import SequentialCTAs, { SequentialCTAsProps } from './SequentialCTAs';
import { ReactComponent as TrashCan } from 'assets/icon/TrashCan.svg';
import { ReactComponent as Stake } from 'assets/icon/Stake.svg';
import SingleCTA from '../Single/SingleCTA';

const meta: Meta<SequentialCTAsProps> = {
  title: 'Components/Buttons/CTA/Sequential Container',
  component: SequentialCTAs,
  argTypes: {
    firstCTA: {
      control: false,
      description: 'The first CTA.',
      table: {
        type: { summary: 'ReactElement' },
      }
    },
    secondCTA: {
      control: false,
      description: 'The second CTA.',
      table: {
        type: { summary: 'ReactElement' },
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

export const CancelWithSubmit: StoryObj<SequentialCTAsProps> = {
  render: () => (
    <SequentialCTAs
      firstCTA={
        <SingleCTA
          color='secondary'
          label='Cancel'
        />
      }
      secondCTA={
        <SingleCTA
          color='primary'
          label='Submit'
        />
      }
    />
  ),
};

export const CancelWithDelete: StoryObj<SequentialCTAsProps> = {
  render: () => (
    <SequentialCTAs
      firstCTA={
        <SingleCTA
          color='secondary'
          label='Cancel'
        />
      }
      secondCTA={
        <SingleCTA
          color='destructive'
          label='Delete'
          icon={<TrashCan fill='var(--token-error-500)' stroke='var(--token-error-500)' />}
        />
      }
    />
  ),
};

export const StakeExample: StoryObj<SequentialCTAsProps> = {
  render: () => (
    <SequentialCTAs
      firstCTA={
        <SingleCTA
          color='secondary'
          label='Claim Rewards'
        />
      }
      secondCTA={
        <SingleCTA
          color='primary'
          label='Stake'
          icon={<Stake fill='var(--token-light-white)' />}
        />
      }
    />
  ),
};