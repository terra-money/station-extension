import type { Meta, StoryObj } from '@storybook/react';
import SummaryTable, { SummaryTableProps } from './SummaryTable';

const meta: Meta<SummaryTableProps> = {
  title: 'Components/Cards/Summary/SummaryTable',
  component: SummaryTable,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj<SummaryTableProps> = {
  render: () => {
    return (
      <SummaryTable
        rows={[
          {
            label: 'Label',
            value: 'Value',
          },
          {
            label: 'Label',
            value: 'Value',
          },
          {
            label: 'Label',
            value: 'Value',
          },
        ]}
      />
    )
  },
  argTypes: {},
};
