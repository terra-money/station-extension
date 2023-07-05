import React, { useState } from 'react';
import { decode } from 'js-base64';
import { Button, Checkbox, ContainerWithLoader, Input, Text, WarningAlert } from 'components';

import * as GS from '../../styles';
import { FormProvider, useForm } from 'react-hook-form';
import { useAuth, wordsFromAddress } from 'utils';
import decrypt from '../../../utils/decrypt';
import { CreatedWallet } from '../newWallet/CreatedWallet';
import { Alert } from 'react-native';

interface Values {
    key: string;
    password: string;
}

const ImportWalletFormComponent = ({ privateKey = '' }: { privateKey?: string }) => {
    /* form */
    const form = useForm<Values>({ mode: 'onChange' });

    const { connect, addWallet } = useAuth();

    const { handleSubmit, formState } = form;
    const { errors, isValid } = formState;

    const [error, setError] = useState<Error>();
    const [importedWallet, setImportedWallet] = useState();

    /* submit */
    const submit = ({ key, password }: Values) => {
        try {
            interface Decoded {
                name: string;
                address: string;
                encrypted_key: string;
            }

            const { name, address, encrypted_key }: Decoded = JSON.parse(decode(key));

            const pk = decrypt(encrypted_key, password);

            if (!pk) {
                throw new Error('Incorrect password');
            }
            const wallet = {
                name,
                password,
                words: {
                    '330': wordsFromAddress(address),
                },
                key: { '330': Buffer.from(pk, 'hex') },
            };

            addWallet(wallet);
            connect(name);
            setImportedWallet(wallet);
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    if (importedWallet) {
        return (
            <>
                <GS.TitleContainer>
                    <Text.Title4>Recover Wallet</Text.Title4>
                </GS.TitleContainer>
                <CreatedWallet
                    text="Wallet recovered successfully"
                    name={importedWallet.name}
                    words={importedWallet.words}
                />
            </>
        );
    }

    return (
        <>
            <GS.OffsetedContainer>
                <GS.TitleContainer>
                    <Text.Title4>Recover Wallet</Text.Title4>
                </GS.TitleContainer>
                <GS.VerticalStack>
                    <FormProvider {...form}>
                        <Input
                            minHeight="90px"
                            name="key"
                            label="Key"
                            customError={errors.key?.message}
                            defaultValue={privateKey}
                            editable={!privateKey}
                            multiline
                        />
                        <Input
                            label="Password"
                            name="password"
                            secureTextEntry
                            customError={errors.key?.message || error}
                            placeholder="*********"
                        />
                    </FormProvider>
                </GS.VerticalStack>
            </GS.OffsetedContainer>
            <GS.BottomButtonsWrapper>
                <Button marginTop="auto" height="48px" text="Submit" onPress={handleSubmit(submit)} />
            </GS.BottomButtonsWrapper>
        </>
    );
};

export const ImportWalletForm = React.memo(ImportWalletFormComponent);
