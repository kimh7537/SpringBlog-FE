import AxiosHttpClient, { type HttpRequestConfig } from '@/http/AxiosHttpClient'
import { inject, singleton } from 'tsyringe'
import { plainToInstance } from 'class-transformer'
import Null from '@/entity/data/Null'
import Paging from '@/entity/data/Paging'

// response 타입 정의
interface PagingResponse {
  items: any[];
  [key: string]: any;
}

// Constructor 타입 정의를 수정
type Constructor<T = any> = new (...args: any[]) => T;

@singleton()
export default class HttpRepository {
  constructor(@inject(AxiosHttpClient) private readonly httpClient: AxiosHttpClient) {}

  public get<T>(config: HttpRequestConfig, clazz: Constructor<T>): Promise<T> {
    return this.httpClient.request({ ...config, method: 'GET' }).then((response) => plainToInstance(clazz, response))
  }

  public getList<T>(config: HttpRequestConfig, clazz: Constructor<T>): Promise<Paging<T>> {
    return this.httpClient.request({ ...config, method: 'GET' }).then((response: PagingResponse) => {
      const paging = plainToInstance(Paging, response) as Paging<T>
      const items = plainToInstance(clazz, response.items)
      paging.setItems(items)
      return paging
    })
  }

  public post<T>(config: HttpRequestConfig, clazz: Constructor<T> | null = null): Promise<T> {
    return this.httpClient
      .request({ ...config, method: 'POST' })
      .then((response) => plainToInstance((clazz || Null) as Constructor<T>, response))
  }

  public patch<T>(config: HttpRequestConfig, clazz: Constructor<T> | null = null): Promise<T> {
    return this.httpClient
      .request({
        ...config,
        method: 'PATCH',
      })
      .then((response) => plainToInstance((clazz || Null) as Constructor<T>, response))
  }

  public delete<T>(config: HttpRequestConfig, clazz: Constructor<T> | null = null): Promise<T> {
    return this.httpClient
      .request({ ...config, method: 'DELETE' })
      .then((response) => plainToInstance((clazz || Null) as Constructor<T>, response))
  }
}
