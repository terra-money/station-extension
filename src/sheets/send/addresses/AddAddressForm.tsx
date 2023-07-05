import React from 'react';

import * as S from './Addresses.styled';
import * as GS from '../../styles';
import { useAddressBook } from 'utils';
import { Button, Input, Text } from 'components';
import { FormProvider, useForm } from 'react-hook-form';
import validate from '../../../utils/tsx/validate';

const AddAddressFormComponent = ({ onClose }) => {
    const { add, validateName } = useAddressBook();

    const form = useForm<AddressBook>({ mode: 'onChange' });
    const { register, watch, setError, handleSubmit, formState } = form;
    const { errors } = formState;
    const { recipient } = watch();

    const submit = (values: AddressBook) => {
        add(values);
        onClose();
    };

    return (
        <>
            <GS.OffsetedContainer>
                <GS.TitleContainer>
                    <Text.Title4>Add an address</Text.Title4>
                </GS.TitleContainer>

                <GS.VerticalStack>
                    <FormProvider {...form}>
                        <Input
                            label="Name"
                            {...register('name', {
                                required: true,
                                validate: {
                                    exists: value => (!validateName(value) ? `${value} already exists` : undefined),
                                },
                            })}
                        />
                        <Input label="Recipient" {...register('recipient', { validate: validate.recipient() })} />
                        <Input
                            label="Memo (optional)"
                            {...register('memo', {
                                validate: {
                                    size: validate.size(256),
                                    bracket: validate.memo(),
                                },
                            })}
                        />
                    </FormProvider>
                </GS.VerticalStack>
            </GS.OffsetedContainer>
            <GS.BottomButtonsWrapper>
                <Button height="46px" text="Add address" onPress={handleSubmit(submit)} />
            </GS.BottomButtonsWrapper>
        </>
    );
};

export const AddAddressForm = React.memo(AddAddressFormComponent);
