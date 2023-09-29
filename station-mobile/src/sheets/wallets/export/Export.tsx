import React, { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import * as S from './Export.styled';
import * as GS from '../../styles';
import { WalletManagementHeader } from '../Header';
import { Button, Input, WarningAlert } from 'components';

import { QRCodeExport } from './QrCode';
import { PrivateKeyExport } from './PrivateKey';

import { useAuth } from 'utils';

interface Values {
    password: string;
}

const ExportComponent = ({ route }) => {
    const {
        params: { wallet },
    } = route;

    const { validatePassword, encodeEncryptedWallet } = useAuth();

    const form = useForm<Values>({
        mode: 'onSubmit',
        defaultValues: { password: '' },
    });

    const { register, handleSubmit } = form;

    /* submit */
    const [encoded, setEncoded] = useState<string>();

    const submit = ({ password }: Values) => {
        const encoded = encodeEncryptedWallet(password);

        setEncoded(encoded);
    };

    useEffect(() => {
        return () => {
            form.reset();
            setEncoded(undefined);
        };
    }, [form]);

    const [mode, setMode] = useState<'qrcode' | 'privateKey'>('qrcode');

    const headerText = useMemo(() => {
        if (!encoded) {
            return 'Export wallet';
        }
        if (mode === 'qrcode') {
            return 'QR code';
        }
        return 'Private Key';
    }, [mode, encoded]);

    return (
        <GS.ContentContainer>
            <GS.OffsetedContainer contentContainerStyle={{ display: 'flex', alignItems: 'center' }}>
                <WalletManagementHeader header={headerText} wallet={wallet} />
                <S.ButtonsContainer>
                    <Button active={mode === 'qrcode'} width="auto" text="QR Code" onPress={() => setMode('qrcode')} />
                    <Button
                        active={mode === 'privateKey'}
                        width="auto"
                        text="Private key"
                        onPress={() => setMode('privateKey')}
                    />
                </S.ButtonsContainer>
                {!encoded && (
                    <FormProvider {...form}>
                        <Input
                            {...register('password', { validate: validatePassword })}
                            label="Password"
                            secureTextEntry
                            placeholder="*********"
                            name="password"
                        />
                    </FormProvider>
                )}
                {encoded ? (
                    mode === 'qrcode' ? (
                        <QRCodeExport encoded={encoded} />
                    ) : (
                        <PrivateKeyExport encoded={encoded} />
                    )
                ) : null}
                <S.WarningContainer>{encoded && <WarningAlert text="Keep this private" />}</S.WarningContainer>
            </GS.OffsetedContainer>
            <GS.BottomButtonsWrapper>
                {!encoded && (
                    <S.SubmitButtonContainer>
                        <Button height="48px" onPress={handleSubmit(submit)} text="Submit" />
                    </S.SubmitButtonContainer>
                )}
            </GS.BottomButtonsWrapper>
        </GS.ContentContainer>
    );
};

export const ExportWallet = React.memo(ExportComponent);
