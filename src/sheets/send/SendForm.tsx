import React, { useMemo, useState } from 'react';
import { useTheme } from 'styled-components';

import * as S from '../styles';
import { Button, Input, Text } from 'components';
import {
    useBankBalance,
    useExchangeRates,
    useInterchainAddresses,
    useNativeDenoms,
    useNetwork,
    useNetworkName,
    validate,
} from 'utils';
import { Asset } from '../../screens/wallet/assets/Asset';
import { Addresses } from './addresses/Adresses';
import { FormProvider, useForm } from 'react-hook-form';
import { toAmount } from '@terra-money/terra-utils';
import { TransferDetails } from './TransferDetails';
import { TransactionFeesContainer, TransactionFeeContainer } from './Send.styles';

const SendFormComponent = () => {
    const theme = useTheme();
    const addresses = useInterchainAddresses();
    const networks = useNetwork();
    const networkName = useNetworkName();
    const balances = useBankBalance();
    const { data: prices } = useExchangeRates();
    const readNativeDenom = useNativeDenoms();

    const [selectedAsset, setSelectedAsset] = useState();
    const [reviewStep, setReviewStep] = useState();
    const [addressBookOpened, setAddressBookOpened] = useState(false);

    const availableAssets = useMemo(
        () =>
            Object.values(
                (balances ?? []).reduce((acc, { denom, amount, chain }) => {
                    const data = readNativeDenom(denom);
                    if (acc[data.token]) {
                        acc[data.token].balance = `${parseInt(acc[data.token].balance) + parseInt(amount)}`;
                        acc[data.token].chains.push(chain);
                        return acc as Record<string, AssetType>;
                    } else {
                        return {
                            ...acc,
                            [data.token]: {
                                denom: data.token,
                                balance: amount,
                                icon: data.icon,
                                symbol: data.symbol,
                                price: prices?.[data.token]?.price ?? 0,
                                chains: [chain],
                            },
                        } as Record<string, AssetType>;
                    }
                }, {} as Record<string, AssetType>),
            ).sort((a, b) => b.price * parseInt(b.balance) - a.price * parseInt(a.balance)),
        [balances, readNativeDenom, prices],
    );

    /* form */
    const form = useForm<TxValues>({ mode: 'onChange' });
    const { register, trigger, watch, setValue, handleSubmit, reset } = form;
    const { formState } = form;
    const { errors } = formState;
    const { recipient, input, memo, chain, address: destinationAddress, asset } = watch();

    // const decimals = asset ? readNativeDenom(asset).decimals : 6;

    const availableChains = useMemo(
        () =>
            availableAssets
                .find(({ denom }) => denom === asset)
                ?.chains.sort((a, b) => {
                    if (networks[a]?.prefix === 'terra') {
                        return -1;
                    }
                    if (networks[b]?.prefix === 'terra') {
                        return 1;
                    }
                    return 0;
                }),
        [asset, availableAssets, networks],
    );
    return (
        <>
            <S.ContentContainer>
                <S.OffsetedContainer>
                    <S.TitleContainer>
                        <Text.Title4>Send</Text.Title4>
                    </S.TitleContainer>
                    <S.SelectorsContainer>
                        {!selectedAsset &&
                            availableAssets?.map(asset => <Asset {...asset} onPress={() => setSelectedAsset(asset)} />)}
                        {selectedAsset && !reviewStep && <Asset {...selectedAsset} />}
                        {reviewStep && <TransferDetails selectedAsset={selectedAsset} />}
                        <FormProvider {...form}>
                            {selectedAsset && !reviewStep && (
                                <>
                                    <Input
                                        label="Recepient"
                                        placeholder="terra1x46rqay4d3cssq8gxxvqz8xt6n..."
                                        name="recepient"
                                        actionButtonName="Address book"
                                        actionButtonOnClick={() => setAddressBookOpened(!addressBookOpened)}
                                    />
                                    <Input label="Amount" placeholder="0.0000" name="amount" />
                                    <Input label="Memo (optional)" placeholder="memo" name="memo" />
                                </>
                            )}
                            {reviewStep && <Input label="Password" name="password" />}
                            {reviewStep && (
                                <TransactionFeesContainer>
                                    <TransactionFeeContainer>
                                        <Text.BodySmallBold color={theme.palette.dark900}>Fee</Text.BodySmallBold>
                                        <Text.BodySmallBold>0.054355 LUNA</Text.BodySmallBold>
                                    </TransactionFeeContainer>
                                    <TransactionFeeContainer>
                                        <Text.BodySmallBold color={theme.palette.dark900}>
                                            Balance
                                        </Text.BodySmallBold>
                                        <Text.BodySmallBold>49.355 LUNA</Text.BodySmallBold>
                                    </TransactionFeeContainer>
                                    <TransactionFeeContainer>
                                        <Text.BodySmallBold color={theme.palette.dark900}>
                                            Balance after tx
                                        </Text.BodySmallBold>
                                        <Text.BodySmallBold>2.0355 LUNA</Text.BodySmallBold>
                                    </TransactionFeeContainer>
                                </TransactionFeesContainer>
                            )}
                        </FormProvider>
                    </S.SelectorsContainer>
                </S.OffsetedContainer>
                <S.BottomButtonsWrapper>
                    {selectedAsset && <Button height="48px" text="Next" onPress={() => setReviewStep(true)} />}
                </S.BottomButtonsWrapper>
            </S.ContentContainer>
            {addressBookOpened && (
                <Addresses
                    setRecipient={recipient => {
                        setValue('recepient', recipient);
                        setAddressBookOpened(false);
                    }}
                    onClose={() => setAddressBookOpened(false)}
                />
            )}
        </>
    );
};

export const SendForm = React.memo(SendFormComponent);
