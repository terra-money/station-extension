import React from 'react';
import { ActivityIndicator } from 'react-native';
import * as S from './Loader.styled';

const LoaderComponent = () => {
    return (
        <S.Container>
            <ActivityIndicator />
        </S.Container>
    );
};

export const ContainerWithLoader = React.memo(LoaderComponent);
