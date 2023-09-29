import is from './is';
import encrypt from './encrypt';
import decrypt from './decrypt';
import { storage } from './storage';
import { addressFromWords, wordsFromAddress } from './bench32';
import { useRecoilState } from 'recoil';
import { userWalletsState } from 'store';

type AddWalletParams = {
    words: { '330': string; '118'?: string };
    password: string;
    key: { '330': Buffer; '118'?: Buffer };
    name: string;
};

const storeWallets = (wallets: StoredWallet[]) => {
    storage.set('keys', JSON.stringify(wallets));
};

export const deleteWallet = (name: string) => {
    const wallets = getStoredWallets();
    const next = wallets.filter(wallet => wallet.name !== name);
    storeWallets(next);
};

export const getStoredWallets = () => {
    const keys = storage.getString('userWallets') ?? '[]';
    return JSON.parse(keys) as ResultStoredWallet[];
};

// export const getWallet = () => {
//     const user = localStorage.getItem('user');
//     if (!user) {
//         return;
//     }
//     const parsed = JSON.parse(user) as ResultStoredWallet;

//     if ('address' in parsed) {
//         clearWallet();
//         return;
//     }

//     return parsed;
// };

export const getStoredWallet = (name: string): ResultStoredWallet => {
    const wallets = getStoredWallets();
    const wallet = wallets.find(wallet => wallet.name === name);

    if (!wallet) {
        throw new Error('Wallet does not exist');
    }
    return wallet;
};

interface Key {
    '330': string;
    '118'?: string;
}

export const getDecryptedKey = ({ name, password }: Params): Key | undefined => {
    const wallet = getStoredWallet(name);

    try {
        if ('encrypted' in wallet) {
            if (typeof wallet.encrypted === 'string') {
                return {
                    '330': decrypt(wallet.encrypted, password),
                };
            } else {
                return {
                    '330': decrypt(wallet.encrypted['330'], password),
                    // 118 is not available for old wallets
                    '118': wallet.encrypted['118'] && decrypt(wallet.encrypted['118'], password),
                };
            }
        } else if ('wallet' in wallet) {
            // legacy
            const { privateKey: key } = JSON.parse(decrypt(wallet.wallet, password));
            return { '330': key as string };
        } else {
            return;
        }
    } catch {
        throw new PasswordError('Incorrect password');
    }
};

interface ChangePasswordParams {
    name: string;
    oldPassword: string;
    newPassword: string;
}

export const changePassword = (params: ChangePasswordParams) => {
    const { name, oldPassword, newPassword } = params;
    testPassword({ name, password: oldPassword });
    const key = getDecryptedKey({ name, password: oldPassword });
    if (!key) {
        throw new Error('Key does not exist, cannot change password');
    }
    const encrypted = {
        '330': encrypt(key['330'], newPassword),
        '118': key['118'] && encrypt(key['118'], newPassword),
    };
    const wallets = getStoredWallets();
    const next = wallets.map(wallet => {
        if (wallet.name === name) {
            if ('address' in wallet) {
                const { address } = wallet;
                return {
                    name,
                    words: {
                        '330': wordsFromAddress(address),
                    },
                    encrypted,
                };
            } else {
                const { words } = wallet;
                return { name, words, encrypted };
            }
        }
        return wallet;
    });

    storeWallets(next);
};

interface Params {
    name: string;
    password: string;
}

export class PasswordError extends Error {}
export const testPassword = (params: Params) => {
    if (!getDecryptedKey(params)?.[330]) {
        throw new PasswordError('Incorrect password');
    }
    return true;
};
