export type ErrorMessage = {
  message?: string
  code: string
}

export type ErrorType = {
  statusCode: number
  message: string | ErrorMessage[]
  error?: string
  path?: string[]
}

export type Response<T> = {
  data: {
    [key: string]: T
  }
  errors?: ErrorType[]
}
