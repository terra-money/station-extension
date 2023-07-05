import { atom } from 'recoil';
import { persistAtom } from 'utils';

export const userWalletsState = atom({ key: 'userWallets', default: [], effects: [persistAtom('userWallets')] });

export const currentWalletState = atom({
    key: 'currentWallet',
    default: undefined,
    effects: [persistAtom('currentWallet')],
});
