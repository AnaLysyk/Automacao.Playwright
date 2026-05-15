import { test } from '../../../support/fixtures/test';
import { EmissaoOnlineFlow } from './emissao-online.flow';

test.describe('Cidadao Smart - Emissao online', () => {
  test('deve exibir entrada de CPF', async ({ page }) => {
    const emissao = new EmissaoOnlineFlow(page);

    await emissao.acessarEntradaCpf();
    await emissao.validarEntradaCpf();
  });

  test('deve validar captura facial quando houver foto de teste', async ({ page }) => {
    const emissao = new EmissaoOnlineFlow(page);

    await emissao.acessarCapturaFacial();
    await emissao.validarCapturaFacial();
    await emissao.enviarFotoValida();
    await emissao.confirmarFoto();
  });

  test('deve exibir resumo quando a precondicao existir', async ({ page }) => {
    const emissao = new EmissaoOnlineFlow(page);

    await emissao.acessarResumo();
    test.skip(!(await emissao.resumoDisponivel()), 'Resumo depende de sessao/fluxo previo no ambiente.');
    await emissao.validarResumo();
  });
});
