import { test } from '../../../support/fixtures/test';
import { cidadaoSmartApi } from '../../../support/api/cidadao-smart.api';

test.describe('API - Cidadao Smart', () => {
  test('deve consultar pedido quando API e protocolo estiverem configurados', async ({ env }) => {
    const protocolo = process.env.CIDADAO_SMART_TEST_PROTOCOL || '';

    test.skip(!env.cidadaoSmartApiBaseUrl, 'CIDADAO_SMART_API_BASE_URL nao configurada.');
    test.skip(!protocolo, 'CIDADAO_SMART_TEST_PROTOCOL nao configurado.');

    await cidadaoSmartApi.consultarPedido<unknown>(protocolo);
  });
});
