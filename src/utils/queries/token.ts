import { readDenom } from '@terra-money/terra-utils';
import { ASSETS } from '../../constants';
import { useNetworkName } from '../hooks';
import { useWhitelist } from './chains';
import { useCustomTokensCW20 } from '../settings/CustomTokens';

/* helpers */
export const getIcon = (path: string) => `${ASSETS}/icon/svg/${path}`;

export const useNativeDenoms = () => {
    const { whitelist, ibcDenoms, legacyWhitelist } = useWhitelist();
    const { list: cw20 } = useCustomTokensCW20();
    const networkName = useNetworkName();

    function readNativeDenom(denom: Denom): TokenItem {
        const fixedDenom = denom.startsWith('ibc/') ? `${readDenom(denom).substring(0, 5)}...` : readDenom(denom);

        // native token
        if (whitelist[networkName]?.[denom]) {
            return whitelist[networkName]?.[denom];
        }

        // ibc token
        const ibcToken = ibcDenoms[networkName]?.[denom]?.token;

        if (ibcToken && whitelist[networkName][ibcToken]) {
            return {
                ...whitelist[networkName][ibcToken],
                // @ts-expect-error
                chains: [ibcDenoms[networkName][denom].chain],
            };
        }

        return (
            legacyWhitelist[denom] ??
            cw20.find(({ token }) => denom === token) ??
            // that's needed for axl tokens
            Object.values(whitelist[networkName]).find(t => t.token === denom) ?? {
                // default token icon
                token: denom,
                symbol: fixedDenom,
                name: fixedDenom,
                icon: denom.startsWith('ibc/')
                    ? 'https://assets.terra.money/icon/svg/IBC.svg'
                    : 'https://assets.terra.money/icon/svg/Terra.svg',
                decimals: 6,
            }
        );
    }

    return readNativeDenom;
};
