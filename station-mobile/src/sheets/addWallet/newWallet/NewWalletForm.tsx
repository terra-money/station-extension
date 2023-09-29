import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button, Checkbox, Input, WarningAlert } from 'components';

import * as GS from '../../styles';
import { useCreateWallet, Values as DefaultValues } from './NewWalletWizard';
import { validate } from 'utils';

interface Values extends DefaultValues {
    confirm: string;
    checked?: boolean;
}

const NewWalletFormComponent = () => {
    const { setStep, generated, values, setValues, loading } = useCreateWallet();
    const [mnemonicIsWritten, setMnemonicIsWritten] = useState<boolean>(false);

    const form = useForm<Values>({
        mode: 'onSubmit',
        defaultValues: { ...values, confirm: '', checked: false },
    });

    const { register, watch, handleSubmit, formState, reset } = form;

    const { isValid } = formState;

    const { password, mnemonic } = watch();

    useEffect(() => {
        return () => reset();
    }, [reset]);

    const submit = ({ name, password, mnemonic, index }: Values) => {
        setValues({ name, password, mnemonic: mnemonic.trim(), index });
        setStep(2);
    };

    const isDisabled = generated ? isValid : !(mnemonicIsWritten && isValid);

    return (
        <>
            <GS.OffsetedContainer>
                <GS.VerticalStack>
                    <FormProvider {...form}>
                        <Input
                            {...register('name', { validate: validate.name })}
                            label="Wallet name"
                            placeholder="my-wallet"
                            name="name"
                        />
                        <Input
                            {...register('password', { validate: validate.password })}
                            label="Password"
                            secureTextEntry
                            placeholder="*********"
                            name="password"
                        />
                        <Input
                            {...register('confirm', {
                                validate: confirm => validate.confirm(password, confirm),
                            })}
                            label="Confirm password"
                            secureTextEntry
                            placeholder="*********"
                            name="confirm"
                        />
                        <Input
                            {...register('mnemonic', { validate: validate.mnemonic })}
                            label="Mnemonic seed"
                            editable={!generated}
                            defaultValue={mnemonic}
                            multiline
                            name="mnemonic"
                        />
                        {generated && (
                            <WarningAlert text="Never share the mnemonic with others or enter it in unverified sites" />
                        )}
                        {generated && (
                            <Checkbox
                                isChecked={mnemonicIsWritten}
                                onPress={() => setMnemonicIsWritten(!mnemonicIsWritten)}
                                text="I have written down the mnemonic"
                            />
                        )}
                    </FormProvider>
                </GS.VerticalStack>
            </GS.OffsetedContainer>
            <GS.BottomButtonsWrapper>
                <Button
                    loading={loading}
                    disabled={isDisabled}
                    active={!isDisabled}
                    marginTop="auto"
                    height="48px"
                    text="Submit"
                    onPress={handleSubmit(submit)}
                />
            </GS.BottomButtonsWrapper>
        </>
    );
};

export const NewWalletForm = React.memo(NewWalletFormComponent);
