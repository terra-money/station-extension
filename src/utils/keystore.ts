import is from './is';
import encrypt from './encrypt';
import { storage } from './storage';
import { addressFromWords } from './bench32';

type AddWalletParams = {
    words: { '330': string; '118'?: string };
    password: string;
    key: { '330': Buffer; '118'?: Buffer };
    name: string;
};

const storeWallets = (wallets: StoredWallet[]) => {
    storage.set('keys', JSON.stringify(wallets));
};

export const getStoredWallets = () => {
    const keys = storage.getString('keys') ?? '[]';
    return JSON.parse(keys) as ResultStoredWallet[];
};

export const addWallet = (params: AddWalletParams) => {
    const wallets = getStoredWallets();

    if (wallets.find(wallet => wallet.name === params.name)) throw new Error('Wallet already exists');

    const next = wallets.filter(wallet =>
        'words' in wallet
            ? wallet.words['330'] !== params.words['330']
            : wallet.address !== addressFromWords(params.words['330']),
    );

    if (is.multisig(params) || is.ledger(params)) {
        const newWallets = [...next, params];
        storeWallets(newWallets);
    } else {
        const { name, password, words, key } = params;
        const encrypted = {
            '330': encrypt(key['330'].toString('hex'), password),
            '118': key['118'] && encrypt(key['118'].toString('hex'), password),
        };
        const newWallets = [...next, { name, words, encrypted }];
        storeWallets(newWallets);
        return newWallets;
    }
};
