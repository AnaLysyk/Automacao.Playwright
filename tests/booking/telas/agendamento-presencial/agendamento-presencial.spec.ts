import { test } from '../../../../support/fixtures/test';
import { AgendamentoPresencialFlow } from './agendamento-presencial.flow';

test.describe('Booking - Agendamento presencial', () => {
  test('@manual-assisted deve executar fluxo completo de agendamento', async ({ page }, testInfo) => {
    const agendamento = new AgendamentoPresencialFlow(page);

    const protocolo = await agendamento.executarFluxoCompleto(testInfo);

    testInfo.annotations.push({
      type: 'protocolo',
      description: protocolo || 'Protocolo nao capturado automaticamente.',
    });
  });
});
