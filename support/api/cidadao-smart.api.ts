import { BaseApiClient } from './base.api';
import { loadEnv } from '../config/env';

export class CidadaoSmartApi extends BaseApiClient {
  constructor() {
    const env = loadEnv();
    super({ baseUrl: env.cidadaoSmartApiBaseUrl, token: env.cidadaoSmartApiToken });
  }

  async consultarPedido<T>(protocolo: string): Promise<T> {
    return this.getJson<T>(`/pedidos/${encodeURIComponent(protocolo)}`);
  }
}

export const cidadaoSmartApi = new CidadaoSmartApi();
