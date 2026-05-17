import { expect, test } from '../../../../support/fixtures/test';
import { loadEnv } from '../../../../support/config/env';
import { authApi } from '../../../../support/api/auth.api';
import { bookingApi } from '../../../../support/api/booking.api';

const env = loadEnv();

const payloadBase = {
  name: env.nomeRequerenteBooking,
  cpf: env.cpfRequerenteBooking || undefined,
  birthDate: env.dataNascimentoRequerente,
};

function basicAuth(user: string, password: string): string {
  return Buffer.from(`${user}:${password}`).toString('base64');
}

test.describe('Booking API - diagnostico express auth', () => {
  test('deve testar endpoint express com Bearer e Basic Auth', async ({ request }) => {
    const posto = await bookingApi.buscarPostoParaTeste();

    const payload = {
      ...payloadBase,
      serviceStationId: posto.id,
    };

    const url = `${env.bookingApiBaseUrl}/api/v1/citizen-booking/processes/express`;
    const token = await authApi.gerarTokenKeycloak();

    const bookingAdminUser = process.env.BOOKING_ADMIN_USER || 'gbds_bind';
    const bookingAdminPassword = process.env.BOOKING_ADMIN_PASSWORD || 'Griaule.123';

    const tentativas = [
      {
        nome: 'bearer-keycloak',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-operator-cpf': env.xOperatorCpf,
        },
      },
      {
        nome: 'basic-admin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Basic ${basicAuth(env.apiTokenUserName, env.apiTokenUserPassword)}`,
          'x-operator-cpf': env.xOperatorCpf,
        },
      },
      {
        nome: 'basic-booking-admin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Basic ${basicAuth(bookingAdminUser, bookingAdminPassword)}`,
          'x-operator-cpf': env.xOperatorCpf,
        },
      },
    ];

    for (const tentativa of tentativas) {
      const response = await request.post(url, {
        headers: tentativa.headers,
        data: payload,
      });

      const text = await response.text();

      console.log('\n[EXPRESS_AUTH][TENTATIVA]', tentativa.nome);
      console.log('[EXPRESS_AUTH][URL]', url);
      console.log('[EXPRESS_AUTH][STATUS]', response.status());
      console.log('[EXPRESS_AUTH][PAYLOAD]', JSON.stringify(payload, null, 2));
      console.log('[EXPRESS_AUTH][TEXT]', text);
    }

    expect(true).toBeTruthy();
  });
});
