import React from 'react';
import { useController, UseControllerProps, useFormContext } from 'react-hook-form';
import { TextInputProps } from 'react-native';
import { useTheme } from 'styled-components';

import { Text } from 'components';

import * as S from './Input.styled';

interface InputComponentProps extends TextInputProps, UseControllerProps {
    label?: string;
    marginTop?: string;
    minHeight?: string;
    defaultValue?: string;
    customError?: string;
    actionButtonName?: string;
    actionButtonOnClick?: () => void;
}

const InputComponent = ({
    label,
    marginTop,
    minHeight,
    name,
    rules,
    defaultValue,
    customError,
    actionButtonName,
    actionButtonOnClick,
    ...inputProps
}: InputComponentProps) => {
    const theme = useTheme();

    const formContext = useFormContext();
    const { formState } = formContext;
    const { errors } = formState;

    const { field } = useController({ name, rules, defaultValue });

    if (!formContext || !name) {
        const msg = !formContext ? 'TextInput must be wrapped by the FormProvider' : 'Name must be defined';
        console.error(msg);
        return null;
    }

    return (
        <S.Container marginTop={marginTop}>
            <S.InputHeaderContainer>
                {label && <Text.BodySmallBold color={theme.palette.text.muted}>{label}</Text.BodySmallBold>}
                {actionButtonName && (
                    <S.ActionButtonContainer onPress={actionButtonOnClick}>
                        <Text.BodySmallBold color={theme.palette.text.info}>{actionButtonName}</Text.BodySmallBold>
                    </S.ActionButtonContainer>
                )}
            </S.InputHeaderContainer>
            <S.InputContainer
                placeholderTextColor={theme.palette.text.muted}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                value={field.value}
                {...inputProps}
                minHeight={minHeight}
            />
            {(typeof errors[name]?.message === 'string' || customError) && (
                <S.ErrorMessageContainer>
                    <Text.BodySmallBold color={theme.palette.extra.danger}>
                        {customError || (errors[name]?.message as string)}
                    </Text.BodySmallBold>
                </S.ErrorMessageContainer>
            )}
        </S.Container>
    );
};

export const Input = React.memo(InputComponent);
