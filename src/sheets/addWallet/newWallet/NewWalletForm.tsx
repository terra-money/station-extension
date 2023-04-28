import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button, Checkbox, Input, Text, WarningAlert } from '../../../components';

import * as GS from '../../styles';
import * as S from './NewWallet.styled';
import { useCreateWallet, Values as DefaultValues } from './NewWalletWizard';

interface Values extends DefaultValues {
    confirm: string;
    checked?: boolean;
}

const NewWalletFormComponent = () => {
    const { setStep, generated, values, setValues, loading } = useCreateWallet();
    const [mnemonicIsWritten, setMnemonicIsWritten] = useState<boolean>(false);

    const form = useForm<Values>({
        mode: 'onChange',
        defaultValues: { ...values, confirm: '', checked: false },
    });

    const { register, watch, handleSubmit, formState, reset } = form;

    const { password, mnemonic, index, checked } = watch();

    console.log('mnemonic', mnemonic);

    useEffect(() => {
        return () => reset();
    }, [reset]);

    const submit = ({ name, password, mnemonic, index }: Values) => {
        setValues({ name, password, mnemonic: mnemonic.trim(), index });
        setStep(2);
    };

    return (
        <>
            <GS.VerticalStack>
                <FormProvider {...form}>
                    <Input label="Wallet name" placeholder="my-wallet" name="name" />
                    <Input label="Password" secureTextEntry placeholder="*********" name="password" />
                    <Input label="Confirm password" secureTextEntry placeholder="*********" name="confirm" />
                    <Input label="Mnemonic seed" editable={false} defaultValue={mnemonic} multiline name="mnemonic" />
                    <WarningAlert text="Never share the mnemonic with others or enter it in unverified sites" />
                    <Checkbox
                        isChecked={mnemonicIsWritten}
                        onPress={() => setMnemonicIsWritten(!mnemonicIsWritten)}
                        text="I have written down the mnemonic"
                    />
                </FormProvider>
            </GS.VerticalStack>
            <Button
                loading={loading}
                disabled={!mnemonicIsWritten}
                active={mnemonicIsWritten}
                marginTop="auto"
                height="48px"
                text="Submit"
                onPress={handleSubmit(submit)}
            />
        </>
    );
};

export const NewWalletForm = React.memo(NewWalletFormComponent);
