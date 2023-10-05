import type { Meta, StoryObj } from '@storybook/react';
import SummaryColumn, { SummaryColumnProps } from './SummaryColumn';

const meta: Meta<SummaryColumnProps> = {
  title: 'Components/Cards/Summary/SummaryColumn',
  component: SummaryColumn,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj<SummaryColumnProps> = {
  render: () => {
    return (
      <SummaryColumn
        title="Summary Card"
        description="terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp"
      />
    )
  },
  argTypes: {},
};

export const WithExtra: StoryObj<SummaryColumnProps> = {
  render: () => {
    return (
      <SummaryColumn
        title="Summary Card"
        extra={"extra"}
        description="terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp"
      />
    )
  },
  argTypes: {},
};

