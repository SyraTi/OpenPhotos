export enum SERVICE_STATUS {
  SUCCESS = 1,
  ERROR = 0,
}

interface ServiceSuccessReturn<T> {
  status: SERVICE_STATUS.SUCCESS
  data: T
}
interface ServiceErrorReturn {
  status: SERVICE_STATUS.ERROR
  reason: string
}
export type ServiceReturn<T = any> =
  | ServiceSuccessReturn<T>
  | ServiceErrorReturn
