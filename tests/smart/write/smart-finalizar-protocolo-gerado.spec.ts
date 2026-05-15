import { test } from '@playwright/test';
import { SmartProcessAgent } from '@support/agents/SmartProcessAgent';

test.describe('@smart @write @manual-assisted', () => {
  test('finalizar no SMART o ultimo protocolo gerado pelo Booking', async ({ page }) => {
    test.setTimeout(30 * 60 * 1000);

    test.skip(
      process.env.SMART_WRITE_ENABLED !== 'true',
      'Defina SMART_WRITE_ENABLED=true apenas em ambiente controlado para alterar estado no SMART.'
    );

    const agent = new SmartProcessAgent(page);
    const protocolo = await agent.finalizarUltimoProtocoloGerado();

    test.skip(
      protocolo.status !== 'FINALIZED',
      `Processo ${protocolo.protocolo} ainda depende do QA/operador concluir ate FINALIZADO no SMART.`
    );
  });
});
