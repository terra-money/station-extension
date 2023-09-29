import React from 'react';
import styled from 'styled-components/native';
import { BottomNavigation, DrawerStackNavigation } from '../routes';

const Container = styled.View`
    flex: 1;
    background: ${p => p.theme.palette.dark200};
`;

const MainLayout = () => {
    return (
        <Container>
            <BottomNavigation />
            {/* <DrawerStackNavigation /> */}
        </Container>
    );
};

export { MainLayout };
