import type { Meta, StoryObj } from '@storybook/react';
import ActivityListItemDashboard, { ActivityListItemDashboardProps } from './ActivityListItemDashboard';
import { Pill, TransactionTracker } from 'components';

const meta: Meta = {
  title: 'Dashboard/List Items/Activity/Stories',
  component: ActivityListItemDashboard,
} as Meta;

export default meta;

export const WithTracker: StoryObj<ActivityListItemDashboardProps> = {
  render: () => {
    return (
      <ActivityListItemDashboard
        variant={"success"}
        chain={{ icon: "https://station-assets.terra.dev/img/chains/Terra.svg", label: "Terra" }}
        msg={
          <>
            Sent <span>420.00 LUNA</span> to <span>terra1...20k38v</span>
          </>
        }
        type={"Execute Contract"}
        time='18 Oct 2023 • 17:22 UTC'
        secondaryPill={<Pill variant={"warning"} text={"Pending"} />}
        progressTracker={
          <TransactionTracker
            steps={["completed", "incomplete", "incomplete"]}
            stepLabels={["Terra", "Osmosis", "Osmosis"]}
          />
        }
      />
    )
  },
  argTypes: {},
};

export const WithoutTracker: StoryObj<ActivityListItemDashboardProps> = {
  render: () => {
    return (
      <ActivityListItemDashboard
        variant={"success"}
        chain={{ icon: "https://station-assets.terra.dev/img/chains/Terra.svg", label: "Terra" }}
        msg={
          <>
            Sent <span>420.00 LUNA</span> to <span>terra1...20k38v</span>
          </>
        }
        type={"Execute Contract"}
        time='18 Oct 2023 • 17:22 UTC'
      />
    )
  },
  argTypes: {},
};