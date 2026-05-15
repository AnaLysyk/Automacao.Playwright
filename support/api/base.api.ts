export type ApiClientOptions = {
  baseUrl: string;
  token?: string;
};

export class BaseApiClient {
  constructor(private readonly options: ApiClientOptions) {}

  protected async getJson<T>(path: string): Promise<T> {
    return this.requestJson<T>('GET', path);
  }

  protected async postJson<T>(path: string, body?: unknown): Promise<T> {
    return this.requestJson<T>('POST', path, body);
  }

  private async requestJson<T>(method: string, path: string, body?: unknown): Promise<T> {
    if (!this.options.baseUrl) {
      throw new Error('API_BASE_URL_NAO_CONFIGURADA');
    }

    const response = await fetch(`${this.options.baseUrl}${path}`, {
      method,
      headers: {
        'content-type': 'application/json',
        ...(this.options.token ? { authorization: `Bearer ${this.options.token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API_REQUEST_FAILED method=${method} path=${path} status=${response.status}`);
    }

    return response.json() as Promise<T>;
  }
}
