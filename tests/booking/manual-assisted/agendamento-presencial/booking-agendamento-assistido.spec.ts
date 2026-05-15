import { test } from '@playwright/test';
import { BookingAgendamentoAssistidoAgent } from '@support/agents/BookingAgendamentoAssistidoAgent';

test('@booking @manual-assisted @e2e agendamento presencial assistido', async ({ page }) => {
  const agent = new BookingAgendamentoAssistidoAgent(page);
  await agent.executarFluxoCompleto();
});
