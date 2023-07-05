import { PropsWithChildren, useEffect, useState } from 'react';
import axios from 'axios';
import { STATION_ASSETS } from 'constants';
import { createContext } from 'utils';
// import { useCustomLCDs } from 'utils/localStorage';
import { useValidNetworks } from 'utils';
// import { combineState } from 'data/query';

type TokenFilter = <T>(network: Record<string, T>) => Record<string, T>;

export const [useNetworks, NetworksProvider] = createContext<{
    networks: InterchainNetworks;
    filterEnabledNetworks: TokenFilter;
    filterDisabledNetworks: TokenFilter;
    networksLoading: boolean;
}>('useNetworks');

export const InitNetworks = ({ children }: PropsWithChildren<{}>) => {
    const [networks, setNetworks] = useState<InterchainNetworks>();
    // const { customLCDs } = useCustomLCDs();
    const { customLCDs } = { customLCDs: [] };

    useEffect(() => {
        const fetchChains = async () => {
            const { data: chains } = await axios.get<InterchainNetworks>('/chains.json', {
                baseURL: STATION_ASSETS,
            });
            setNetworks(chains);
        };

        fetchChains();
    }, []);

    const testBase = networks
        ? Object.values({
              ...networks.mainnet,
              ...networks.testnet,
              ...networks.classic,
          }).map(chain => {
              const lcd = customLCDs[chain.chainID] ?? chain.lcd;
              return { ...chain, lcd };
          })
        : [];

    const validationResult = useValidNetworks(testBase);

    const validNetworks = validationResult.reduce((acc, { data }) => (data ? [...acc, data] : acc), [] as string[]);

    const validationState = {};

    if (!networks) {
        return null;
    }

    return (
        <NetworksProvider
            value={{
                networks,
                networksLoading: validationState.isLoading,
                filterEnabledNetworks: networks =>
                    Object.fromEntries(
                        Object.entries(networks).filter(
                            ([chainID]) => chainID === 'localterra' || validNetworks.includes(chainID),
                        ),
                    ),
                filterDisabledNetworks: networks =>
                    Object.fromEntries(
                        Object.entries(networks).filter(([chainID]) => !validNetworks.includes(chainID)),
                    ),
            }}>
            {children}
        </NetworksProvider>
    );
};
