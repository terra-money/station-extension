import { PropsWithChildren, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useRecoilValue } from 'recoil';
import { currentNetworkState } from 'store';

const InitQueryClient = ({ children }: PropsWithChildren<{}>) => {
    const queryClient = useQueryClient();
    const networkName = useRecoilValue(currentNetworkState);

    return (
        <QueryClientProvider client={queryClient} key={networkName}>
            {children}
        </QueryClientProvider>
    );
};

const useQueryClient = () => {
    const name = useRecoilValue(currentNetworkState);

    return useMemo(() => {
        if (!name) {
            throw new Error();
        }
        return new QueryClient();
    }, [name]);
};

export default InitQueryClient;
