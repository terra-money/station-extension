import { atom } from 'recoil';
import { persistAtom } from 'utils';

export const addressesBookListState = atom({
    key: 'addressesBookList',
    default: [],
    effects: [persistAtom('addresses')],
});
