import type { Meta, StoryObj } from '@storybook/react';
import SummaryHeader, { SummaryHeaderProps } from './SummaryHeader';

const meta: Meta<SummaryHeaderProps> = {
  title: 'Components/Headers/Summary/Stories',
  component: SummaryHeader,
  argTypes: {},
} as Meta;

export default meta;

export const SuccessWithSummaryCard: StoryObj<SummaryHeaderProps> = {
  render: () => {
    return (
      <SummaryHeader
        statusLabel={"Success!"}
        statusMessage={"The wallet was created"}
        status={"success"}
        summaryTitle={"my-wallet"}
        summaryValue={"terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp"}
      />
    );
  },
};

export const ErrorWithSummaryCard: StoryObj<SummaryHeaderProps> = {
  render: () => {
    return (
      <SummaryHeader
        statusLabel={"Error"}
        statusMessage={"oh no! something went wrong"}
        status={"alert"}
        summaryTitle={"Am ERROR"}
        summaryValue={"Error message goes here, preferably very descriptive to avoid confusion."}
      />
    );
  },
};

export const WarningWithoutSummaryCard: StoryObj<SummaryHeaderProps> = {
  render: () => {
    return (
      <SummaryHeader
        statusLabel={"Delete Address"}
        statusMessage={"Are you sure you want to remove this address from your address book?"}
        status={"warning"}
      />
    );
  },
};

export const WithoutSummaryCard: StoryObj<SummaryHeaderProps> = {
  render: () => {
    return (
      <SummaryHeader
        statusLabel={"Error"}
        statusMessage={"oh no! something went wrong"}
        status={"alert"}
      />
    );
  },
};
