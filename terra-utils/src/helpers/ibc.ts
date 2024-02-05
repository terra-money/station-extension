import { AccAddress } from "@terra-money/feather.js";
import { getChains } from "../actions/network";

export function getICS20(to: string, from: string, token: AccAddress) {
  const networks = getChains();
  const channels = networks[from]?.ics20Channels?.[to];
  return (
    // ics20 channel specific for this token
    channels?.find(({ tokens }) => !!tokens?.find((t) => t === token)) ||
    // default ics channel for the chain
    channels?.find(({ tokens }) => !tokens)
  );
}

export const getIBCChannel = ({
  from,
  to,
  tokenAddress,
  icsChannel,
}: {
  from: string;
  to: string;
  tokenAddress: AccAddress;
  icsChannel?: string;
}): string | undefined => {
  const networks = getChains();
  const isCW20 = AccAddress.validate(tokenAddress);

  if (isCW20) {
    return getICS20(to, from, tokenAddress)?.channel;
  }

  if (
    icsChannel &&
    (networks[to]?.ics20Channels?.[from]?.find(
      ({ channel }) => channel === icsChannel
    ) ||
      networks[to]?.icsChannels?.[from]?.channel === icsChannel)
  ) {
    return (
      networks[to]?.ics20Channels?.[from]?.find(
        ({ channel }) => channel === icsChannel
      )?.otherChannel || networks[to]?.icsChannels?.[from]?.otherChannel
    );
  }

  return networks[from]?.channels?.[to];
};

export const  getICSContract = ({
  from,
  to,
  tokenAddress,
}: {
  from: string
  to: string
  tokenAddress: AccAddress
}): string | undefined => {
  return getICS20(to, from, tokenAddress)?.contract
}