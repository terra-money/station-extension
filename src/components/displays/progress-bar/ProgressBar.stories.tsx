import type { Meta, StoryObj } from '@storybook/react';
import ProgressBar, { ProgressBarProps } from './ProgressBar';

const meta: Meta<ProgressBarProps> = {
  title: 'Components/Displays/Progress Bar',
  component: ProgressBar,
  argTypes: {},
} as Meta;

export default meta;

export const ThresholdNotMet: StoryObj<ProgressBarProps> = {
  render: (args) => <ProgressBar {...args} />,
  args: {
    data: [
      { type: 'yes', percent: '5%' },
      { type: 'abstain', percent: '10%' },
      { type: 'no', percent: '2%' },
      { type: 'noWithVeto', percent: '0.5%' },
    ],
    threshold: 50,
  },
};

export const PassThresholdMet: StoryObj<ProgressBarProps> = {
  render: (args) => <ProgressBar {...args} />,
  args: {
    data: [
      { type: 'yes', percent: '25%' },
      { type: 'abstain', percent: '10%' },
      { type: 'no', percent: '2%' },
      { type: 'noWithVeto', percent: '0.5%' },
    ],
    threshold: 20,
  },
};

export const SinglePassThreshold: StoryObj<ProgressBarProps> = {
  render: (args) => <ProgressBar {...args} />,
  args: {
    data: [
      { type: 'yes', percent: '20%' },
      { type: 'abstain', percent: '0%' },
      { type: 'no', percent: '0%' },
      { type: 'noWithVeto', percent: '0%' },
    ],
    threshold: 20,
  },
};

export const Empty: StoryObj<ProgressBarProps> = {
  render: (args) => <ProgressBar {...args} />,
  args: {
    data: [
      { type: 'yes', percent: '0%' },
      { type: 'abstain', percent: '0%' },
      { type: 'no', percent: '0%' },
      { type: 'noWithVeto', percent: '0%' },
    ],
    threshold: 3.5,
  },
};

export const OnLeftEdge: StoryObj<ProgressBarProps> = {
  render: (args) => <ProgressBar {...args} />,
  args: {
    data: [
      { type: 'yes', percent: '0%' },
      { type: 'abstain', percent: '0%' },
      { type: 'no', percent: '0%' },
      { type: 'noWithVeto', percent: '0%' },
    ],
    threshold: 1,
  },
};

export const OnRightEdge: StoryObj<ProgressBarProps> = {
  render: (args) => <ProgressBar {...args} />,
  args: {
    data: [
      { type: 'yes', percent: '0%' },
      { type: 'abstain', percent: '0%' },
      { type: 'no', percent: '0%' },
      { type: 'noWithVeto', percent: '0%' },
    ],
    threshold: 99,
  },
};

export const Small: StoryObj<ProgressBarProps> = {
  render: (args) => <ProgressBar {...args} />,
  args: {
    data: [
      { type: 'yes', percent: '5%' },
      { type: 'abstain', percent: '10%' },
      { type: 'no', percent: '2%' },
      { type: 'noWithVeto', percent: '0.5%' },
    ],
    threshold: 50,
    isSmall: true,
    labelOverride: 'PT'
  },
};
