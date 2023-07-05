import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Input } from '../../../components';

const PrivateKeyWalletExport = ({ encoded }) => {
    const form = useForm();
    return (
        <>
            <FormProvider {...form}>
                <Input label="Private key" editable={false} defaultValue={encoded} multiline name="encoded" />
            </FormProvider>
        </>
    );
};

export const PrivateKeyExport = React.memo(PrivateKeyWalletExport);
