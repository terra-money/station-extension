import { atom } from 'recoil';
import { persistAtom } from 'utils';

export const currentNetworkState = atom({
    key: 'currentNetwork',
    default: 'mainnet',
    effects: [persistAtom('currentNetwork')],
});
