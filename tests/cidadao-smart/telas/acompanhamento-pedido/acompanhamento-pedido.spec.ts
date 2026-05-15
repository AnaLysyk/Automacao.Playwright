import { test } from '../../../../support/fixtures/test';
import { resolverCaptchaSePermitido } from '../../../../support/captcha/captcha.helper';
import { acompanhamentoPedidoData } from './acompanhamento-pedido.data';
import { AcompanhamentoPedidoFlow } from './acompanhamento-pedido.flow';

test.describe('Cidadao Smart - Acompanhamento de pedido', () => {
  test('deve exibir campos de consulta', async ({ page }) => {
    const acompanhamento = new AcompanhamentoPedidoFlow(page);

    await acompanhamento.acessar();
    test.skip(!(await acompanhamento.telaVisivel()), 'Consulta de pedido nao abriu a tela esperada neste ambiente.');
    await acompanhamento.validarTela();
  });

  test('deve validar obrigatoriedade sem preencher campos', async ({ page }) => {
    const acompanhamento = new AcompanhamentoPedidoFlow(page);

    await acompanhamento.acessar();
    test.skip(!(await acompanhamento.telaVisivel()), 'Consulta de pedido nao abriu a tela esperada neste ambiente.');
    await acompanhamento.tentarProsseguir();
    await acompanhamento.validarCamposObrigatorios();
  });

  test('deve permanecer na consulta para protocolo invalido', async ({ page }, testInfo) => {
    const acompanhamento = new AcompanhamentoPedidoFlow(page);

    await acompanhamento.acessar();
    test.skip(!(await acompanhamento.telaVisivel()), 'Consulta de pedido nao abriu a tela esperada neste ambiente.');
    await acompanhamento.preencherConsulta(acompanhamentoPedidoData.protocoloInvalido, acompanhamentoPedidoData.dataNascimento);
    await resolverCaptchaSePermitido(page, testInfo);
    await acompanhamento.tentarProsseguir();

    await acompanhamento.validarPermaneceNaConsulta();
  });
});
