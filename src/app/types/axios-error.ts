type AxiosErrorWithMessageKey = {
  response?: {
    data: {
      messageKey: string
    }
  }
  message?: string
}

export default AxiosErrorWithMessageKey
