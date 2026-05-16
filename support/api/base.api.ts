export type ApiClientOptions = {
  baseUrl: string;
  token?: string;
};

export type ApiResult<T = unknown> = {
  status: number;
  ok: boolean;
  body: T | null;
  text: string;
  url: string;
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class BaseApiClient {
  constructor(private readonly options: ApiClientOptions) {}

  protected buildPath(path: string, params: Record<string, string | number | undefined> = {}): string {
    return Object.entries(params).reduce((currentPath, [key, value]) => {
      if (value === undefined) return currentPath;
      return currentPath.replaceAll(`{${key}}`, encodeURIComponent(String(value)));
    }, path);
  }

  protected get<T>(path: string): Promise<ApiResult<T>> {
    return this.request<T>('GET', path);
  }

  protected post<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
    return this.request<T>('POST', path, body);
  }

  protected put<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
    return this.request<T>('PUT', path, body);
  }

  protected patch<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
    return this.request<T>('PATCH', path, body);
  }

  protected delete<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
    return this.request<T>('DELETE', path, body);
  }

  protected requestByMethod<T>(method: string, path: string, body?: unknown): Promise<ApiResult<T>> {
    const normalizedMethod = method.trim().toUpperCase() as HttpMethod;

    if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(normalizedMethod)) {
      throw new Error(`API_METHOD_UNSUPPORTED: ${method}`);
    }

    return this.request<T>(normalizedMethod, path, body);
  }

  private async request<T>(method: HttpMethod, path: string, body?: unknown): Promise<ApiResult<T>> {
    if (!this.options.baseUrl) {
      throw new Error('API_BASE_URL_NAO_CONFIGURADA');
    }

    const url = `${this.options.baseUrl}${path}`;
    const response = await fetch(url, {
      method,
      headers: {
        accept: 'application/json',
        ...(body === undefined ? {} : { 'content-type': 'application/json' }),
        ...(this.options.token ? { authorization: `Bearer ${this.options.token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const text = await response.text();

    return {
      status: response.status,
      ok: response.ok,
      body: this.parseBody<T>(text),
      text,
      url,
    };
  }

  private parseBody<T>(text: string): T | null {
    if (!text.trim()) return null;

    try {
      return JSON.parse(text) as T;
    } catch {
      return text as T;
    }
  }
}
