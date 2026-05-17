import { BaseApiClient, type ApiResult } from './base.api';
import { authApi } from './auth.api';
import { loadEnv } from '../config/env';

export type Posto = {
  id?: number;
  description?: string;
  type?: string;
  cityName?: string;
  uf?: string;
  mandatoryInvestigation?: boolean;
  [key: string]: unknown;
};

type ListaPostosResponse = {
  content?: Posto[];
};

type BuscarPostosParams = {
  filter?: string;
  pageNumber?: number;
  pageSize?: number;
  types?: string;
};

export class BookingApi extends BaseApiClient {
  private readonly env = loadEnv();
  private tokenKeycloakEmMemoria = '';
  private tokenInternoEmMemoria = '';

  constructor() {
    const env = loadEnv();

    super({
      baseUrl: env.bookingApiBaseUrl,
      token: '',
    });
  }

  private async obterTokenKeycloak(): Promise<string> {
    if (this.tokenKeycloakEmMemoria) {
      return this.tokenKeycloakEmMemoria;
    }

    this.tokenKeycloakEmMemoria = await authApi.gerarTokenKeycloak();
    return this.tokenKeycloakEmMemoria;
  }

  private async obterTokenInterno(): Promise<string> {
    if (this.tokenInternoEmMemoria) {
      return this.tokenInternoEmMemoria;
    }

    this.tokenInternoEmMemoria = await authApi.gerarTokenInterno();
    return this.tokenInternoEmMemoria;
  }

