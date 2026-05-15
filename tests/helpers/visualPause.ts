import { Page } from '@playwright/test';

type VisualPauseOptions = {
  timeoutMs?: number;
  failIfBrowserClosed?: boolean;
};

/**
 * Pausa visual para fluxos assistidos.
 *
 * Usado quando o QA precisa interagir manualmente com o navegador:
 * - resolver CAPTCHA;
 * - preencher código recebido por e-mail;
 * - confirmar uma etapa manual;
 * - validar visualmente uma tela antes de continuar.
 *
 * Em execução manual assistida, o ideal é usar page.pause().
 * Se o Inspector não abrir, aplica fallback com tempo maior.
 */
export async function visualPause(
  page: Page,
  message = 'Aguardando ação manual no browser',
  options: VisualPauseOptions = {}
): Promise<void> {
  const timeoutMs =
    options.timeoutMs ||
    Number(process.env.MANUAL_PAUSE_FALLBACK_MS || 300_000);

  const failIfBrowserClosed = options.failIfBrowserClosed ?? true;

  console.log('');
  console.log('============================================================');
  console.log('[PAUSA MANUAL]');
  console.log(message);
  console.log('');
  console.log('Ações esperadas:');
  console.log('1. Faça a ação manual no navegador.');
  console.log('2. Clique em Verificar/Prosseguir quando necessário.');
  console.log('3. Depois clique em Resume no Playwright Inspector.');
  console.log('============================================================');
  console.log('');

  if (page.isClosed()) {
    const errorMessage = '[PAUSA MANUAL] A página já está fechada. Não é possível pausar.';

    if (failIfBrowserClosed) {
      throw new Error(errorMessage);
    }

    console.warn(errorMessage);
    return;
  }

  await page.bringToFront().catch(() => undefined);
  await page.waitForLoadState('domcontentloaded').catch(() => undefined);

  try {
    await page.pause();
    return;
  } catch (error) {
    if (page.isClosed()) {
      const errorMessage =
        '[PAUSA MANUAL] O navegador foi fechado durante a tentativa de pausa.';

      if (failIfBrowserClosed) {
        throw new Error(errorMessage);
      }

      console.warn(errorMessage);
      return;
    }

    console.warn(
      `[PAUSA MANUAL] Não foi possível abrir o Playwright Inspector. ` +
        `Aplicando fallback de ${timeoutMs}ms.`,
      error
    );

    await page.waitForTimeout(timeoutMs);
  }
}