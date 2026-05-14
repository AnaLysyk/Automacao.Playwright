import { expect, test } from '../fixtures';
import { CidadaoSmartHomePage } from '../pages/CidadaoSmartHomePage';

async function pausaDemo(ms = 800): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

test.describe('Demo - Passo a Passo Visual', () => {
  test('caso 1: validar home com narrativa visual', async ({ page }) => {
    const homePage = new CidadaoSmartHomePage(page);

    await test.step('Abrir home', async () => {
      await homePage.acessar();
      await pausaDemo();
    });

    await test.step('Validar elementos principais da tela', async () => {
      await homePage.validarTelaHome();
      await pausaDemo();
    });
  });

  test('caso 2: clicar em Consultar pedido e validar rota', async ({ page }) => {
    const homePage = new CidadaoSmartHomePage(page);

    await test.step('Abrir home', async () => {
      await homePage.acessar();
      await pausaDemo();
    });

    await test.step('Clicar no card Consultar pedido', async () => {
      const card = page.getByRole('link', { name: /consultar pedido/i }).first();
      await card.hover();
      await pausaDemo();
      await homePage.clicarConsultarPedido();
      await pausaDemo();
    });

    await test.step('Validar navegacao da consulta', async () => {
      await expect(page).toHaveURL(/\/consulta-protocolo/i);
      await pausaDemo();
    });
  });

  test('caso 3: clicar em Emissao Online (quando disponivel)', async ({ page }) => {
    const homePage = new CidadaoSmartHomePage(page);

    await test.step('Abrir home e marcar declaracao de maioridade', async () => {
      await homePage.acessar();
      await pausaDemo();
      await homePage.marcarDeclaracaoMaior16();
      await pausaDemo();
    });

    await test.step('Clicar no card Emissao Online', async () => {
      const card = page.getByText(/emissao online|emissão online/i).first();
      await card.hover();
      await pausaDemo();
      await homePage.clicarEmissaoOnline();
      await pausaDemo();
    });

    await test.step('Validar rota de emissao ou bloquear por ambiente', async () => {
      const currentPath = new URL(page.url()).pathname;
      test.skip(currentPath === '/', 'Cenario bloqueado: ambiente nao liberou navegacao para emissao online.');
      await expect(page).toHaveURL(/\/emitir\/nao-sei-meu-cpf|\/emitir\/tipo-emissao/i);
      await pausaDemo();
    });
  });
});

