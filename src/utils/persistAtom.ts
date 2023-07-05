import { DefaultValue } from 'recoil';
import { storage } from './storage';

export const persistAtom =
    (key: string) =>
    ({ setSelf, onSet }) => {
        setSelf(() => {
            let data = storage.getString(key);
            if (data != null) {
                return JSON.parse(data);
            } else {
                return new DefaultValue();
            }
        });

        onSet((newValue, _, isReset) => {
            if (isReset) {
                storage.delete(key);
            } else {
                storage.set(key, JSON.stringify(newValue));
            }
        });
    };
