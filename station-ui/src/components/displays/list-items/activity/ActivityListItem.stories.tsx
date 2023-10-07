import type { Meta, StoryObj } from '@storybook/react';
import ActivityListItem, { ActivityListItemProps } from './ActivityListItem';

const meta: Meta<ActivityListItemProps> = {
  title: 'Components/List Items/Activity/Stories',
  component: ActivityListItem,
  argTypes: {},
} as Meta;

export default meta;

export const Successful: StoryObj<ActivityListItemProps> = {
  render: () => {
    return (
      <ActivityListItem
        variant={"success"}
        chain={{ icon: "https://station-assets.terra.dev/img/chains/Terra.svg", label: "Terra" }}
        msg={
          <div>
            Sent <span>420.00 LUNA</span> to <span>terra1...20k38v</span>
          </div>
        }
        type={"Execute Contract"}
        time={"2 minutes ago"}
      />
    )
  },
  argTypes: {},
};

export const Failed: StoryObj<ActivityListItemProps> = {
  render: () => {
    return (
      <ActivityListItem
        variant={"failed"}
        chain={{ icon: "https://station-assets.terra.dev/img/chains/Terra.svg", label: "Terra" }}
        msg={
          <div>
            Sent <span>420.00 LUNA</span> to <span>terra1...20k38v</span>
          </div>
        }
        type={"Failed Transaction"}
        time={"2 minutes ago"}
      />
    )
  },
  argTypes: {},
};

export const Loading: StoryObj<ActivityListItemProps> = {
  render: () => {
    return (
      <ActivityListItem
        variant={"loading"}
        chain={{ icon: "https://station-assets.terra.dev/img/chains/Terra.svg", label: "Terra" }}
        msg={
          <div>
            Delegated <span>420.00 LUNA</span> to <span>Orbital Command</span>
          </div>
        }
        type={"Delegate"}
        time={"1 day ago"}
      />
    )
  },
  argTypes: {},
};

export const Timeline: StoryObj<ActivityListItemProps> = {
  render: () => {
    return (
      <ActivityListItem
        variant={"success"}
        chain={{ icon: "https://station-assets.terra.dev/img/chains/Terra.svg", label: "Terra" }}
        msg={
          <div>
            Delegated <span>420.00 LUNA</span> to <span>Orbital Command</span>
          </div>
        }
        type={"Delegate"}
        time={"1 day ago"}
        timelineMessages={[
          <div>
            Delegated <span>420.00 LUNA</span> to <span>Orbital Command</span>
          </div>,
          <div>
            Delegated <span>420.00 LUNA</span> to <span>Orbital Command</span>
          </div>,
          <div>
            Delegated <span>420.00 LUNA</span> to <span>Orbital Command</span>
          </div>,
        ]}
      />
    )
  },
  argTypes: {},
};
