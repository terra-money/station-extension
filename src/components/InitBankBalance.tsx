import { PropsWithChildren } from 'react';
import { CoinBalance, useInitialBankBalance, useInitialTokenBalance, useWhitelist } from 'utils';
import { BankBalanceProvider } from 'utils';
import { useNetworkName } from 'utils';
// import { combineState } from 'data/query';
import { useCustomTokensNative } from '../utils/settings/CustomTokens';
// import { useWhitelist } from 'data/queries/chains';

const InitBankBalance = ({ children }: PropsWithChildren<{}>) => {
    const balances = useInitialBankBalance();

    const tokenBalancesQuery = useInitialTokenBalance();
    const native = useCustomTokensNative();
    const { whitelist } = useWhitelist();

    const networkName = useNetworkName();

    // const state = combineState(...balances, ...tokenBalancesQuery);
    const bankBalance = balances.reduce((acc, { data }) => (data ? [...acc, ...data] : acc), [] as CoinBalance[]);
    const tokenBalance: CoinBalance[] = tokenBalancesQuery.reduce(
        (acc, { data }) => (data ? [...acc, data] : acc),
        [] as CoinBalance[],
    );

    native.list.forEach(({ denom }) => {
        if (!bankBalance.find(balance => balance.denom === denom)) {
            const token = whitelist[networkName][denom];

            if (!token || !token.chains || token.chains.length === 0) {
                return;
            }

            bankBalance.push({
                denom,
                amount: '0',
                chain: token.chains[0],
            });
        }
    });
    // console.log('value', [...bankBalance, ...tokenBalance]);

    return <BankBalanceProvider value={[...bankBalance, ...tokenBalance]}>{children}</BankBalanceProvider>;
};

export default InitBankBalance;
