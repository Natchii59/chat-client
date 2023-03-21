export interface ErrorMessage {
  message?: string
  code: string
}

export interface ErrorOutput {
  statusCode: number
  message: string | ErrorMessage[]
  error?: string
}
