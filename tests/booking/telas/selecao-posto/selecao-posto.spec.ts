import { test } from '../../../../support/fixtures/test';
import { selecaoPostoData } from './selecao-posto.data';
import { SelecaoPostoFlow } from './selecao-posto.flow';

test.describe('Booking - Selecao de posto', () => {
  test('deve exibir busca por cidade e posto', async ({ page }) => {
    const selecaoPosto = new SelecaoPostoFlow(page);

    await selecaoPosto.acessar();
    await selecaoPosto.validarTela();
    await selecaoPosto.buscarCidade(selecaoPostoData.cidade);
  });
});