  private async headersKeycloak(): Promise<Record<string, string>> {
    const token = await this.obterTokenKeycloak();

    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-operator-cpf': this.env.xOperatorCpf,
    };
  }

  private async headersInternosGet(): Promise<Record<string, string>> {
    const token = await this.obterTokenInterno();

    return {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'x-operator-cpf': this.env.xOperatorCpf,
    };
  }

  async listarPostosPorTipo<T = ListaPostosResponse>(
    params: BuscarPostosParams = {},
  ): Promise<ApiResult<T>> {
    const query = new URLSearchParams();

    query.set('filter', params.filter ?? '');
    query.set('pageNumber', String(params.pageNumber ?? 0));
    query.set('pageSize', String(params.pageSize ?? 20));
    query.set('types', params.types ?? 'SERVICE,PICKUP,SERVICE_PICKUP');

    const path = `/api/stations/filter?${query.toString()}`;

    const response = await this.get<T>(path, await this.headersInternosGet());

    const body = response.body as ListaPostosResponse | undefined;
    const totalPostos = body?.content?.length ?? 0;
    const filtro = params.filter || 'sem filtro';

    if (this.deveLogarDetalheApi()) {
      this.logResumoApi('POSTOS', 'GET', response, `encontrados=${totalPostos} | filtro=${filtro}`);
    }

    if (!this.statusEhSucesso(response.status) && this.deveLogarDetalheApi()) {
      this.logErroApi('POSTOS', response);
    }

    return response;
  }

  async buscarPostoDisponivelParaTeste(params: BuscarPostosParams = {}): Promise<Posto> {
    const response = await this.listarPostosPorTipo<ListaPostosResponse>({
      filter: params.filter ?? 'top tower',
      pageNumber: params.pageNumber ?? 0,
      pageSize: params.pageSize ?? 20,
      types: params.types ?? 'SERVICE,PICKUP,SERVICE_PICKUP',
    });

    if (![200, 201].includes(response.status)) {
      throw new Error(
        [
          '[POSTOS] Falha ao buscar postos disponíveis para o teste.',
          `Status: ${response.status}`,
          `Body: ${JSON.stringify(response.body, null, 2)}`,
          `Text: ${response.text}`,
        ].join('\n'),
      );
    }

    const postos = response.body?.content ?? [];

    if (postos.length === 0) {
      throw new Error(
        [
          '[POSTOS] Nenhum posto retornado para o filtro informado.',
          `Filtro: ${params.filter ?? 'top tower'}`,
          `Types: ${params.types ?? 'SERVICE,PICKUP,SERVICE_PICKUP'}`,
          `Body: ${JSON.stringify(response.body, null, 2)}`,
        ].join('\n'),
      );
    }

    const postoPreferencial = postos.find((item) => {
      const descricao = this.normalizarTexto(item.description);
      const tipo = this.normalizarTexto(item.type);

      return tipo === 'service_pickup' && descricao.includes('top tower') && Boolean(item.id);
    });

    const postoServicePickup = postos.find((item) => {
      const tipo = this.normalizarTexto(item.type);

      return tipo === 'service_pickup' && Boolean(item.id);
    });

    const postoComId = postos.find((item) => Boolean(item.id));

    const postoSelecionado = postoPreferencial ?? postoServicePickup ?? postoComId;

    if (!postoSelecionado?.id) {
      throw new Error(
        [
          '[POSTOS] Nenhum posto válido encontrado para o teste.',
          'Era esperado ao menos um posto com id.',
          `Body: ${JSON.stringify(response.body, null, 2)}`,
        ].join('\n'),
      );
    }

    if (this.deveLogarDetalheApi()) {
      console.log(`[POSTOS] SELECIONADO | ${this.formatarPostoParaLog(postoSelecionado)}`);
    }

    return postoSelecionado;
  }

  async buscarPostoParaTeste(): Promise<Posto> {
    return this.buscarPostoDisponivelParaTeste({
      filter: 'top tower',
      pageNumber: 0,
      pageSize: 20,
      types: 'SERVICE,PICKUP,SERVICE_PICKUP',
    });
  }

  async criarAgendamentoComPostoAutomatico<T = unknown>(
    payloadBase: Record<string, unknown>,
  ): Promise<ApiResult<T>> {
    const posto = await this.buscarPostoDisponivelParaTeste();

    const payload = {
      ...payloadBase,
      pickupStationId: posto.id,
    };

    if (this.deveLogarDetalheApi()) {
      console.log(`[BOOKING] POST com posto automático | pickupStationId=${posto.id}`);
    }

    return this.criarAgendamento<T>(payload);
  }

  async criarAgendamento<T = unknown>(payload: unknown): Promise<ApiResult<T>> {
    const path = '/api/v1/citizen-booking/processes/express';

    const response = await this.post<T>(path, payload, await this.headersKeycloak());

    const protocolo = this.obterCampoTexto(response.body, 'protocol');
    const detalhe = protocolo ? `protocolo=${protocolo}` : undefined;

    if (this.deveLogarDetalheApi()) {
      this.logResumoApi('BOOKING_CRIACAO', 'POST', response, detalhe);
    }

    if (!this.statusEhSucesso(response.status) && this.deveLogarDetalheApi()) {
      console.log('[BOOKING_CRIACAO][ERRO][PAYLOAD]', JSON.stringify(payload, null, 2));
      this.logErroApi('BOOKING_CRIACAO', response);
    }

    return response;
  }

  async consultarAgendamento<T = unknown>(protocolo: string): Promise<ApiResult<T>> {
    const path = this.buildPath('/api/v1/citizen-booking/processes/{protocolo}', {
      id: protocolo,
      protocolo,
      protocol: protocolo,
    });

    return this.get<T>(path, await this.headersKeycloak());
  }

  async cancelarAgendamento<T = unknown>(protocolo: string): Promise<ApiResult<T>> {
    const path = this.buildPath('/api/v1/citizen-booking/processes/{protocolo}', {
      id: protocolo,
      protocolo,
      protocol: protocolo,
    });

    return this.requestByMethod<T>('DELETE', path, undefined, await this.headersKeycloak());
  }

  private statusEhSucesso(status: number): boolean {
    return status >= 200 && status < 300;
  }

  private deveLogarDetalheApi(): boolean {
    const valor = process.env.DEBUG_MODE || process.env.API_DEBUG || '';

    return ['1', 'true', 'sim', 'yes'].includes(valor.trim().toLowerCase());
  }

  private logResumoApi(
    contexto: string,
    metodo: string,
    response: ApiResult<unknown>,
    detalhe?: string,
  ): void {
    const detalheFormatado = detalhe ? ` | ${detalhe}` : '';

    console.log(`[${contexto}] ${metodo} ${response.status} | ${response.url}${detalheFormatado}`);
  }

  private logErroApi(contexto: string, response: ApiResult<unknown>): void {
    console.log(`[${contexto}][ERRO][BODY]`, JSON.stringify(response.body, null, 2));
    console.log(`[${contexto}][ERRO][TEXT]`, response.text);
  }

  private obterCampoTexto(body: unknown, campo: string): string {
    if (!body || typeof body !== 'object') {
      return '';
    }

    const valor = (body as Record<string, unknown>)[campo];

    return typeof valor === 'string' ? valor : '';
  }

  private formatarPostoParaLog(posto: Posto): string {
    const id = posto.id ?? 'sem id';
    const descricao = posto.description || 'sem descrição';
    const cidadeUf =
      posto.cityName && posto.uf ? `${posto.cityName}/${posto.uf}` : 'cidade/UF não informado';
    const tipo = posto.type || 'tipo não informado';

    return `id=${id} | ${descricao} | ${cidadeUf} | ${tipo}`;
  }

  private normalizarTexto(valor: unknown): string {
    return String(valor ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}

export const bookingApi = new BookingApi();
