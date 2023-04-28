import React from 'react';
import { useController, UseControllerProps, useFormContext } from 'react-hook-form';
import { TextInputProps } from 'react-native';
import { useTheme } from 'styled-components';

import { Text } from '../texts';

import * as S from './Input.styled';

interface InputComponentProps extends TextInputProps, UseControllerProps {
    label?: string;
    marginTop?: string;
    minHeight?: string;
    defaultValue?: string;
}

const InputComponent = ({
    label,
    marginTop,
    minHeight,
    name,
    rules,
    defaultValue,
    ...inputProps
}: InputComponentProps) => {
    const theme = useTheme();

    const formContext = useFormContext();
    const { formState } = formContext;

    // if (!formContext || !name) {
    //     const msg = !formContext ? 'TextInput must be wrapped by the FormProvider' : 'Name must be defined';
    //     console.error(msg);
    //     return null;
    // }

    const { field } = useController({ name, rules, defaultValue });

    return (
        <S.Container marginTop={marginTop}>
            {label && <Text.BodySmallBold color={theme.palette.text.muted}>{label}</Text.BodySmallBold>}
            <S.InputContainer
                placeholderTextColor={theme.palette.text.muted}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                value={field.value}
                {...inputProps}
                minHeight={minHeight}
            />
        </S.Container>
    );
};

export const Input = React.memo(InputComponent);
