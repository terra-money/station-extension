import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTheme } from 'styled-components';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Button, Text } from 'components';
import { AddressesList } from './AddressesList';
import { AddAddressForm } from './AddAddressForm';

import * as S from '../../styles';

const AddressesComponent = ({ onClose, setRecipient }) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const theme = useTheme();

    const snapPoints = useMemo(() => ['70%'], []);
    const [mode, setMode] = useState<'list' | 'add'>('list');

    const handleSheetChanges = useCallback(
        (index: number) => {
            if (index === -1) {
                onClose();
            }
        },
        [onClose],
    );

    return (
        <BottomSheet
            enablePanDownToClose={true}
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            backgroundStyle={{
                backgroundColor: theme.palette.background.cardMuted,
            }}
            handleIndicatorStyle={{
                backgroundColor: theme.palette.text.default,
            }}
            onChange={handleSheetChanges}
            backdropComponent={backdropProps => (
                <BottomSheetBackdrop {...backdropProps} disappearsOnIndex={-1} opacity={0.1} />
            )}>
            <S.ContentContainer>
                {mode === 'add' && <AddAddressForm onClose={() => setMode('list')} />}
                {mode === 'list' && <AddressesList setRecipient={setRecipient} />}
                {mode === 'list' && (
                    <S.BottomButtonsWrapper>
                        <Button height="46px" text="Add new address" onPress={() => setMode('add')} />
                    </S.BottomButtonsWrapper>
                )}
            </S.ContentContainer>
        </BottomSheet>
    );
};

export const Addresses = React.memo(AddressesComponent);
