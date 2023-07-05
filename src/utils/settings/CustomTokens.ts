import { atom, useRecoilState, useRecoilValue } from 'recoil';
import update from 'immutability-helper';
import { currentNetworkState } from 'store';

export const DefaultCustomTokensItem = {
    cw20: [],
    cw721: [],
    native: [
        {
            denom: 'uluna',
        },
    ],
};
export const DefaultDisplayChains = {
    mainnet: ['phoenix-1', 'osmosis-1'],
    testnet: ['pisco-1'],
    classic: ['columbus-5'],
};

export const DefaultCustomTokens = { mainnet: DefaultCustomTokensItem };

const customTokensState = atom({
    key: 'customTokens',
    default: DefaultCustomTokensItem,
});

interface Params<T> {
    type: 'cw20' | 'cw721' | 'native';
    key: keyof T;
}

const useCustomTokens = <T extends CustomToken>({ type, key }: Params<T>) => {
    const [customTokens, setCustomTokens] = useRecoilState(customTokensState);
    const networkName = useRecoilValue(currentNetworkState);
    const list = (customTokens[networkName]?.[type] ?? []) as T[];

    const getIsAdded = (param: T) => !!list.find(item => item[key] === param[key]);

    const updateList = (list: T[]) => {
        const prev = { [networkName]: DefaultCustomTokensItem, ...customTokens };
        const next = update(prev, { [networkName]: { [type]: { $set: list } } });
        setCustomTokens(next);
    };

    const add = (newItem: T) => {
        if (getIsAdded(newItem)) {
            return;
        }
        updateList([...list, newItem]);
    };

    const remove = (oldItem: T) => updateList(list.filter(item => item[key] !== oldItem[key]));

    return { list, getIsAdded, update: updateList, add, remove };
};

export const useCustomTokensCW20 = () => {
    return useCustomTokens<CustomTokenCW20>({ type: 'cw20', key: 'token' });
};

export const useCustomTokensNative = () => {
    return useCustomTokens<NativeTokenBasicInfo>({ type: 'native', key: 'denom' });
};

export const useCustomTokensCW721 = () => {
    return useCustomTokens<CustomTokenCW721>({ type: 'cw721', key: 'contract' });
};
