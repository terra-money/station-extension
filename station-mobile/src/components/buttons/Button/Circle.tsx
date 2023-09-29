import React from 'react';
import { useTheme } from 'styled-components';
import * as S from './Button.styled';

interface ButtonProps {
    onPress: () => void;
    Icon?: React.FunctionComponent<any>;
    size?: number;
    disabled?: boolean;
    marginTop?: string;
    active?: boolean;
    children?: React.ReactNode;
}

const CircleButtonComponent = ({ onPress, children, size = 46, marginTop, disabled = false, active }: ButtonProps) => {
    const theme = useTheme();
    return (
        <S.CircleContainer active={active} marginTop={marginTop} size={size} onPress={onPress}>
            {children}
        </S.CircleContainer>
    );
};

export const CircleButton = React.memo(CircleButtonComponent);
