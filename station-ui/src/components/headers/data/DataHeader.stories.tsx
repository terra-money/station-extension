import type { Meta, StoryObj } from '@storybook/react';
import { ReactComponent as StakeIcon } from 'assets/icon/Stake.svg';
import DataHeader, { DataHeaderProps } from './DataHeader';
import { Button } from 'components';

const meta: Meta<DataHeaderProps> = {
  title: 'Components/Headers/Data/Stories',
  component: DataHeader,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj<DataHeaderProps> = {
  render: () => {
    return (
      <DataHeader
        primaryLabel={"My Delegations"}
        primaryValue={"$2,899.28"}
        secondaryLabel={"Available Rewards"}
        secondaryValue={"$33.84"}
        tertiaryLabel={"Undelegations"}
        tertiaryValue={"0"}
        actionButtons={
          <>
            <Button variant='secondary' onClick={() => { }}>Claim Rewards</Button>
            <Button
              variant='primary'
              onClick={() => { }}
              icon={<StakeIcon fill="var(--token-light-white)" />}
            >
              Stake
            </Button>
          </>
        }
      />
    );
  },
};
