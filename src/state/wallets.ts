import { atom } from 'recoil';

export const userWalletsState = atom({ key: 'userWallets', default: [] });

export const currentWalletState = atom({ key: 'currentWallet', default: undefined });
