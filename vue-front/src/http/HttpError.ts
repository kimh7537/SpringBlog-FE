import type { AxiosError } from 'axios'

// 에러 응답 데이터의 구조를 정의
interface ErrorResponse {
  code: string;
  message: string;
}


export default class HttpError {
  private readonly code: string
  private readonly message: string

  constructor(e: AxiosError<ErrorResponse>) {
    this.code = e.response?.data.code ?? '500'
    this.message = e.response?.data.message ?? '네트워크 상태가 안좋아잉..'
  }

  public getMessage() {
    return this.message
  }
}
