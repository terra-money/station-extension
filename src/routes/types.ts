import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AppStackParamList = {
    Wallet: undefined;
    Activity: undefined;
    Staking: undefined;
    Governance: undefined;
    History: undefined;
    Send: undefined;
};

export type WalletScreenProps = NativeStackScreenProps<AppStackParamList, 'Wallet'>;
export type SwapScreenProps = NativeStackScreenProps<AppStackParamList, 'Swap'>;
export type StakingScreenProps = NativeStackScreenProps<AppStackParamList, 'Staking'>;
export type GovernanceScreenProps = NativeStackScreenProps<AppStackParamList, 'Governance'>;
export type HistoryScreenProps = NativeStackScreenProps<AppStackParamList, 'History'>;
export type SendScreenProps = NativeStackScreenProps<AppStackParamList, 'Send'>;
