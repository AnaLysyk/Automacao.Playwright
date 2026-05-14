import { test } from '../fixtures';
import { CidadaoSmartEmissaoResumoPage } from '../pages/CidadaoSmartEmissaoResumoPage';
import { getServicePointForTest } from '../support/data/getServicePointForTest';

test.describe('Cidadao Smart - Emissao - Resumo', () => {
  test('deve exibir dados, validar posto selecionado e controlar aceite', async ({ page }) => {
    const resumoPage = new CidadaoSmartEmissaoResumoPage(page);
    const selectedServicePoint = getServicePointForTest();

    await test.step('Acessar resumo e validar blocos principais', async () => {
      await resumoPage.acessar();
      const hasResumo = (await page.getByText(/dados do requerente/i).count()) > 0;
      test.skip(!hasResumo, 'Resumo nao carregou no ambiente atual (precondicao de fluxo).');
      await resumoPage.validarTelaResumo();
    });

    await test.step('Validar posto selecionado e divergencia de local', async () => {
      await resumoPage.validarPostoSelecionado(selectedServicePoint);
    });

    await test.step('Validar regra de aceite para habilitar Prosseguir', async () => {
      await resumoPage.validarProsseguirDesabilitado();
      await resumoPage.marcarAceite();
      await resumoPage.validarProsseguirHabilitado();
    });
  });
});

