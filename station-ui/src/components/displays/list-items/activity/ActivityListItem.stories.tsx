import type { Meta, StoryObj } from "@storybook/react";
import ActivityListItem, { ActivityListItemProps } from "./ActivityListItem";
import { Pill, TransactionTracker } from "components";

const meta: Meta<ActivityListItemProps> = {
  title: "Components/List Items/Activity/Stories",
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
        msgCount={1}
      />
    )
  },
  argTypes: {},
};

export const SuccessfulNoImage: StoryObj<ActivityListItemProps> = {
  render: () => {
    return (
      <ActivityListItem
        variant={"success"}
        chain={{ icon: "https://station-assets.terra.dev/img/chains/T.svg", label: "Terra" }}
        msg={
          <div>
            Sent <span>420.00 LUNA</span> to <span>terra1...20k38v</span>
          </div>
        }
        type={"Execute Contract"}
        msgCount={1}
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

export const NoStatusIcon: StoryObj<ActivityListItemProps> = {
  render: () => {
    return (
      <ActivityListItem
        chain={{ icon: "https://station-assets.terra.dev/img/chains/Terra.svg", label: "Terra" }}
        msg={
          <div>
            Sent <span>420.00 LUNA</span> to <span>terra1...20k38v</span>
          </div>
        }
        type={"Execute Contract"}
        msgCount={3}
      />
    )
  },
  argTypes: {},
};

export const SecondaryPill: StoryObj<ActivityListItemProps> = {
  render: () => {
    return (
      <ActivityListItem
        variant={"loading"}
        chain={{ icon: "https://station-assets.terra.dev/img/chains/Terra.svg", label: "Terra" }}
        msg={
          <div>
            Sent <span>420.00 LUNA</span> to <span>terra1...20k38v</span>
          </div>
        }
        type={"Execute Contract"}
        msgCount={1}
        secondaryPill={<Pill variant={"warning"} text={"Pending"} />}
      />
    )
  },
  argTypes: {},
};

export const WithTransactionTracker: StoryObj<ActivityListItemProps> = {
  render: () => {
    return (
      <ActivityListItem
        variant={"loading"}
        chain={{ icon: "https://station-assets.terra.dev/img/chains/Terra.svg", label: "Terra" }}
        msg={
          <div>
            Sent <span>420.00 LUNA</span> to <span>terra1...20k38v</span>
          </div>
        }
        type={"Execute Contract"}
        msgCount={1}
        secondaryPill={<Pill variant={"warning"} text={"Pending"} />}
        progressTracker={
          <TransactionTracker
            steps={["completed", "incomplete", "incomplete"]}
            stepLabels={["Terra", "Osmosis", "Something"]}
          />
        }
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
            Swapped <span>1,500 axlUSDC</span> for <span style={{color: "var(--token-success-500)"}}>3,422.65 LUNA</span> on <span>TFM</span>
          </div>
        }
        type={"Delegate"}
        msgCount={8}
        hasTimeline={true}
      />
    )
  },
  argTypes: {},
};
