import { BaseApiClient, type ApiResult } from './base.api';
import { loadEnv } from '../config/env';

export class CidadaoSmartApi extends BaseApiClient {
  private readonly env = loadEnv();

  constructor() {
    const env = loadEnv();
    super({ baseUrl: env.cidadaoSmartApiBaseUrl, token: env.cidadaoSmartApiToken });
  }

  async validarElegibilidadeViaExpressa<T = unknown>(cpf: string): Promise<ApiResult<T>> {
    const path = this.buildPath(this.env.cidadaoSmartExpressEligibilityPath, { cpf });
    return this.get<T>(path);
  }

  async criarViaExpressa<T = unknown>(payload: unknown): Promise<ApiResult<T>> {
    return this.post<T>(this.env.cidadaoSmartCreateExpressPath, payload);
  }

  async consultarProcesso<T = unknown>(idOuProtocolo: string): Promise<ApiResult<T>> {
    const path = this.buildPath(this.env.cidadaoSmartGetProcessPath, {
      id: idOuProtocolo,
      protocolo: idOuProtocolo,
    });

    return this.get<T>(path);
  }

  async cancelarViaExpressa<T = unknown>(idOuProtocolo: string): Promise<ApiResult<T>> {
    const path = this.buildPath(this.env.cidadaoSmartCancelExpressPath, {
      id: idOuProtocolo,
      protocolo: idOuProtocolo,
    });

    return this.requestByMethod<T>(this.env.cidadaoSmartCancelExpressMethod, path);
  }

  async consultarPedido<T = unknown>(protocolo: string): Promise<ApiResult<T>> {
    return this.get<T>(`/pedidos/${encodeURIComponent(protocolo)}`);
  }
}

export const cidadaoSmartApi = new CidadaoSmartApi();
