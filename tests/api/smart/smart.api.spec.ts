import { test } from '../../../support/fixtures/test';
import { smartApi } from '../../../support/api/smart.api';

test.describe('API - SMART', () => {
  test('deve consultar protocolo quando API e protocolo estiverem configurados', async ({ env }) => {
    const protocolo = process.env.SMART_TEST_PROTOCOL || process.env.CIDADAO_SMART_TEST_PROTOCOL || '';

    test.skip(!env.smartApiBaseUrl, 'SMART_API_BASE_URL nao configurada.');
    test.skip(!protocolo, 'SMART_TEST_PROTOCOL ou CIDADAO_SMART_TEST_PROTOCOL nao configurado.');

    await smartApi.consultarProtocolo<unknown>(protocolo);
  });
});
