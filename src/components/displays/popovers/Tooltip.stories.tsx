import type { Meta, StoryObj } from '@storybook/react';
import { TippyProps } from "@tippyjs/react";
import Tooltip from './Tooltip';
import styles from "./example.module.scss";

const meta: Meta<TippyProps> = {
  title: 'Components/Displays/Tooltip',
  component: Tooltip,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj<TippyProps> = {
  render: () => {
    return (
      <div style={{ height: "50px", display: "flex", alignItems: "flex-end" }}>
        <Tooltip content={<div>Tooltip</div>}>
          <div>Hover me</div>
        </Tooltip>
      </div>
    );
  }
};

export const ChainsBoxExample: StoryObj<TippyProps> = {
  render: () => {
    const chains = [{name: "terra",  img: "https://station-assets.terra.dev/img/chains/Terra.svg", balance: '100' }, { balance: '320' , name: "axelar", img: "https://station-assets.terra.dev/img/chains/Axelar.svg"}];

    return (
      <div style={{ height: "100px", marginLeft: "50px", display: "flex", alignItems: "flex-end" }}>
        <Tooltip
          className={styles.tooltip}
          placement='top'
          content={
            <div className={styles.chains__list}>
              {chains.map((c, index) => (
                <div key={index} className={styles.container}>
                  <img src={c.img} alt={c.name} />
                  <div className={styles.text__container}>
                    <span className={styles.chain}>{c.name}</span>
                    <span className={styles.balance}>{c.balance}</span>
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <span className={styles.chain__details}>{chains.length}</span>
        </Tooltip>
      </div>
    );
  }
};