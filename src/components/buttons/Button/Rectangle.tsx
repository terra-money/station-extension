import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';

import { Text } from 'components';
import * as S from './Button.styled';

export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
    text: string;
    onPress: () => void;
    Icon?: React.FunctionComponent<any>;
    size?: ButtonSize;
    disabled?: boolean;
    height?: string;
    width?: string;
    marginTop?: string;
    active?: boolean;
    loading?: boolean;
}

const RectangleButton = ({
    onPress,
    Icon,
    text = '',
    size = 'medium',
    height,
    width,
    marginTop,
    disabled = false,
    active,
    loading,
}: ButtonProps) => {
    const theme = useTheme();
    return (
        <S.RectangleContainer
            active={active}
            marginTop={marginTop}
            size={size}
            onPress={onPress}
            height={height}
            width={width}>
            {React.isValidElement(Icon) && (
                <S.IconContainer>
                    <Icon />
                </S.IconContainer>
            )}
            {loading && <ActivityIndicator />}
            {text && <Text.Label color={theme.palette.white}>{text}</Text.Label>}
        </S.RectangleContainer>
    );
};

export const Button = React.memo(RectangleButton);
