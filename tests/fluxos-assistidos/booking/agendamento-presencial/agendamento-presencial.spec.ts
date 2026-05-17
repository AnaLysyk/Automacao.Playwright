import { test } from '../../../../support/fixtures/test';
import { AgendamentoPresencialFlow } from './agendamento-presencial.flow';

test.describe('Booking - Agendamento presencial', () => {
  test('@manual-assisted deve executar agendamento presencial assistido', async ({ page }, testInfo) => {
    const agendamento = new AgendamentoPresencialFlow(page);
    const protocolo = await agendamento.executarFluxoAssistido(testInfo);

    testInfo.annotations.push({
      type: 'protocolo',
      description: protocolo || 'Protocolo nao capturado automaticamente.',
    });
  });
});
