import type { Meta, StoryObj } from '@storybook/react';
import StatusBoxes, { StatusBoxesProps } from './StatusBoxes';

const meta: Meta = {
  title: 'Dashboard/StatusBoxes/Stories',
  component: StatusBoxes,
} as Meta;

export default meta;

export const Horizontal: StoryObj<StatusBoxesProps> = {
  render: () =>
    <StatusBoxes
      totalAssets={1539.17}
      stackedAssets={1344.62}
      claimableRewards={38.93}
    />,
};

export const Vertical: StoryObj<StatusBoxesProps> = {
  render: () =>
    <StatusBoxes
      totalAssets={1539.17}
      stackedAssets={1344.62}
      claimableRewards={38.93}
      isVertical
    />,
};