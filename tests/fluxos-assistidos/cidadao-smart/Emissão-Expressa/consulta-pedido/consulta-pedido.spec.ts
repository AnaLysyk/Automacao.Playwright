import { expect, test } from '../../../../../support/fixtures/test';
import { ConsultaPedidoFlow } from './consulta-pedido.flow';

test.describe('Cidadao Smart - Consulta de pedido assistida', () => {
  test('@manual-assisted @cidadao-smart @via-expressa @consulta-pedido deve exibir campos de consulta', async ({
    page,
  }) => {
    const consulta = new ConsultaPedidoFlow(page);

    await test.step('1. Acessar consulta de protocolo', async () => {
      await consulta.acessar();
    });

    await test.step('2. Validar campos da consulta', async () => {
      expect(await consulta.camposVisiveis()).toBeTruthy();
    });
  });

  test('@manual-assisted @cidadao-smart @via-expressa @consulta-pedido deve validar campos obrigatorios', async ({
    page,
  }) => {
    const consulta = new ConsultaPedidoFlow(page);

    await test.step('1. Acessar consulta de protocolo', async () => {
      await consulta.acessar();
    });

    await test.step('2. Acionar validacao de obrigatoriedade', async () => {
      const resultado = await consulta.acionarValidacaoObrigatoria();

      expect(
        resultado.botaoDesabilitado || resultado.mensagemObrigatoriaVisivel,
        'A consulta deve bloquear envio vazio ou exibir mensagem de campo obrigatorio.',
      ).toBeTruthy();
    });
  });

  test('@manual-assisted @cidadao-smart @via-expressa @consulta-pedido deve permanecer na consulta para protocolo invalido', async ({
    page,
  }, testInfo) => {
    const consulta = new ConsultaPedidoFlow(page);

    await test.step('1. Acessar consulta de protocolo', async () => {
      await consulta.acessar();
    });

    await test.step('2. Consultar protocolo invalido', async () => {
      const resultado = await consulta.consultarProtocoloInvalido(testInfo);

      await testInfo.attach('consulta-protocolo-invalido.json', {
        body: JSON.stringify(resultado, null, 2),
        contentType: 'application/json',
      });

      expect(resultado.permaneceuNaConsulta).toBeTruthy();
    });
  });
});
