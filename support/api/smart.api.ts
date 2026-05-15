import { BaseApiClient } from './base.api';
import { loadEnv } from '../config/env';

export class SmartApi extends BaseApiClient {
  constructor() {
    const env = loadEnv();
    super({ baseUrl: env.smartApiBaseUrl, token: env.smartApiToken });
  }

  async consultarProtocolo<T>(protocolo: string): Promise<T> {
    return this.getJson<T>(`/protocolos/${encodeURIComponent(protocolo)}`);
  }
}

export const smartApi = new SmartApi();
