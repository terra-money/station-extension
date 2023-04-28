import React from 'react';
import { Text, TextButton } from 'components';

import { Asset } from './Asset';

import * as S from './Assets.styled';

const AssetsView = () => {
    return (
        <S.Container>
            <S.AssetsHeader>
                <Text.BodySmallBold>Assets</Text.BodySmallBold>
                <TextButton onPress={() => null} text="Manage tokens" />
            </S.AssetsHeader>
            <Asset
                value="$134.56"
                amount="12.56 LUNA"
                name="LUNA"
                iconUri="https://station-assets.terra.money/img/chains/Terra.svg"
                trend={13.02}
            />
            <Asset
                value="$1,234.56"
                amount="34.56 LUNA"
                name="Akash"
                iconUri="https://station-assets.terra.money/img/chains/Akash.svg"
                trend={-9.02}
            />
            <Asset
                value="$1,234.56"
                amount="34.56 LUNA"
                name="Cosmos"
                iconUri="https://station-assets.terra.money/img/chains/Cosmos.svg"
                trend={1.2}
            />
        </S.Container>
    );
};

export const Assets = React.memo(AssetsView);
