import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useAuth } from 'utils';
import { Input, Button } from 'components';
import * as GS from '../../styles';
import * as S from './ChangePassword.styled';
import { WalletManagementHeader } from '../Header';

interface Values {
    current: string;
    password: string;
    confirm: string;
}

const ChangePasswordComponent = ({ route }) => {
    const {
        params: { wallet },
    } = route;

    const { getConnectedWallet, validatePassword, changePassword } = useAuth();

    /* form */
    const form = useForm<Values>({ mode: 'onSubmit' });
    const { register, watch, handleSubmit } = form;
    const { password } = watch();

    const [done, setDone] = useState(false);

    const submit = ({ current, password }: Values) => {
        const { name } = getConnectedWallet();
        changePassword({ name, oldPassword: current, newPassword: password });
        setDone(true);
    };

    return (
        <GS.ContentContainer>
            <GS.OffsetedContainer>
                <WalletManagementHeader header={'Change Password'} wallet={wallet} />
                <S.FormContainer>
                    <FormProvider {...form}>
                        <Input
                            {...register('current', { validate: validatePassword })}
                            label="Current Password"
                            secureTextEntry
                            placeholder="*********"
                            name="current"
                        />
                        <Input
                            {...register('password')}
                            label="New Password"
                            secureTextEntry
                            placeholder="*********"
                            name="password"
                        />
                        <Input
                            {...register('confirm')}
                            label="Confirm New Password"
                            secureTextEntry
                            placeholder="*********"
                            name="confirm"
                        />
                    </FormProvider>
                </S.FormContainer>
            </GS.OffsetedContainer>
            <GS.BottomButtonsWrapper>
                <Button height="48px" marginTop="auto" text="Submit" onPress={handleSubmit(submit)} />
            </GS.BottomButtonsWrapper>
        </GS.ContentContainer>
    );
};

export const ChangePassword = React.memo(ChangePasswordComponent);
