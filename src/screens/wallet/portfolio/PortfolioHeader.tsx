import { CircleButton, Text } from 'components';
import React from 'react';
import { PlusIcon, PortfolioReceiveIcon, PortfolioSendIcon } from '../../../icons';

import * as S from './PortfolioHeader.styled';

const PortfolioHeaderComponent = () => {
    return (
        <>
            <S.BorderLine />
            <S.Container>
                <Text.Title6>Portfolio value</Text.Title6>
                <Text.Title3>$12,345.67</Text.Title3>
                <S.ActionsContainer>
                    <S.ActionContainer>
                        <CircleButton onPress={() => null} active>
                            <PlusIcon />
                        </CircleButton>
                        <Text.Body>Buy</Text.Body>
                    </S.ActionContainer>
                    <S.ActionContainer>
                        <CircleButton onPress={() => null}>
                            <PortfolioSendIcon />
                        </CircleButton>
                        <Text.Body>Send</Text.Body>
                    </S.ActionContainer>
                    <S.ActionContainer>
                        <CircleButton onPress={() => null}>
                            <PortfolioReceiveIcon />
                        </CircleButton>
                        <Text.Body>Receive</Text.Body>
                    </S.ActionContainer>
                </S.ActionsContainer>
            </S.Container>
        </>
    );
};

export const PortfolioHeader = React.memo(PortfolioHeaderComponent);
