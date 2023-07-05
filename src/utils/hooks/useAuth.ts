import { useCallback, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { encode } from 'js-base64';
import { PasswordError } from '../keystore';
import { getDecryptedKey, testPassword } from '../keystore';
import { getStoredWallet, getStoredWallets } from '../keystore';
import encrypt from '../encrypt';
import { addressFromWords, wordsFromAddress } from '../bench32';
import { currentWalletState, userWalletsState } from 'store';
import { is } from 'utils';

type AddWalletParams = {
    words: { '330': string; '118'?: string };
    password: string;
    key: { '330': Buffer; '118'?: Buffer };
    name: string;
};

interface ChangePasswordParams {
    name: string;
    oldPassword: string;
    newPassword: string;
}

export const useAuth = () => {
    const [wallet, setWallet] = useRecoilState(currentWalletState);
    const [userWallets, setUserWallets] = useRecoilState(userWalletsState);

    /* connected */
    const connectedWallet = useMemo(() => {
        // if (!is.local(wallet)) {
        //     return;
        // }
        return wallet;
    }, [wallet]);

    const getConnectedWallet = useCallback(() => {
        if (!connectedWallet) {
            throw new Error('Wallet is not defined');
        }
        return connectedWallet;
    }, [connectedWallet]);

    /* helpers */
    const getKey = (password: string) => {
        const { name } = getConnectedWallet();
        return getDecryptedKey({ name, password });
    };

    const connect = useCallback(
        (name: string) => {
            const storedWallet = getStoredWallet(name);
            if ('address' in storedWallet) {
                const { address, lock } = storedWallet;
                const words = {
                    '330': wordsFromAddress(address),
                };

                if (lock) {
                    throw new Error('Wallet is locked');
                }
                const wallet = { name, words };
                setWallet(wallet as any);
            } else {
                const { lock } = storedWallet;
                if (lock) {
                    throw new Error('Wallet is locked');
                }
                setWallet(storedWallet as any);
            }
        },
        [setWallet],
    );

    /* manage: export */
    // TODO: export both 119 and 330 key
    const encodeEncryptedWallet = (password: string) => {
        const { name, words } = getConnectedWallet();
        const key = getKey(password);
        if (!key) {
            throw new PasswordError('Key do not exist');
        }
        const data = {
            name,
            address: addressFromWords(words['330'], 'terra'),
            encrypted_key: encrypt(key['330'], password),
        };
        return encode(JSON.stringify(data));
    };

    /* form */
    const validatePassword = (password: string) => {
        try {
            const { name } = getConnectedWallet();
            return testPassword({ name, password });
        } catch (error) {
            return 'Incorrect password';
        }
    };

    /* delete wallet */
    const deleteWallet = (name: string) => {
        const wallets = getStoredWallets();
        const next = wallets.filter(wallet => wallet.name !== name);
        setUserWallets(next);
        if (name === wallet.name && next.length) {
            setWallet(next[0]);
        }
        if (!next.length) {
            setWallet(null);
        }
    };

    const addWallet = (params: AddWalletParams) => {
        if (userWallets.find(wallet => wallet.name === params.name)) {
            throw new Error('Wallet already exists');
        }

        const next = userWallets.filter(wallet =>
            'words' in wallet
                ? wallet.words['330'] !== params.words['330']
                : wallet.address !== addressFromWords(params.words['330']),
        );

        if (is.multisig(params) || is.ledger(params)) {
            const newWallets = [...next, params];
            setUserWallets(newWallets);
        } else {
            const { name, password, words, key } = params;
            const encrypted = {
                '330': encrypt(key['330'].toString('hex'), password),
                '118': key['118'] && encrypt(key['118'].toString('hex'), password),
            };
            const newWallet = { name, words, encrypted };
            const newWallets = [...next, newWallet];
            setUserWallets(newWallets);
            setWallet(newWallet);
            return newWallets;
        }
    };

    const changePassword = (params: ChangePasswordParams) => {
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

        setUserWallets(next);
    };

    return {
        encodeEncryptedWallet,
        validatePassword,
        connect,
        deleteWallet,
        addWallet,
        changePassword,
        wallet,
        connectedWallet,
    };
};
