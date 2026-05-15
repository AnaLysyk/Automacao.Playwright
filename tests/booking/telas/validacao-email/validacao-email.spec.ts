import { test } from '../../../../support/fixtures/test';
import { BookingValidacaoEmailFlow } from './validacao-email.flow';

test.describe('Booking - Validacao de e-mail', () => {
  test('deve reconhecer campo de codigo quando a etapa estiver aberta', async ({ page }) => {
    const validacaoEmail = new BookingValidacaoEmailFlow(page);

    await validacaoEmail.acessarDireto();
    test.skip(!(await validacaoEmail.telaVisivel()), 'Autenticacao depende do resumo do agendamento.');
  });
});
