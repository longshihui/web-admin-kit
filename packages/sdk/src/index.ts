export interface SdkClientOptions {
  baseUrl: string
  headers?: HeadersInit
  fetch?: typeof fetch
}

export interface RequestOptions extends Omit<RequestInit, 'headers'> {
  headers?: HeadersInit
  query?: Record<string, string | number | boolean | null | undefined>
}

export interface SdkClient {
  request<T>(path: string, options?: RequestOptions): Promise<T>
}

export class SdkResponseError extends Error {
  readonly status: number
  readonly response: Response

  constructor(response: Response) {
    super(`Request failed with status ${response.status}`)
    this.name = 'SdkResponseError'
    this.status = response.status
    this.response = response
  }
}

export function createSdkClient(options: SdkClientOptions): SdkClient {
  const fetchImpl = options.fetch ?? globalThis.fetch

  if (!fetchImpl) {
    throw new TypeError('A fetch implementation is required.')
  }

  return {
    async request<T>(requestPath: string, requestOptions: RequestOptions = {}): Promise<T> {
      const url = createRequestUrl(options.baseUrl, requestPath, requestOptions.query)
      const response = await fetchImpl(url, {
        ...requestOptions,
        headers: mergeHeaders(options.headers, requestOptions.headers)
      })

      if (!response.ok) {
        throw new SdkResponseError(response)
      }

      if (response.status === 204) {
        return undefined as T
      }

      return response.json() as Promise<T>
    }
  }
}

export function createRequestUrl(
  baseUrl: string,
  requestPath: string,
  query: RequestOptions['query'] = {}
): string {
  const url = new URL(requestPath, normalizeBaseUrl(baseUrl))

  for (const [key, value] of Object.entries(query)) {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
}

function mergeHeaders(baseHeaders: HeadersInit = {}, requestHeaders: HeadersInit = {}): Headers {
  const headers = new Headers(baseHeaders)
  new Headers(requestHeaders).forEach((value, key) => {
    headers.set(key, value)
  })
  return headers
}
