import { APIRequestContext } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

/**
 * Helper para chamadas de API
 */
export class ApiHelper {
  /**
   * Remove barra final para montar rotas de API de forma previsivel.
   */
  static normalizeUrl(url: string): string {
    return url.replace(/\/+$/, '');
  }

  /**
   * Base da API documentada. API_BASE_URL tem prioridade; se nao existir,
   * usamos a base do Cidadao Smart porque os endpoints ficam no mesmo host.
   */
  static getApiBaseUrl(): string {
    return this.normalizeUrl(process.env.API_BASE_URL || process.env.CIDADAO_SMART_BASE_URL || '');
  }

  /**
   * Monta uma URL absoluta a partir de uma rota como /api/v1/...
   */
  static buildApiUrl(path: string, baseUrl = this.getApiBaseUrl()): string {
    const normalizedBaseUrl = this.normalizeUrl(baseUrl);
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${normalizedBaseUrl}${normalizedPath}`;
  }

  /**
   * Usa API_TOKEN quando ja existe token pronto; caso contrario tenta Keycloak.
   */
  static async getConfiguredToken(request: APIRequestContext): Promise<string | undefined> {
    const fixedToken = process.env.API_TOKEN || '';
    if (fixedToken) return fixedToken;

    const canUseKeycloak =
      Boolean(process.env.KEYCLOAK_TOKEN_URL) &&
      Boolean(process.env.KEYCLOAK_CLIENT_ID) &&
      Boolean(process.env.KEYCLOAK_CLIENT_SECRET);

    if (!canUseKeycloak) return undefined;

    return this.getAuthToken(request);
  }

  /**
   * Obter token de autenticação (Keycloak)
   */
  static async getAuthToken(
    request: APIRequestContext
  ): Promise<string> {
    const tokenUrl = process.env.KEYCLOAK_TOKEN_URL || '';
    const clientId = process.env.KEYCLOAK_CLIENT_ID || '';
    const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET || '';

    if (!tokenUrl || !clientId || !clientSecret) {
      throw new Error(
        'Variáveis KEYCLOAK_TOKEN_URL, KEYCLOAK_CLIENT_ID e KEYCLOAK_CLIENT_SECRET obrigatórias'
      );
    }

    const response = await request.post(tokenUrl, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: {
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      },
    });

    if (!response.ok()) {
      throw new Error(
        `Falha ao obter token: ${response.status()} ${response.statusText()}`
      );
    }

    const json = await response.json();
    return json.access_token;
  }

  /**
   * Headers padrão para requisições de API
   */
  static getDefaultHeaders(): Record<string, string> {
    const cpf = process.env.X_OPERATOR_CPF || '';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (cpf) {
      headers['x-operator-cpf'] = cpf;
    }

    return headers;
  }

  /**
   * GET com token
   */
  static async get(
    request: APIRequestContext,
    url: string,
    token?: string
  ): Promise<any> {
    const headers = this.getDefaultHeaders();

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await request.get(url, { headers });

    if (!response.ok()) {
      throw new Error(
        `GET ${url} falhou: ${response.status()} ${response.statusText()}`
      );
    }

    return response.json();
  }

  /**
   * POST com token
   */
  static async post(
    request: APIRequestContext,
    url: string,
    data: any,
    token?: string
  ): Promise<any> {
    const headers = this.getDefaultHeaders();

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await request.post(url, {
      headers,
      data,
    });

    if (!response.ok()) {
      throw new Error(
        `POST ${url} falhou: ${response.status()} ${response.statusText()}`
      );
    }

    return response.json();
  }

  /**
   * PUT com token
   */
  static async put(
    request: APIRequestContext,
    url: string,
    data: any,
    token?: string
  ): Promise<any> {
    const headers = this.getDefaultHeaders();

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await request.put(url, {
      headers,
      data,
    });

    if (!response.ok()) {
      throw new Error(
        `PUT ${url} falhou: ${response.status()} ${response.statusText()}`
      );
    }

    return response.json();
  }

  /**
   * DELETE com token
   */
  static async delete(
    request: APIRequestContext,
    url: string,
    token?: string
  ): Promise<any> {
    const headers = this.getDefaultHeaders();

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await request.delete(url, { headers });

    if (!response.ok()) {
      throw new Error(
        `DELETE ${url} falhou: ${response.status()} ${response.statusText()}`
      );
    }

    return response.json();
  }

  /**
   * Criar processo no Cidadão Smart (API)
   */
  static async createCidadaoProcess(
    request: APIRequestContext,
    serviceType: string,
    city: string,
    token?: string
  ): Promise<any> {
    const baseUrl = process.env.CIDADAO_SMART_BASE_URL || '';

    const url = `${baseUrl}/api/v1/processes`;

    const data = {
      service_type: serviceType,
      city,
      timestamp: new Date().toISOString(),
    };

    return this.post(request, url, data, token);
  }

  /**
   * Consultar processo por protocolo
   */
  static async getProcessByProtocol(
    request: APIRequestContext,
    protocol: string,
    token?: string
  ): Promise<any> {
    const baseUrl = process.env.CIDADAO_SMART_BASE_URL || '';
    const url = `${baseUrl}/api/v1/processes/${protocol}`;

    return this.get(request, url, token);
  }

  /**
   * Atualizar status do processo via Notificador
   */
  static async notifyProcessStatus(
    request: APIRequestContext,
    protocol: string,
    status: string,
    token?: string
  ): Promise<any> {
    const webhookUrl = process.env.GBDS_WEBHOOK_URL || '';

    const data = {
      protocol,
      status, // REVIEW | PRINTING | READY | FINALIZED
      timestamp: new Date().toISOString(),
    };

    return this.post(request, webhookUrl, data, token);
  }

  /**
   * Verificar DAE (Documento de Arrecadação Estadual)
   */
  static async checkDae(
    request: APIRequestContext,
    protocol: string,
    token?: string
  ): Promise<any> {
    const daeUrl = process.env.DAE_API_URL || '';
    const url = `${daeUrl}/check/${protocol}`;

    return this.get(request, url, token);
  }

  /**
   * Listar postos disponíveis (Booking API)
   */
  static async getServicePoints(
    request: APIRequestContext,
    city?: string,
    token?: string
  ): Promise<any> {
    const baseUrl = process.env.BOOKING_ADMIN_BASE_URL || '';
    let url = `${baseUrl}/api/v1/service-points`;

    if (city) {
      url += `?city=${encodeURIComponent(city)}`;
    }

    return this.get(request, url, token);
  }

  /**
   * Obter agenda de um posto
   */
  static async getServicePointSchedule(
    request: APIRequestContext,
    servicePointId: string,
    date?: string,
    token?: string
  ): Promise<any> {
    const baseUrl = process.env.BOOKING_ADMIN_BASE_URL || '';
    let url = `${baseUrl}/api/v1/service-points/${servicePointId}/schedule`;

    if (date) {
      url += `?date=${date}`;
    }

    return this.get(request, url, token);
  }

  /**
   * Obter processos no SMART
   */
  static async getSmartProcesses(
    request: APIRequestContext,
    filter?: string,
    token?: string
  ): Promise<any> {
    const baseUrl = process.env.SMART_BASE_URL || '';
    let url = `${baseUrl}/api/v1/processes`;

    if (filter) {
      url += `?filter=${encodeURIComponent(filter)}`;
    }

    return this.get(request, url, token);
  }

  /**
   * Verificar saúde da API
   */
  static async healthCheck(
    request: APIRequestContext,
    baseUrl: string
  ): Promise<any> {
    const url = `${baseUrl}/health`;

    try {
      const response = await request.get(url);
      return {
        healthy: response.ok(),
        status: response.status(),
      };
    } catch (error) {
      return {
        healthy: false,
        error: String(error),
      };
    }
  }
}
