import type { Meta, StoryObj } from '@storybook/react';
import Timeline, { TimelineProps } from './Timeline';
import { ActivityListItem } from '..';
import { Button } from 'components';

const meta: Meta<TimelineProps> = {
  title: 'Components/List Items/Timeline/Stories',
  component: Timeline,
  argTypes: {},
} as Meta;

export default meta;

export const StartItemOverriddenWithShowMore: StoryObj<TimelineProps> = {
  render: () => {
    return (
      <Timeline
        startOverride={
          <ActivityListItem
            variant={"success"}
            chain={{ icon: "https://station-assets.terra.dev/img/chains/Axelar.svg", label: "Axelar" }}
            msg={
              <div>
                Sent <span>420.00 axlUSDC</span> to <span>terra1...20k38v</span>
              </div>
            }
            type={"Execute Contract"}
            msgCount={6}
            hasTimeline
          />
        }
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
          {
            variant: 'success',
            msg: (
              <div>Swap <span>axlUSDC</span> for <span>LUNA</span> on <span>TFM</span></div>
            )
          },
          {
            variant: 'warning',
            msg: (
              <div>Swapping <span>axlUSDC</span> for <span>LUNA</span> on <span>Terra</span></div>
            ),
            warningPillText: 'Transaction Required',
            transactionButton:<Button variant='primary' label='Confirm Transaction' onClick={() => console.log('clicked')} />,
          },
          {
            variant: 'success',
            msg: (
              <div>Swap <span>axlUSDC</span> for <span>LUNA</span> on <span>TFM</span></div>
            )
          },
          {
            variant: 'success',
            msg: (
              <div>Swap <span>axlUSDC</span> for <span>LUNA</span> on <span>TFM</span></div>
            )
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

export const TransactionsRequiredExample: StoryObj<TimelineProps> = {
  render: () => {
    return (
      <Timeline
        startItem={{
          chain: { icon: "https://station-assets.terra.dev/img/chains/Osmosis.svg", label: "Osmosis" },
          coin: {icon: "https://station-assets.terra.dev/img/coins/axlUSDC.svg", label: "axlUSDC" },
          msg: "1,500 axlUSDC",
        }}
        middleItems={[
          {
            variant: 'success',
            msg: (
              <div>Transfer <span>axlUSDC</span> from <span>Osmosis</span> to <span>Terra</span></div>
            ),
          },
          {
            variant: 'warning',
            msg: (
              <div>Swapping <span>axlUSDC</span> for <span>LUNA</span> on <span>Terra</span></div>
            ),
            warningPillText: 'Transaction Required',
            transactionButton:<Button variant='primary' label='Confirm Transaction' onClick={() => console.log('clicked')} />,

          },
          {
            variant: 'warning',
            msg: (
              <div>Swapping <span>axlUSDC</span> for <span>LUNA</span> on <span>Terra</span></div>
            ),
            warningPillText: 'Transaction Required',
            transactionButton:<Button variant='primary' label='Confirm Transaction' onClick={() => console.log('clicked')} />,
            disabled: true
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

export const ThreeMiddleItemsExample: StoryObj<TimelineProps> = {
  render: () => {
    return (
      <Timeline
        middleItems={[
          {
            variant: 'success',
            msg: (
              <div>Transfer <span>axlUSDC</span> from <span>Osmosis</span> to <span>Terra</span></div>
            ),
          },
          {
            variant: 'warning',
            msg: (
              <div>Swapping <span>axlUSDC</span> for <span>LUNA</span> on <span>Terra</span></div>
            ),
            warningPillText: 'Transaction Required',
          },
          {
            variant: 'warning',
            msg: (
              <div>Swapping <span>axlUSDC</span> for <span>LUNA</span> on <span>Terra</span></div>
            ),
            warningPillText: 'Transaction Required',
          },
        ]}
      />
    )
  },
};

export const ThreeMiddleItemsExampleForceShowAll: StoryObj<TimelineProps> = {
  render: () => {
    return (
      <Timeline
        middleItems={[
          {
            variant: 'success',
            msg: (
              <div>Transfer <span>axlUSDC</span> from <span>Osmosis</span> to <span>Terra</span></div>
            ),
          },
          {
            variant: 'warning',
            msg: (
              <div>Swapping <span>axlUSDC</span> for <span>LUNA</span> on <span>Terra</span></div>
            ),
            warningPillText: 'Transaction Required',
          },
          {
            variant: 'warning',
            msg: (
              <div>Swapping <span>axlUSDC</span> for <span>LUNA</span> on <span>Terra</span></div>
            ),
            warningPillText: 'Transaction Required',
          },
        ]}
        forceShowAll
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

export const MiddleItemWithButton: StoryObj<TimelineProps> = {
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
            warningPillText: 'Transaction Required',
            transactionButton:<Button variant='primary' label='Confirm Transaction' onClick={() => console.log('clicked')} />,

          },
        ]}
      />
    )
  },
};

export const MiddleItemWithButtonDisabled: StoryObj<TimelineProps> = {
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
            warningPillText: 'Transaction Required',
            transactionButton:<Button variant='primary' label='Confirm Transaction' onClick={() => console.log('clicked')} />,
            disabled: true
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
