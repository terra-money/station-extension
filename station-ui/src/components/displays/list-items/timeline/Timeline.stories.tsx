import type { Meta, StoryObj } from '@storybook/react';
import Timeline, { TimelineProps } from './Timeline';

const meta: Meta<TimelineProps> = {
  title: 'Components/List Items/Timeline/Stories',
  component: Timeline,
  argTypes: {},
} as Meta;

export default meta;

export const TransactionPageExample: StoryObj<TimelineProps> = {
  render: () => {
    return (
      <Timeline
        startItem={{
          chain: { icon: "https://station-assets.terra.dev/img/chains/Axelar.svg", label: "Axelar" },
          coin: {icon: "https://station-assets.terra.dev/img/coins/axlUSDC.svg", label: "axlUSDC" },
          msg: "1,500 axlUSDC",
        }}
        middleItems={[
          {
            variant: 'success',
            msg: (
              <div>Transfer <span>axlUSDC</span> from <span>Axelar</span> to <span>Terra</span></div>
            ),
            warningPillText: 'Requires Additional Tx'
          },
          {
            variant: 'success',
            msg: (
              <div>Swap <span>axlUSDC</span> for <span>LUNA</span> on <span>TFM</span></div>
            )
          },
        ]}
        endItem={{
          chain: { icon: "https://station-assets.terra.dev/img/chains/Terra.svg", label: "Terra" },
          coin: {icon: "https://station-assets.terra.dev/img/coins/Luna.svg", label: "LUNA" },
          msg: "3,422.65 LUNA",
        }}
      />
    )
  },
};

export const StartItem: StoryObj<TimelineProps> = {
  render: () => {
    return (
      <Timeline
        startItem={{
          chain: { icon: "https://station-assets.terra.dev/img/chains/Axelar.svg", label: "Axelar" },
          coin: {icon: "https://station-assets.terra.dev/img/coins/axlUSDC.svg", label: "axlUSDC" },
          msg: "1,500 axlUSDC",
        }}
      />
    )
  },
  argTypes: {},
};

export const MiddleItemDefault: StoryObj<TimelineProps> = {
  render: () => {
    return (
      <Timeline
        middleItems={[
          {
            variant: 'default',
            msg: (
              <div>
                Transfer <span>axlUSDC</span> from <span>Axelar</span> to <span>Terra</span>
              </div>
            ),
          },
        ]}
      />
    )
  },
};

export const MiddleItemSuccess: StoryObj<TimelineProps> = {
  render: () => {
    return (
      <Timeline
        middleItems={[
          {
            variant: 'success',
            msg: (
              <div>
                Transfer <span>axlUSDC</span> from <span>Axelar</span> to <span>Terra</span>
              </div>
            ),
          },
        ]}
      />
    )
  },
};

export const MiddleItemWarning: StoryObj<TimelineProps> = {
  render: () => {
    return (
      <Timeline
        middleItems={[
          {
            variant: 'warning',
            msg: (
              <div>
                Transfer <span>axlUSDC</span> from <span>Axelar</span> to <span>Terra</span>
              </div>
            ),
          },
        ]}
      />
    )
  },
};

export const MiddleItemWithPill: StoryObj<TimelineProps> = {
  render: () => {
    return (
      <Timeline
        middleItems={[
          {
            variant: 'default',
            msg: (
              <div>
                Transfer <span>axlUSDC</span> from <span>Axelar</span> to <span>Terra</span>
              </div>
            ),
            warningPillText: 'Requires Additional Tx'
          },
        ]}
      />
    )
  },
};

export const EndItem: StoryObj<TimelineProps> = {
  render: () => {
    return (
      <Timeline
        endItem={{
          chain: { icon: "https://station-assets.terra.dev/img/chains/Terra.svg", label: "Terra" },
          coin: {icon: "https://station-assets.terra.dev/img/coins/Luna.svg", label: "LUNA" },
          msg: "3,422.65 LUNA",
        }}
      />
    )
  },
  argTypes: {},
};
