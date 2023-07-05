import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import * as GS from '../../styles';
import * as S from './DeleteWallet.styled';
import { WalletManagementHeader } from '../Header';
import { useAuth } from 'utils';
import { Input, Button, WarningAlert } from 'components';
import { useRecoilState } from 'recoil';
import { openedSheetState } from 'store';

interface Values {
    name: string;
}

const DeleteWalletComponent = ({ route }) => {
    const {
        params: { wallet },
    } = route;

    const [, setOpenedSheet] = useRecoilState(openedSheetState);
    const { deleteWallet } = useAuth();

    const form = useForm<Values>({ mode: 'onChange' });
    const { register, handleSubmit, formState } = form;
    const { isValid } = formState;

    const submit = (values: Values) => {
        if (values.name !== wallet.name) {
            return;
        }

        deleteWallet(wallet.name);
        setOpenedSheet('');
    };

    return (
        <GS.ContentContainer>
            <GS.OffsetedContainer>
                <WalletManagementHeader header={'Delete Wallet'} wallet={wallet} />
                <FormProvider {...form}>
                    <Input
                        {...register('name', { validate: value => value === wallet.name })}
                        label={`Type "${wallet.name}" to confirm`}
                        name="name"
                    />
                </FormProvider>
                <S.WarningContainer>
                    <WarningAlert
                        text="This action cannot be undone. Mnemonic
is required to recover a deleted wallet."
                    />
                </S.WarningContainer>
            </GS.OffsetedContainer>
            <GS.BottomButtonsWrapper>
                <Button
                    marginTop="auto"
                    active={isValid}
                    disabled={!isValid}
                    height="48px"
                    text="Submit"
                    onPress={handleSubmit(submit)}
                />
            </GS.BottomButtonsWrapper>
        </GS.ContentContainer>
    );
};

export const DeleteWallet = React.memo(DeleteWalletComponent);
