import { AxiosError } from 'axios'

type AxiosErrorWithMessageKey = AxiosError & {
  messageKey?: string
}

export default AxiosErrorWithMessageKey
