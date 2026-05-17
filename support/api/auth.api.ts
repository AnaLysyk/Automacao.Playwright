import { loadEnv } from '../config/env';

type TokenInternoResponse = {
  data?: {
    token?: string;
  };
  token?: string;
  access_token?: string;
};

type KeycloakTokenResponse = {
  access_token?: string;
  expires_in?: number;
  refresh_expires_in?: number;
  refresh_token?: string;
  token_type?: string;
  id_token?: string;
  scope?: string;
};

export class AuthApi {
  private readonly env = loadEnv();
  private readonly timeoutMs = 30000;

  private tokenInternoEmMemoria = '';
  private tokenKeycloakEmMemoria = '';

  async gerarTokenInterno(): Promise<string> {
    if (this.tokenInternoEmMemoria) {
      return this.tokenInternoEmMemoria;
    }

    this.validarConfigTokenInterno();

    const url = this.juntarUrl(this.env.bookingApiBaseUrl, this.env.apiTokenPath);

    let response: Response;

    try {
      response = await this.fetchComTimeout(url, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            grantType: this.env.apiTokenGrantType,
            userName: this.env.apiTokenUserName,
            userPassword: this.env.apiTokenUserPassword,
            token: '',
          },
        }),
      });
    } catch (error) {
      throw new Error(
        [
          '[AUTH_INTERNO] Nao foi possivel conectar no endpoint de token interno.',
          `URL: ${url}`,
          `Timeout configurado: ${this.timeoutMs}ms`,
          '',
          'Possiveis causas:',
          '- VPN desconectada ou sem rota para o ambiente',
          '- Servico fora do ar',
          '- Porta incorreta no .env',
          '- BOOKING_API_BASE_URL apontando para o front em vez da API',
          '- Firewall/rede bloqueando a conexao',
          '',
          `Erro original: ${this.formatarErro(error)}`,
        ].join('\n'),
      );
    }

    const text = await response.text();
    const body = this.parseJson<TokenInternoResponse>(text);

    if (!response.ok) {
      throw new Error(
        [
          '[AUTH_INTERNO] Falha ao gerar token interno.',
          `URL: ${url}`,
          `Status: ${response.status}`,
          `Body: ${text}`,
        ].join('\n'),
      );
    }

    const token = body?.data?.token || body?.token || body?.access_token;

    if (!token) {
      throw new Error(
        [
          '[AUTH_INTERNO] Token interno nao encontrado na resposta.',
          `URL: ${url}`,
          `Status: ${response.status}`,
          `Body: ${text}`,
        ].join('\n'),
      );
    }

    this.tokenInternoEmMemoria = token;
    return token;
  }

  async gerarTokenKeycloak(): Promise<string> {
    if (this.tokenKeycloakEmMemoria) {
      return this.tokenKeycloakEmMemoria;
    }

    this.validarConfigKeycloak();

    const url = this.env.keycloakTokenUrl.trim();

    const form = new URLSearchParams();

    form.set('grant_type', this.env.keycloakGrantType.trim());
    form.set('client_id', this.env.keycloakClientId.trim());
    form.set('client_secret', this.env.keycloakClientSecret.trim());
    form.set('username', this.env.keycloakUsername.trim());
    form.set('password', this.env.keycloakPassword);
    form.set('response_type', this.env.keycloakResponseType.trim());
    form.set('scope', this.env.keycloakScope.trim());

    let response: Response;

    try {
      response = await this.fetchComTimeout(url, {
        method: 'POST',
        headers: {
          accept: '*/*',
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: form.toString(),
      });
    } catch (error) {
      throw new Error(
        [
          '[KEYCLOAK] Nao foi possivel conectar no endpoint de token.',
          `URL: ${url}`,
          `Timeout configurado: ${this.timeoutMs}ms`,
          '',
          'Possiveis causas:',
          '- VPN desconectada ou sem rota para o ambiente',
          '- Keycloak fora do ar',
          '- URL incorreta no .env.local',
          '- Firewall/rede bloqueando a conexao',
          '',
          `Erro original: ${this.formatarErro(error)}`,
        ].join('\n'),
      );
    }

    const text = await response.text();
    const body = this.parseJson<KeycloakTokenResponse>(text);

    if (!response.ok) {
      throw new Error(
        [
          '[KEYCLOAK] Falha ao gerar access_token.',
          `URL: ${url}`,
          `Status: ${response.status}`,
          `Body: ${text}`,
          '',
          'Payload enviado igual ao Postman:',
          `grant_type=${this.env.keycloakGrantType.trim()}`,
          `client_id=${this.env.keycloakClientId.trim()}`,
          `client_secret preenchido? ${this.env.keycloakClientSecret ? 'sim' : 'nao'}`,
          `username=${this.env.keycloakUsername.trim()}`,
          `password preenchido? ${this.env.keycloakPassword ? 'sim' : 'nao'}`,
          `response_type=${this.env.keycloakResponseType.trim()}`,
          `scope=${this.env.keycloakScope.trim()}`,
        ].join('\n'),
      );
    }

    const token = body?.access_token;

    if (!token) {
      throw new Error(
        [
          '[KEYCLOAK] access_token nao encontrado na resposta.',
          `URL: ${url}`,
          `Status: ${response.status}`,
          `Body: ${text}`,
        ].join('\n'),
      );
    }

    this.tokenKeycloakEmMemoria = token;
    return token;
  }

  async gerarToken(): Promise<string> {
    return this.gerarTokenKeycloak();
  }

  limparCache(): void {
    this.tokenInternoEmMemoria = '';
    this.tokenKeycloakEmMemoria = '';
  }

  private validarConfigTokenInterno(): void {
    const faltando: string[] = [];

    if (!this.env.bookingApiBaseUrl) faltando.push('BOOKING_API_BASE_URL');
    if (!this.env.apiTokenPath) faltando.push('API_TOKEN_PATH');
    if (!this.env.apiTokenGrantType) faltando.push('API_TOKEN_GRANT_TYPE');
    if (!this.env.apiTokenUserName) faltando.push('API_TOKEN_USER_NAME');
    if (!this.env.apiTokenUserPassword) faltando.push('API_TOKEN_USER_PASSWORD');

    if (faltando.length > 0) {
      throw new Error(`[AUTH_INTERNO] Configuracao ausente no .env.local: ${faltando.join(', ')}`);
    }
  }

  private validarConfigKeycloak(): void {
    const faltando: string[] = [];

    if (!this.env.keycloakTokenUrl) faltando.push('KEYCLOAK_TOKEN_URL');
    if (!this.env.keycloakGrantType) faltando.push('KEYCLOAK_GRANT_TYPE');
    if (!this.env.keycloakClientId) faltando.push('KEYCLOAK_CLIENT_ID');

    if (!this.env.keycloakClientSecret || this.env.keycloakClientSecret.includes('COLE_AQUI')) {
      faltando.push('KEYCLOAK_CLIENT_SECRET');
    }

    if (!this.env.keycloakUsername) faltando.push('KEYCLOAK_USERNAME');
    if (!this.env.keycloakPassword) faltando.push('KEYCLOAK_PASSWORD');
    if (!this.env.keycloakResponseType) faltando.push('KEYCLOAK_RESPONSE_TYPE');
    if (!this.env.keycloakScope) faltando.push('KEYCLOAK_SCOPE');

    if (faltando.length > 0) {
      throw new Error(`[KEYCLOAK] Configuracao ausente ou placeholder no .env.local: ${faltando.join(', ')}`);
    }
  }

  private async fetchComTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, this.timeoutMs);

    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  private juntarUrl(baseUrl: string, path: string): string {
    const base = baseUrl.trim().replace(/\/+$/, '');
    const endpoint = path.trim().replace(/^\/+/, '');

    return `${base}/${endpoint}`;
  }

  private parseJson<T>(text: string): T | null {
    if (!text.trim()) return null;

    try {
      return JSON.parse(text) as T;
    } catch {
      return null;
    }
  }

  private formatarErro(error: unknown): string {
    if (error instanceof Error) {
      const causa = (error as Error & { cause?: unknown }).cause;

      if (causa) {
        return `${error.name}: ${error.message}. Cause: ${String(causa)}`;
      }

      return `${error.name}: ${error.message}`;
    }

    return String(error);
  }
}

export const authApi = new AuthApi();