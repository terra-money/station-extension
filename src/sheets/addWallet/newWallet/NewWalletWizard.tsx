import React, { useEffect, useState } from 'react';
import { MnemonicKey } from '@terra-money/feather.js';
import { useRecoilState } from 'recoil';

import { NewWalletForm } from './NewWalletForm';
import { CreatedWallet } from './CreatedWallet';
import { addWallet, createContext, wordsFromAddress } from '../../../utils';
import { userWalletsState } from '../../../state';

interface Props {
    defaultMnemonic?: string;
    beforeCreate: React.ReactNode;
}

export interface Values {
    name: string;
    password: string;
    mnemonic: string;
    index: number;
}

/* context */
interface CreateWallet {
    /* step */
    setStep: (index: number) => void;

    /* form values */
    generated: boolean;
    values: Values;
    setValues: (values: Values) => void;

    /* create wallet */
    createdWallet?: SingleWallet;
    createWallet: (coinType: Bip, index?: number) => void;
    loading?: boolean;
}

const DefaultValues = { name: '', password: '', mnemonic: '', index: 0 };

export const [useCreateWallet, CreateWalletProvider] = createContext<CreateWallet>('useCreateWallet');

const NewWalletWizardComponent = ({ defaultMnemonic = '', beforeCreate }: Props) => {
    const [wallets, setWallets] = useRecoilState(userWalletsState);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    /* form values */
    const initial = { ...DefaultValues, mnemonic: defaultMnemonic };
    const [values, setValues] = useState(initial);

    /* create wallet */
    const [createdWallet, setCreatedWallet] = useState<Wallet>();
    const createWallet = (coinType: Bip, index = 0) => {
        setLoading(true);
        const { name, password, mnemonic } = values;
        const mk330 = new MnemonicKey({ mnemonic, coinType, index });
        const mk118 = new MnemonicKey({ mnemonic, coinType: 118, index });
        const words = {
            '330': wordsFromAddress(mk330.accAddress('terra')),
            '118': wordsFromAddress(mk118.accAddress('terra')),
        };
        const key = {
            '330': mk330.privateKey,
            '118': mk118.privateKey,
        };
        const newWallets = addWallet({ name, password, words, key });
        try {
            setWallets(newWallets);
        } catch (e) {
            console.error(e);
        }

        setCreatedWallet({ name, words });
        setLoading(false);
        setStep(3);
    };

    /* effect: reset memory on unmount */
    useEffect(() => {
        return () => {
            setValues(DefaultValues);
            setCreatedWallet(undefined);
        };
    }, [setValues]);

    /* render */
    const render = () => {
        switch (step) {
            case 1:
                return <NewWalletForm />;

            case 2:
                if (!values.mnemonic) {
                    setStep(1);
                    return null;
                }
                return beforeCreate;

            case 3:
                return <CreatedWallet {...createdWallet} />;
        }
    };

    const generated = !!defaultMnemonic;
    const value = {
        setStep,
        generated,
        values,
        setValues,
        createdWallet,
        createWallet,
        loading,
    };

    return <CreateWalletProvider value={value}>{render()}</CreateWalletProvider>;
};

export const NewWalletWizard = React.memo(NewWalletWizardComponent);
