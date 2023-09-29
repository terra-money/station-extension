import type { Meta, StoryObj } from '@storybook/react';
import ProgressTracker, { ProgressTrackerProps } from './ProgressTracker';

const meta: Meta<ProgressTrackerProps> = {
  title: 'Components/Displays/Progress Tracker',
  component: ProgressTracker,
  argTypes: {},
} as Meta;

export default meta;

export const WithLabels: StoryObj<ProgressTrackerProps> = {
  render: () => (
    <ProgressTracker
      steps={['completed', 'completed', 'failed']}
      stepLabels={['Step 1', 'Asset bridged', 'Step 3']}
    />
  ),
};

export const FirstInProgress: StoryObj<ProgressTrackerProps> = {
  render: () => (
    <ProgressTracker steps={['inProgress', 'incomplete', 'incomplete']} />
  ),
};

export const FirstCompleted: StoryObj<ProgressTrackerProps> = {
  render: () => (
    <ProgressTracker steps={['completed', 'incomplete', 'incomplete']} />
  ),
};

export const SecondInProgress: StoryObj<ProgressTrackerProps> = {
  render: () => (
    <ProgressTracker steps={['completed', 'inProgress', 'incomplete']} />
  ),
};

export const SecondCompleted: StoryObj<ProgressTrackerProps> = {
  render: () => (
    <ProgressTracker steps={['completed', 'completed', 'incomplete']} />
  ),
};

export const ThirdInProgress: StoryObj<ProgressTrackerProps> = {
  render: () => (
    <ProgressTracker steps={['completed', 'completed', 'inProgress']} />
  ),
};

export const AllCompleted: StoryObj<ProgressTrackerProps> = {
  render: () => (
    <ProgressTracker steps={['completed', 'completed', 'completed']} />
  ),
};

export const FirstFailed: StoryObj<ProgressTrackerProps> = {
  render: () => (
    <ProgressTracker steps={['failed', 'incomplete', 'incomplete']} />
  ),
};

export const SecondFailed: StoryObj<ProgressTrackerProps> = {
  render: () => (
    <ProgressTracker steps={['completed', 'failed', 'incomplete']} />
  ),
};

export const ThirdFailed: StoryObj<ProgressTrackerProps> = {
  render: () => (
    <ProgressTracker steps={['completed', 'completed', 'failed']} />
  ),
};
