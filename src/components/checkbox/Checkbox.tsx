import React from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useTheme } from 'styled-components';
import { Text } from 'components';

import * as S from './Checkbox.styled';

interface CheckboxComponentProps {
    isChecked: boolean;
    onPress: (isChecked: boolean) => void;
    text: string;
}

const CheckboxComponent = ({ isChecked, onPress, text = '' }: CheckboxComponentProps) => {
    const theme = useTheme();
    return (
        <S.Container>
            <BouncyCheckbox
                disableBuiltInState
                textComponent={
                    <S.TextContainer>
                        <Text.BodySmall color={theme.palette.text.muted}>{text}</Text.BodySmall>
                    </S.TextContainer>
                }
                size={17}
                onPress={onPress}
                isChecked={isChecked}
                fillColor={theme.palette.text.muted}
            />
        </S.Container>
    );
};

export const Checkbox = React.memo(CheckboxComponent);
