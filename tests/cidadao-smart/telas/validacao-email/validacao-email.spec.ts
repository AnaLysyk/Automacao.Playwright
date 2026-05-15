import { test } from '../../../../support/fixtures/test';
import { ValidacaoEmailFlow } from './validacao-email.flow';

test.describe('Cidadao Smart - Validacao por e-mail', () => {
  test('deve exibir entrada de CPF da emissao online', async ({ page }) => {
    const validacao = new ValidacaoEmailFlow(page);

    await validacao.acessarEntradaEmissao();
    await validacao.validarEntradaCpf();
  });
});
