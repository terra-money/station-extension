import React from 'react';
import styled from 'styled-components/native';
import { NavigationTop } from '../../components';
import { WalletScreenProps } from '../../routes/types';
import { PortfolioHeader } from './portfolio';
import { Assets } from './assets';

const Container = styled.View`
    flex: 1;
    background-color: ${p => p.theme.palette.background.default};
`;

const Screen = ({ navigation }: WalletScreenProps): JSX.Element => {
    return (
        <Container>
            <NavigationTop navigation={navigation} />
            <PortfolioHeader />
            <Assets />
        </Container>
    );
};

export const WalletScreen = React.memo(Screen);
