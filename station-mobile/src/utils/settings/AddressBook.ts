import { useRecoilState } from 'recoil';
import { addressesBookListState } from 'store';

export const useAddressBook = () => {
    const [list, setList] = useRecoilState(addressesBookListState);

    const validateName = (name: string) => !list.some(item => item.name === name);

    const updateList = (list: AddressBook[]) => {
        setList(list);
    };

    const add = (newItem: AddressBook) => {
        const name = newItem.name.trim();
        if (!validateName(name)) {
            throw new Error('Already exists');
        }
        updateList([...list, { ...newItem, name }]);
    };

    const remove = (name: string) => {
        updateList(list.filter(item => item.name !== name));
    };

    return { list, add, remove, validateName };
};
