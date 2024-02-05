import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { queryContract } from "../actions";

export const useExecuteContract = () => {}
export const useQueryContract = <IData, IError>(args?: {
  address?: string;
  queryMsg?: Record<string, unknown>;
}): UseQueryResult<IData, IError> => {

  const query: UseQueryResult<IData, IError> = useQuery({
    queryKey: ["USE_QUERY_CONTRACT", args?.address, args?.queryMsg],
    queryFn: async () => {
      if (!args?.address || !args.queryMsg) {
        throw new Error("Address or queryMsg is undefined");
      }
      return queryContract(args.address, args.queryMsg);
    },
    enabled: Boolean(args?.address) && Boolean(args?.queryMsg),
  });

  return query;
};
