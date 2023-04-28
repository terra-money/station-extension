import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components';

import { Text } from '../..';

interface ButtonProps {
    onPress: () => void;
    text: string;
    disabled?: boolean;
    marginTop?: string;
    active?: boolean;
}

const TextButtonComponent = ({ onPress, text, disabled = false }: ButtonProps) => {
    const theme = useTheme();
    return (
        <TouchableOpacity onPress={onPress}>
            <Text.BodySmallBold color={theme.palette.text.info}>{text}</Text.BodySmallBold>
        </TouchableOpacity>
    );
};

export const TextButton = React.memo(TextButtonComponent);
