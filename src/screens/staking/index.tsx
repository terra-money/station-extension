import React, { ReactElement } from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
    flex: 1;
    background-color: ${p => p.theme.palette.background.default};
`;

const Screen = (): JSX.Element => {
    return <Container></Container>;
};

export const StakingScreen = React.memo(Screen);
