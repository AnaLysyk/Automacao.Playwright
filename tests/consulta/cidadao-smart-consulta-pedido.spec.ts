import { expect, test } from '../fixtures';
import { CidadaoSmartConsultaPedidoPage } from '../pages/CidadaoSmartConsultaPedidoPage';
import { handleCaptcha } from '../support/captcha/handleCaptcha';

test.describe('Cidadao Smart - Consulta de Pedido', () => {
  test('deve validar layout da tela', async ({ page }) => {
    const consultaPage = new CidadaoSmartConsultaPedidoPage(page);

    await test.step('Acessar consulta e validar campos', async () => {
      await consultaPage.acessar();
      await consultaPage.validarTelaConsultaPedido();
    });
  });

  test('deve validar obrigatoriedade com campos vazios', async ({ page }) => {
    const consultaPage = new CidadaoSmartConsultaPedidoPage(page);

    await test.step('Acessar consulta', async () => {
      await consultaPage.acessar();
    });

    await test.step('Prosseguir sem preencher para validar erro', async () => {
      await consultaPage.prosseguir();
      await consultaPage.validarErrosObrigatorios();
    });
  });

  test('deve processar tentativa com protocolo invalido', async ({ page }) => {
    const consultaPage = new CidadaoSmartConsultaPedidoPage(page);

    await test.step('Preencher protocolo invalido', async () => {
      await consultaPage.acessar();
      await consultaPage.preencherProtocolo('0000000000');
      await consultaPage.preencherDataNascimento('01/01/1990');
    });

    await test.step('Resolver CAPTCHA e submeter', async () => {
      await handleCaptcha(page);
      await consultaPage.prosseguir();
    });

    await test.step('Validar que nao houve navegação de sucesso', async () => {
      await expect(page).toHaveURL(/\/consulta-protocolo/i);
    });
  });

  test('deve consultar protocolo valido quando houver massa', async ({ page }) => {
    const consultaPage = new CidadaoSmartConsultaPedidoPage(page);
    const protocolo = process.env.CIDADAO_SMART_TEST_PROTOCOL;
    const nascimento = process.env.CIDADAO_SMART_TEST_BIRTH_DATE;

    test.skip(!protocolo || !nascimento, 'Defina CIDADAO_SMART_TEST_PROTOCOL e CIDADAO_SMART_TEST_BIRTH_DATE para este cenario.');

    await test.step('Preencher protocolo e nascimento validos', async () => {
      await consultaPage.acessar();
      await consultaPage.preencherProtocolo(protocolo as string);
      await consultaPage.preencherDataNascimento(nascimento as string);
    });

    await test.step('Resolver CAPTCHA e consultar', async () => {
      await handleCaptcha(page);
      await consultaPage.prosseguir();
    });
  });
});

