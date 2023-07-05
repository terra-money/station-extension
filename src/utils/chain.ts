import { AccAddress } from '@terra-money/feather.js';

export const isNativeToken = (denom: string) =>
    !denom.startsWith('ibc/') && !denom.startsWith('factory/') && !AccAddress.validate(denom);
