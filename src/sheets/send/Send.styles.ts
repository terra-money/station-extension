import styled from 'styled-components/native';

export const TransferDetailsContainer = styled.View`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

export const TransferDetails = styled.View`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px;
    width: 49%;
    border-radius: 16px;
    background-color: ${p => p.theme.palette.background.card};
`;

export const TransferDetailsValues = styled.View`
    display: flex;
    align-items: center;
    margin-top: 8px;
`;

export const TransferIconContainer = styled.View`
    height: 40px;
    width: 40px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    background-color: ${p => p.theme.palette.background.card};
    align-items: center;

    border: 4px solid ${p => p.theme.palette.background.cardMuted};
`;

export const TransferIconWrapper = styled.View`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const TransferCoinIconWrapper = styled.View`
    width: 40px;
    height: 40px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${p => p.theme.palette.background.cardMuted};
`;

export const TransactionFeesContainer = styled.View`
    margin-top: 24px;
    gap: 16px;
    width: 100%;
    display: flex;
`;

export const TransactionFeeContainer = styled.View`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;
