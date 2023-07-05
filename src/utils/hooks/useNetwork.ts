import { useRecoilState, useRecoilValue } from 'recoil';
// import { walletState } from './useAuth';
import { WalletStatus } from '@terra-money/wallet-types';
import { currentNetworkState, currentWalletState } from 'store';
import { is } from 'utils';
// import { useCustomLCDs } from 'utils/localStorage';
import { useNetworks } from '../../components/InitNetworks';

export const useNetworkState = () => {
    const [storedNetwork, setNetwork] = useRecoilState(currentNetworkState);

    const changeNetwork = (network: NetworkName) => {
        if (network !== storedNetwork) {
            setNetwork(network);
        }
    };

    return [storedNetwork, changeNetwork] as const;
};

/* helpers */
export const useNetworkOptions = () => {
    return [
        { value: 'mainnet', label: 'Mainnets' },
        { value: 'testnet', label: 'Testnets' },
        { value: 'classic', label: 'Terra Classic' },
        { value: 'localterra', label: 'LocalTerra' },
    ];
};

export const useNetwork = (): Record<ChainID, InterchainNetwork> => {
    const { networks, filterEnabledNetworks } = useNetworks();
    const [network, setNetwork] = useNetworkState();
    const wallet = useRecoilValue(currentWalletState);
    const connectedWallet = useRecoilState(currentWalletState);
    const { customLCDs } = { customLCDs: [] };

    function withCustomLCDs(networks: Record<ChainID, InterchainNetwork>) {
        return Object.fromEntries(
            Object.entries(networks).map(([key, val]) => [key, { ...val, lcd: customLCDs[val.chainID] || val.lcd }]),
        );
    }

    if (wallet && !wallet?.words?.['118']) {
        const chains330 = Object.values(
            withCustomLCDs(networks[network as NetworkName] as Record<ChainID, InterchainNetwork>),
        ).filter(({ coinType }) => coinType === '330');
        return filterEnabledNetworks(
            chains330.reduce((acc, chain) => {
                acc[chain.chainID] = chain;
                return acc;
            }, {} as Record<ChainID, InterchainNetwork>),
        );
    }

    return filterEnabledNetworks(withCustomLCDs(networks[network as NetworkName]));

    setNetwork('mainnet');
    return filterEnabledNetworks(['phoenix-1', 'pisco-1'] as Record<ChainID, InterchainNetwork>);

    console.log('connectedWallet', connectedWallet);

    // check connected wallet
    if (connectedWallet.status === WalletStatus.WALLET_CONNECTED) {
        if (network !== 'mainnet' && 'phoenix-1' in connectedWallet.network) {
            setNetwork('mainnet');
        } else if (network !== 'testnet' && 'pisco-1' in connectedWallet.network) {
            setNetwork('testnet');
        } else if (network !== 'classic' && 'columbus-5' in connectedWallet.network) {
            setNetwork('classic');
        } else if (network !== 'localterra' && 'localterra' in connectedWallet.network) {
            setNetwork('localterra');
        }

        return filterEnabledNetworks(connectedWallet.network as Record<ChainID, InterchainNetwork>);
    }

    // multisig wallet are supported only on terra
    // if (is.multisig(wallet)) {
    //     const terra = Object.values(
    //         withCustomLCDs(networks[network as NetworkName] as Record<ChainID, InterchainNetwork>),
    //     ).find(({ prefix }) => prefix === 'terra');
    //     if (!terra) {
    //         return {};
    //     }
    //     return filterEnabledNetworks({ [terra.chainID]: terra });
    // }

    if (wallet && !wallet?.words?.['118']) {
        const chains330 = Object.values(
            withCustomLCDs(networks[network as NetworkName] as Record<ChainID, InterchainNetwork>),
        ).filter(({ coinType }) => coinType === '330');

        return filterEnabledNetworks(
            chains330.reduce((acc, chain) => {
                acc[chain.chainID] = chain;
                return acc;
            }, {} as Record<ChainID, InterchainNetwork>),
        );
    }

    return filterEnabledNetworks(withCustomLCDs(networks[network as NetworkName]));
};

export const useNetworkName = () => {
    const network = useRecoilValue(currentNetworkState);
    return network;
};

export const useChainID = () => {
    const network = useRecoilValue(currentNetworkState);
    switch (network) {
        case 'mainnet':
            return 'phoenix-1';
        case 'testnet':
            return 'pisco-1';
        case 'classic':
            return 'columbus-5';
        case 'localterra':
            return 'localterra';
    }

    return '';
};
