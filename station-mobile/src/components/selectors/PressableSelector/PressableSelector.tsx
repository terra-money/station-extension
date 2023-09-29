import React from 'react';
import { useTheme } from 'styled-components';
import { SmallRightArrowIcon } from 'icons';
import { Text } from 'components';

import * as S from './PressableSelector.styled';

interface SelectorProps {
    onPress: () => void;
    title: string;
    selectedText?: string;
    Icon?: React.FunctionComponent<any>;
}

const Selector = ({ onPress, title, selectedText = '', Icon }: SelectorProps) => {
    const theme = useTheme();
    return (
        <S.Container onPress={onPress} activeOpacity={0.7}>
            {Icon && (
                <S.LeftIconContainer>
                    <Icon />
                </S.LeftIconContainer>
            )}
            <Text.Title6Bold>{title}</Text.Title6Bold>
            <S.RightSide>
                <Text.Label color={theme.palette.dark900}>{selectedText}</Text.Label>
                <SmallRightArrowIcon />
            </S.RightSide>
        </S.Container>
    );
};

export const PressableSelector = React.memo(Selector);
