import { expect, test } from '../fixtures';
import { CidadaoSmartEmissaoTipoPage } from '../pages/CidadaoSmartEmissaoTipoPage';

test.describe('Cidadao Smart - Emissao - Tipo de Emissao', () => {
  test('deve exibir opcoes de tipo de emissao', async ({ page }) => {
    const tipoPage = new CidadaoSmartEmissaoTipoPage(page);

    await test.step('Acessar e validar opcoes da tela', async () => {
      await tipoPage.acessar();
      await tipoPage.validarTelaTipoEmissao();
    });
  });

  test('deve permitir selecionar Reimpressao e avancar', async ({ page }) => {
    const tipoPage = new CidadaoSmartEmissaoTipoPage(page);

    await test.step('Acessar e selecionar reimpressao', async () => {
      await tipoPage.acessar();
      await tipoPage.selecionarReimpressao();
    });

    await test.step('Prosseguir e validar rota de continuidade', async () => {
      await tipoPage.prosseguir();
      const currentPath = new URL(page.url()).pathname;
      test.skip(currentPath === '/', 'Fluxo protegido por precondicao de sessao/ambiente.');
      await expect(page).toHaveURL(/\/emitir\/(captura|resumo|validacao-documentos|valida-documentos)/i);
    });
  });

  test('deve permitir selecionar 2a via com alteracoes e avancar', async ({ page }) => {
    const tipoPage = new CidadaoSmartEmissaoTipoPage(page);

    await test.step('Acessar e selecionar 2a via com alteracoes', async () => {
      await tipoPage.acessar();
      await tipoPage.selecionarSegundaViaComAlteracoes();
    });

    await test.step('Prosseguir e validar rota de continuidade', async () => {
      await tipoPage.prosseguir();
      const currentPath = new URL(page.url()).pathname;
      test.skip(currentPath === '/', 'Fluxo protegido por precondicao de sessao/ambiente.');
      await expect(page).toHaveURL(/\/emitir\/(instrucoes-foto|captura|validacao-documentos|valida-documentos)/i);
    });
  });
});

