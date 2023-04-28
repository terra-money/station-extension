import React from 'react';
import { useTheme } from 'styled-components';
import { WarningIcon } from '../../../icons';
import { Text } from '../../texts';
import * as S from './Warning.styled';

const Warning = ({ text }: { text: string }) => {
    const theme = useTheme();
    return (
        <S.Container>
            <S.IconContainer>
                <WarningIcon fill={theme.palette.extra.warning} />
            </S.IconContainer>
            <S.TextContainer>
                <Text.BodySmall color={theme.palette.extra.warning}>{text}</Text.BodySmall>
            </S.TextContainer>
        </S.Container>
    );
};

export const WarningAlert = React.memo(Warning);
