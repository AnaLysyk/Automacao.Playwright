import { expect, test } from '../../../../support/fixtures/test';
import { loadEnv } from '../../../../support/config/env';

const env = loadEnv();

function basicAuth(user: string, password: string): string {
  return Buffer.from(`${user}:${password}`).toString('base64');
}

test.describe('Booking API - diagnostico autenticacao', () => {
  test('testar POST com Basic Auth', async ({ request }) => {
    const payload = {
      name: env.nomeRequerenteBooking,
      birthDate: env.dataNascimentoRequerente,
      serviceStationId: Number(env.servicePointId),
    };

    const response = await request.post(`${env.bookingApiBaseUrl}${env.bookingCreateAppointmentPath}`, {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Basic ${basicAuth(env.apiTokenUserName, env.apiTokenUserPassword)}`,
        'x-operator-cpf': env.xOperatorCpf,
      },
      data: payload,
    });

    const text = await response.text();

    console.log('\n[AUTH][MODO]', 'Basic Auth');
    console.log('[AUTH][URL]', `${env.bookingApiBaseUrl}${env.bookingCreateAppointmentPath}`);
    console.log('[AUTH][STATUS]', response.status());
    console.log('[AUTH][PAYLOAD]', JSON.stringify(payload, null, 2));
    console.log('[AUTH][BODY]', text);

    expect(response.status()).not.toBe(0);
  });

  test('testar POST sem Authorization e apenas x-operator-cpf', async ({ request }) => {
    const payload = {
      name: env.nomeRequerenteBooking,
      birthDate: env.dataNascimentoRequerente,
      serviceStationId: Number(env.servicePointId),
    };

    const response = await request.post(`${env.bookingApiBaseUrl}${env.bookingCreateAppointmentPath}`, {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'x-operator-cpf': env.xOperatorCpf,
      },
      data: payload,
    });

    const text = await response.text();

    console.log('\n[AUTH][MODO]', 'Sem Authorization');
    console.log('[AUTH][URL]', `${env.bookingApiBaseUrl}${env.bookingCreateAppointmentPath}`);
    console.log('[AUTH][STATUS]', response.status());
    console.log('[AUTH][PAYLOAD]', JSON.stringify(payload, null, 2));
    console.log('[AUTH][BODY]', text);

    expect(response.status()).not.toBe(0);
  });
});
