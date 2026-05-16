import { BaseApiClient, type ApiResult } from './base.api';
import { loadEnv } from '../config/env';

export class SmartApi extends BaseApiClient {
  private readonly env = loadEnv();

  constructor() {
    const env = loadEnv();
    super({ baseUrl: env.smartApiBaseUrl, token: env.smartApiToken });
  }

  async buscarProcessoFinalizadoPorCpf<T = unknown>(cpf: string): Promise<ApiResult<T>> {
    const path = this.buildPath(this.env.smartFinishedProcessByCpfPath, { cpf });
    return this.get<T>(path);
  }

  async consultarProtocolo<T = unknown>(protocolo: string): Promise<ApiResult<T>> {
    const path = this.buildPath(this.env.smartGetProtocolPath, { protocolo });
    return this.get<T>(path);
  }
}

export const smartApi = new SmartApi();
