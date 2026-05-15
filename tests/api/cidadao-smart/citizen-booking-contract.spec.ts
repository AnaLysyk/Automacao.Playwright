import { expect, test } from '@playwright/test';
import { ApiHelper } from '@support/helpers/ApiHelper';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const STATUS_INVALIDO = [400, 422];
const STATUS_NAO_ENCONTRADO = [404];
const STATUS_NAO_AUTORIZADO = [401, 403];
const STATUS_CRIADO = [201];
const STATUS_PROCESSO = ['REVIEW', 'PENDING_CAPTURE', 'AWAITING_PAYMENT', 'PRINTING', 'READY', 'FINALIZED', 'PROCESSING', 'ERROR'];

function apiBaseUrl(): string {
  return ApiHelper.getApiBaseUrl();
}

async function obterTokenConfigurado(request: Parameters<typeof ApiHelper.getConfiguredToken>[0]): Promise<string | undefined> {
  try {
    return await ApiHelper.getConfiguredToken(request);
  } catch (error) {
    console.warn(`[API] Nao foi possivel obter token configurado: ${String(error)}`);
    return undefined;
  }
}

function headersComToken(token: string): Record<string, string> {
  return {
    ...ApiHelper.getDefaultHeaders(),
    Authorization: `Bearer ${token}`,
  };
}

function exigirToken(token: string | undefined): asserts token is string {
  test.skip(!token, 'Configure API_TOKEN ou credenciais Keycloak para testar endpoints autenticados.');
}

