import { expect, test } from '@playwright/test';
import { ApiHelper } from '@support/helpers/ApiHelper';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const STATUS_INVALIDO = [400, 422];
const STATUS_NAO_AUTORIZADO = [401, 403];
const STATUS_CRIADO = [201];

async function obterTokenConfigurado(request: Parameters<typeof ApiHelper.getConfiguredToken>[0]): Promise<string | undefined> {
  try {
    return await ApiHelper.getConfiguredToken(request);
  } catch (error) {
    console.warn(`[API] Nao foi possivel obter token configurado: ${String(error)}`);
    return undefined;
  }
}

function exigirToken(token: string | undefined): asserts token is string {
  test.skip(!token, 'Configure API_TOKEN ou credenciais Keycloak para testar endpoints autenticados.');
}

function headersComToken(token: string): Record<string, string> {
  return {
    ...ApiHelper.getDefaultHeaders(),
    Authorization: `Bearer ${token}`,
  };
}

test.describe('@api @booking processos', () => {
  test('[API-BOOK-AUTH-401] abertura pelo Booking deve exigir Authorization', async ({ request }) => {
    test.skip(!ApiHelper.getApiBaseUrl(), 'Configure API_BASE_URL ou CIDADAO_SMART_BASE_URL no .env.local.');

    const response = await request.post(ApiHelper.buildApiUrl('/api/v1/booking/processes'), {
      headers: ApiHelper.getDefaultHeaders(),
      data: {},
    });

    expect(STATUS_NAO_AUTORIZADO).toContain(response.status());
  });

  test('[API-BOOK-PROC-400] abertura pelo Booking deve rejeitar payload vazio', async ({ request }) => {
    test.skip(!ApiHelper.getApiBaseUrl(), 'Configure API_BASE_URL ou CIDADAO_SMART_BASE_URL no .env.local.');
    test.skip(!process.env.X_OPERATOR_CPF, 'Configure X_OPERATOR_CPF para testar endpoints de abertura.');

    const token = await obterTokenConfigurado(request);
    exigirToken(token);

    const response = await request.post(ApiHelper.buildApiUrl('/api/v1/booking/processes'), {
      headers: headersComToken(token),
      data: {},
    });

    expect(STATUS_INVALIDO).toContain(response.status());
  });

  test('[API-BOOK-PROC-001] abre processo pelo Booking somente com escrita liberada', async ({ request }) => {
    test.skip(process.env.API_WRITE_ENABLED !== 'true', 'Escrita bloqueada. Use API_WRITE_ENABLED=true somente em QA controlado.');
    test.skip(!process.env.X_OPERATOR_CPF, 'Configure X_OPERATOR_CPF para testar endpoints de abertura.');
    test.skip(!process.env.API_BOOKING_PROCESS_NAME, 'Configure API_BOOKING_PROCESS_NAME com nome de massa controlada.');
    test.skip(!process.env.API_BOOKING_PROCESS_BIRTH_DATE, 'Configure API_BOOKING_PROCESS_BIRTH_DATE no formato YYYY-MM-DD.');
    test.skip(!process.env.API_SERVICE_STATION_ID, 'Configure API_SERVICE_STATION_ID com o posto do Booking.');

    const token = await obterTokenConfigurado(request);
    exigirToken(token);

    const response = await request.post(ApiHelper.buildApiUrl('/api/v1/booking/processes'), {
      headers: headersComToken(token),
      data: {
        name: process.env.API_BOOKING_PROCESS_NAME,
        cpf: process.env.API_BOOKING_PROCESS_CPF || undefined,
        birthDate: process.env.API_BOOKING_PROCESS_BIRTH_DATE,
        serviceStationId: Number(process.env.API_SERVICE_STATION_ID),
      },
    });

    expect(STATUS_CRIADO).toContain(response.status());

    const body = await response.json();
    expect(body.protocol).toMatch(/^\d+$/);
  });
});
