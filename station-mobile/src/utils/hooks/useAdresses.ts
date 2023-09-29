import { addressFromWords } from 'utils';
import { useAuth } from './useAuth';
import { useChainID } from 'utils';
import { useNetwork } from 'utils';
import { useNetworks } from '../../components/InitNetworks';
import { useRecoilValue } from 'recoil';
import { currentWalletState } from 'store';

/* auth | walle-provider */
const useAddress = () => {
    const connected = useRecoilValue(currentWalletState);
    const { wallet } = useAuth();
    const chainID = useChainID();
    if (connected?.addresses[chainID]) {
        return connected?.addresses[chainID];
    }
    return wallet?.words?.['330'] ? addressFromWords(wallet.words['330']) : undefined;
};
export const useAllInterchainAddresses = () => {
    const connected = useRecoilValue(currentWalletState);
    if (connected?.addresses) {
        return connected.addresses;
    }
};

export const useInterchainAddresses = () => {
    const connected = useRecoilValue(currentWalletState);

    const { filterEnabledNetworks } = useNetworks();
    const { wallet } = useAuth();
    const networks = useNetwork();
    console.log('networks', networks);

    if (connected?.addresses) {
        return filterEnabledNetworks(connected.addresses);
    }

    const words = wallet?.words;
    console.log('wordswords', words);
    if (!words) {
        return;
    }

    const addresses = Object.values(networks).reduce((acc, { prefix, coinType, chainID }) => {
        acc[chainID] = addressFromWords(words[coinType] as string, prefix);
        return acc;
    }, {} as Record<string, string>);
    return addresses;
};

export default useAddress;
