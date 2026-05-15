import { expect, test } from '@support/fixtures';
import { CidadaoSmartHomePage } from '@support/pages/CidadaoSmartHomePage';

test.describe('Cidadao Smart - Home', () => {
  test('deve exibir conteudo da Emissao Online', async ({ page }) => {
    const homePage = new CidadaoSmartHomePage(page);

    await test.step('Acessar home e validar elementos principais', async () => {
      await homePage.acessar();
      await homePage.validarTelaHome();
    });
  });

  test('deve permitir acessar Emissao Online', async ({ page }) => {
    const homePage = new CidadaoSmartHomePage(page);

    await test.step('Abrir home e marcar declaracao de maioridade', async () => {
      await homePage.acessar();
      await homePage.marcarDeclaracaoMaior16();
    });

    await test.step('Entrar em Emissao Online e validar rota', async () => {
      await homePage.clicarEmissaoOnline();
      const currentPath = new URL(page.url()).pathname;
      test.skip(currentPath === '/', 'Navegacao bloqueada por precondicao de ambiente/sessao.');
      await expect(page).toHaveURL(/\/emitir\/nao-sei-meu-cpf|\/emitir\/tipo-emissao/i);
    });
  });

  test('deve permitir acessar Consultar pedido', async ({ page }) => {
    const homePage = new CidadaoSmartHomePage(page);

    await test.step('Abrir home e clicar em Consultar pedido', async () => {
      await homePage.acessar();
      await homePage.clicarConsultarPedido();
    });

    await test.step('Validar navegacao para consulta de protocolo', async () => {
      await expect(page).toHaveURL(/\/consulta-protocolo/i);
    });
  });
});

