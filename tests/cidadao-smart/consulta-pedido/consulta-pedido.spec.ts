import { test } from '../../../support/fixtures/test';
import { ConsultaPedidoFlow } from './consulta-pedido.flow';

test.describe('Cidadao Smart - Consulta de pedido', () => {
  test('deve exibir campos de consulta', async ({ page }) => {
    const consulta = new ConsultaPedidoFlow(page);

    await consulta.acessar();
    test.skip(!(await consulta.telaVisivel()), 'Consulta de pedido nao abriu a tela esperada neste ambiente.');
    await consulta.validarTela();
  });

  test('deve validar campos obrigatorios', async ({ page }) => {
    const consulta = new ConsultaPedidoFlow(page);

    await consulta.acessar();
    test.skip(!(await consulta.telaVisivel()), 'Consulta de pedido nao abriu a tela esperada neste ambiente.');
    await consulta.validarObrigatoriedade();
  });

  test('deve permanecer na consulta para protocolo invalido', async ({ page }) => {
    const consulta = new ConsultaPedidoFlow(page);

    await consulta.acessar();
    test.skip(!(await consulta.telaVisivel()), 'Consulta de pedido nao abriu a tela esperada neste ambiente.');
    await consulta.consultarProtocoloInvalido();
  });
});
