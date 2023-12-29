import type { Meta, StoryObj } from "@storybook/react"
import TransactionTracker, { TransactionTrackerProps } from "./TransactionTracker"

const meta: Meta<TransactionTrackerProps> = {
  title: "Components/Displays/Transaction Tracker/Stories",
  component: TransactionTracker,
  argTypes: {},
} as Meta

export default meta

export const WithLabels: StoryObj<TransactionTrackerProps> = {
  render: () => (
    <TransactionTracker
      steps={["completed", "completed", "failed"]}
      stepLabels={["Step 1", "Asset bridged", "Step 3"]}
    />
  ),
}

export const FirstInProgress: StoryObj<TransactionTrackerProps> = {
  render: () => (
    <TransactionTracker steps={["inProgress", "incomplete", "incomplete"]} />
  ),
}

export const FirstCompleted: StoryObj<TransactionTrackerProps> = {
  render: () => (
    <TransactionTracker steps={["completed", "incomplete", "incomplete"]} />
  ),
}

export const SecondInProgress: StoryObj<TransactionTrackerProps> = {
  render: () => (
    <TransactionTracker steps={["completed", "inProgress", "incomplete"]} />
  ),
}

export const SecondCompleted: StoryObj<TransactionTrackerProps> = {
  render: () => (
    <TransactionTracker steps={["completed", "completed", "incomplete"]} />
  ),
}

export const ThirdInProgress: StoryObj<TransactionTrackerProps> = {
  render: () => (
    <TransactionTracker steps={["completed", "completed", "inProgress"]} />
  ),
}

export const AllCompleted: StoryObj<TransactionTrackerProps> = {
  render: () => (
    <TransactionTracker steps={["completed", "completed", "completed"]} />
  ),
}

export const FirstFailed: StoryObj<TransactionTrackerProps> = {
  render: () => (
    <TransactionTracker steps={["failed", "incomplete", "incomplete"]} />
  ),
}

export const SecondFailed: StoryObj<TransactionTrackerProps> = {
  render: () => (
    <TransactionTracker steps={["completed", "failed", "incomplete"]} />
  ),
}

export const ThirdFailed: StoryObj<TransactionTrackerProps> = {
  render: () => (
    <TransactionTracker steps={["completed", "completed", "failed"]} />
  ),
}
