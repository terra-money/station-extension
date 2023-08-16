import styled from 'styled-components/native';

export const Stack = styled.View`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 24px;
`;

export const QuizBlock = styled.View`
    display: flex;
`;

export const QuizButtonsWrapper = styled.View`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 16px;
    gap: 16px;
    justify-content: center;
`;

export const CreatedWalletContainer = styled.View`
    display: flex;
    align-items: center;
    background-color: ${p => p.theme.palette.background.card};
    padding: 24px;
    border-radius: 8px;
`;

export const WalletInfoContainer = styled.View`
    margin-top: 24px;
    padding: 20px;
    background-color: ${p => p.theme.palette.dark};
    border-radius: 8px;
    gap: 8px;
`;
