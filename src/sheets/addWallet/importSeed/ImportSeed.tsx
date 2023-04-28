import React from 'react';
import { Button, Checkbox, ContainerWithLoader, Input, Text, WarningAlert } from '../../../components';

import * as GS from '../../styles';

const ImportSeedPage = () => {
    return (
        <GS.ContentContainer>
            <GS.OffsetedContainer>
                <GS.TitleContainer>
                    <Text.Title4>Recover Wallet</Text.Title4>
                </GS.TitleContainer>
                <GS.VerticalStack>
                    <Input label="Wallet name" placeholder="my-wallet" />
                    <Input label="Password" secureTextEntry placeholder="*********" />
                    <Input label="Confirm password" secureTextEntry placeholder="*********" />
                    <Input minHeight="90px" label="Mnemonic" editable={false} multiline />
                    <Input label="Index" defaultValue="0" />
                </GS.VerticalStack>
                <Button marginTop="auto" height="48px" text="Submit" onPress={() => null} />
            </GS.OffsetedContainer>
        </GS.ContentContainer>
    );
};

export const ImportSeed = React.memo(ImportSeedPage);
