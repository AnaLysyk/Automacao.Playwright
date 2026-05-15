import { test } from '../../../../support/fixtures/test';
import { SelecaoDataHorarioFlow } from './selecao-data-horario.flow';

test.describe('Booking - Selecao de data e horario', () => {
  test('deve reconhecer tela de data e hora quando precondicao existir', async ({ page }) => {
    const dataHorario = new SelecaoDataHorarioFlow(page);

    await dataHorario.acessarDireto();
    test.skip(!(await dataHorario.estaNaTela()), 'Tela depende da selecao previa de posto.');
    await dataHorario.validarTela();
  });
});