test.describe('@api @cidadao-smart citizen-booking', () => {
  test('[API-CID-AUTH-401] consulta de protocolo deve exigir Authorization', async ({ request }) => {
    test.skip(!apiBaseUrl(), 'Configure API_BASE_URL ou CIDADAO_SMART_BASE_URL no .env.local.');

    const protocoloInexistente = process.env.API_INVALID_PROTOCOL || '999999999999';
    const response = await request.get(
      ApiHelper.buildApiUrl(`/api/v1/citizen-booking/processes/${protocoloInexistente}`),
      { headers: ApiHelper.getDefaultHeaders() }
    );

    expect(STATUS_NAO_AUTORIZADO).toContain(response.status());
  });

  test('[API-AUTH-001] deve obter token Keycloak quando credenciais estiverem configuradas', async ({ request }) => {
    test.skip(
      !process.env.KEYCLOAK_TOKEN_URL || !process.env.KEYCLOAK_CLIENT_ID || !process.env.KEYCLOAK_CLIENT_SECRET,
      'Configure KEYCLOAK_TOKEN_URL, KEYCLOAK_CLIENT_ID e KEYCLOAK_CLIENT_SECRET no .env.local.'
    );

    const token = await ApiHelper.getAuthToken(request);

    expect(token).toBeTruthy();
    expect(token.length).toBeGreaterThan(20);
  });

  test('[API-CID-PROC-404] consulta protocolo inexistente deve retornar 404', async ({ request }) => {
    test.skip(!apiBaseUrl(), 'Configure API_BASE_URL ou CIDADAO_SMART_BASE_URL no .env.local.');

    const token = await obterTokenConfigurado(request);
    exigirToken(token);

    const protocoloInexistente = process.env.API_INVALID_PROTOCOL || '999999999999';
    const response = await request.get(
      ApiHelper.buildApiUrl(`/api/v1/citizen-booking/processes/${protocoloInexistente}`),
      { headers: headersComToken(token) }
    );

    expect(STATUS_NAO_ENCONTRADO).toContain(response.status());
  });

  test('[API-CID-PROC-001] consulta protocolo existente deve respeitar contrato minimo', async ({ request }) => {
    test.skip(!apiBaseUrl(), 'Configure API_BASE_URL ou CIDADAO_SMART_BASE_URL no .env.local.');
    test.skip(!process.env.API_VALID_PROTOCOL, 'Configure API_VALID_PROTOCOL com uma massa read-only.');

    const token = await obterTokenConfigurado(request);
    exigirToken(token);

    const response = await request.get(
      ApiHelper.buildApiUrl(`/api/v1/citizen-booking/processes/${process.env.API_VALID_PROTOCOL}`),
      { headers: headersComToken(token) }
    );

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(STATUS_PROCESSO).toContain(body.status);
    expect(typeof body.approved).toBe('boolean');
    expect(typeof body.daePaid).toBe('boolean');
  });

  test('[API-CID-PROC-400] abertura de processo sem CPF deve bloquear payload invalido', async ({ request }) => {
    test.skip(!apiBaseUrl(), 'Configure API_BASE_URL ou CIDADAO_SMART_BASE_URL no .env.local.');
    test.skip(!process.env.X_OPERATOR_CPF, 'Configure X_OPERATOR_CPF para testar endpoints de abertura.');

    const token = await obterTokenConfigurado(request);
    exigirToken(token);

    const response = await request.post(ApiHelper.buildApiUrl('/api/v1/citizen-booking/processes'), {
      headers: headersComToken(token),
      data: {
        name: 'Automacao API Payload Invalido',
        birthDate: '2009-01-01',
      },
    });

    expect(STATUS_INVALIDO).toContain(response.status());
  });

  test('[API-CID-2VIA-CHECK-400] elegibilidade de segunda via deve rejeitar CPF invalido', async ({ request }) => {
    test.skip(!apiBaseUrl(), 'Configure API_BASE_URL ou CIDADAO_SMART_BASE_URL no .env.local.');

    const token = await obterTokenConfigurado(request);
    exigirToken(token);

    const response = await request.post(ApiHelper.buildApiUrl('/api/v1/citizen-booking/processes/second-copy/check'), {
      headers: headersComToken(token),
      data: {
        cpf: '123',
      },
    });

    expect(STATUS_INVALIDO).toContain(response.status());
  });

  test('[API-CID-EXPRESS-400] segunda via expressa deve exigir pickupStationId', async ({ request }) => {
    test.skip(!apiBaseUrl(), 'Configure API_BASE_URL ou CIDADAO_SMART_BASE_URL no .env.local.');
    test.skip(!process.env.X_OPERATOR_CPF, 'Configure X_OPERATOR_CPF para testar endpoints de abertura.');

    const token = await obterTokenConfigurado(request);
    exigirToken(token);

    const response = await request.post(ApiHelper.buildApiUrl('/api/v1/citizen-booking/processes/express'), {
      headers: headersComToken(token),
      data: {
        cpf: process.env.API_SECOND_COPY_CPF || process.env.CIDADAO_SMART_2VIA_FINALIZADA_CPF || '00000000000',
      },
    });

    expect(STATUS_INVALIDO).toContain(response.status());
  });

  test('[API-CID-DAE-400] geracao de DAE deve exigir protocolo', async ({ request }) => {
    test.skip(!apiBaseUrl(), 'Configure API_BASE_URL ou CIDADAO_SMART_BASE_URL no .env.local.');

    const token = await obterTokenConfigurado(request);
    exigirToken(token);

    const response = await request.post(ApiHelper.buildApiUrl('/api/v1/citizen-booking/processes/dae'), {
      headers: headersComToken(token),
      data: {
        generateNewDae: false,
      },
    });

    expect(STATUS_INVALIDO).toContain(response.status());
  });

  test('[API-CID-EXPRESS-001] abre segunda via expressa somente com escrita liberada', async ({ request }) => {
    test.skip(process.env.API_WRITE_ENABLED !== 'true', 'Escrita bloqueada. Use API_WRITE_ENABLED=true somente em QA controlado.');
    test.skip(!process.env.X_OPERATOR_CPF, 'Configure X_OPERATOR_CPF para testar endpoints de abertura.');
    test.skip(!process.env.API_SECOND_COPY_CPF, 'Configure API_SECOND_COPY_CPF com CPF de massa controlada.');
    test.skip(!process.env.API_PICKUP_STATION_ID, 'Configure API_PICKUP_STATION_ID com o posto de retirada.');

    const token = await obterTokenConfigurado(request);
    exigirToken(token);
    const cpf = process.env.API_SECOND_COPY_CPF || '';
    const pickupStationId = Number(process.env.API_PICKUP_STATION_ID);

    const response = await request.post(ApiHelper.buildApiUrl('/api/v1/citizen-booking/processes/express'), {
      headers: headersComToken(token),
      data: {
        cpf,
        pickupStationId,
      },
    });

    expect(STATUS_CRIADO).toContain(response.status());

    const body = await response.json();
    expect(body.protocol).toMatch(/^\d+$/);
  });
});
