export interface MutationEventArgs<IInitial = unknown, ISuccess = IInitial> {
  onError?: (error: unknown, data: IInitial) => unknown
  onLoading?: (data: IInitial) => unknown
  onSuccess?: (data: ISuccess) => unknown
}
