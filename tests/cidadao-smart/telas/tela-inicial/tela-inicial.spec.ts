import { test } from '../../../../support/fixtures/test';
import { TelaInicialFlow } from './tela-inicial.flow';

test.describe('Cidadao Smart - Tela inicial', () => {
  test('deve carregar conteudo visivel', async ({ page }) => {
    const telaInicial = new TelaInicialFlow(page);

    await telaInicial.acessar();
    await telaInicial.validarConteudoVisivel();
  });
});
