import React from 'react';
import { GroupSelector, GroupSelectorElement, Text } from 'components';

import * as GS from '../../styles';

const Currency = () => {
    return (
        <GS.ContentContainer>
            <GS.OffsetedContainer>
                <GS.TitleContainer>
                    <Text.Title4>Currency</Text.Title4>
                </GS.TitleContainer>
                <GroupSelector>
                    {['USD'].map(currency => {
                        return (
                            <GroupSelectorElement
                                selected={true}
                                key={currency}
                                title={currency}
                                onPress={() => null}
                            />
                        );
                    })}
                </GroupSelector>
            </GS.OffsetedContainer>
        </GS.ContentContainer>
    );
};

export const CurrencySettings = React.memo(Currency);
