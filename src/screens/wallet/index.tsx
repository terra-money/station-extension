import React from 'react';
import styled from 'styled-components/native';
// import { WalletScreenProps } from '../../routes/types';

import { RoutesStackNavigator } from './routes';

const Container = styled.View`
    flex: 1;
    background-color: ${p => p.theme.palette.dark200};
`;

const Screen = (): JSX.Element => {
    return (
        <Container>
            <RoutesStackNavigator />
        </Container>
    );
};

export const WalletScreen = React.memo(Screen);
