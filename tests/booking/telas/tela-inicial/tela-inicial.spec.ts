import { test } from '../../../../support/fixtures/test';
import { BookingTelaInicialFlow } from './tela-inicial.flow';

test.describe('Booking - Tela inicial', () => {
  test('deve carregar tela inicial de agendamento', async ({ page }) => {
    const telaInicial = new BookingTelaInicialFlow(page);

    await telaInicial.acessar();
    await telaInicial.validarCarregamento();
  });
});
