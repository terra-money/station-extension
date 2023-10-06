import type { Meta, StoryObj } from '@storybook/react';
import VotingSummary, { VotingSummaryProps } from './VotingSummary';

const meta: Meta<VotingSummaryProps> = {
  title: 'Components/Displays/Voting Summary/Stories',
  component: VotingSummary,
  argTypes: {},
} as Meta;

export default meta;

export const ThresholdMet: StoryObj<VotingSummaryProps> = {
  render: (args) => <VotingSummary {...args} />,
  args: {
    data: [
      { type: 'yes', percent: '50%', amount: '32,562,000' },
      { type: 'abstain', percent: '10%', amount: '2,000,000' },
      { type: 'no', percent: '2.5%', amount: '500,000' },
      { type: 'noWithVeto', percent: '0.5%', amount: '100,000' },
    ],
    threshold: 50,
  },
};

export const ThresholdNotMet: StoryObj<VotingSummaryProps> = {
  render: (args) => <VotingSummary {...args} />,
  args: {
    data: [
      { type: 'yes', percent: '5%', amount: '1,062,000' },
      { type: 'abstain', percent: '10%', amount: '2,000,000' },
      { type: 'no', percent: '2.5%', amount: '500,000' },
      { type: 'noWithVeto', percent: '0.5%', amount: '100,000' },
    ],
    threshold: 50,
  },
};

export const NoVotes: StoryObj<VotingSummaryProps> = {
  render: (args) => <VotingSummary {...args} />,
  args: {
    data: [
      { type: 'yes', percent: '0.00%', amount: '0' },
      { type: 'abstain', percent: '0.00%', amount: '0' },
      { type: 'no', percent: '0.00%', amount: '0' },
      { type: 'noWithVeto', percent: '0.00%', amount: '0' },
    ],
    threshold: 25,
  },
};
