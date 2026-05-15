import { Page } from '@playwright/test';

/**
 * Trata CAPTCHA sem tentar burlar o desafio real.
 * Em modo manual, pausa apenas quando a tela realmente mostra o widget.
 */
export async function handleCaptcha(page: Page): Promise<void> {
  const mode = process.env.CAPTCHA_MODE || 'manual';

  if (mode === 'disabled') {
    console.log('[CAPTCHA] CAPTCHA_MODE=disabled. Aguardando bypass oficial do ambiente.');
    return;
  }

  if (mode === 'test') {
    console.log('[CAPTCHA] CAPTCHA_MODE=test disponivel apenas com suporte oficial de QA.');
    return;
  }

  if (mode !== 'manual') {
    throw new Error(`CAPTCHA_MODE invalido: ${mode}`);
  }

  if (!(await isCaptchaVisivel(page))) {
    return;
  }

  console.log('[CAPTCHA] Resolva o CAPTCHA no navegador. Depois clique em Resume no Playwright.');
  await page.pause();
}

/**
 * Pausa explicitamente para resolucao manual do CAPTCHA quando o fluxo pedir.
 */
export async function waitForCaptchaResolution(
  page: Page,
  timeoutMs: number = 60_000
): Promise<void> {
  const mode = process.env.CAPTCHA_MODE || 'manual';
  if (mode === 'disabled') return;

  console.log(`[CAPTCHA] Aguardando resolucao manual do CAPTCHA. Timeout sugerido: ${timeoutMs}ms.`);
  await page.pause();
}

async function isCaptchaVisivel(page: Page): Promise<boolean> {
  const captchaIframe = page.locator('iframe[src*="recaptcha"], iframe[src*="api2/anchor"]');
  const captchaTexto = page.getByText(/nao sou um robo|n.o sou um rob.|selecione todas as imagens/i);

  return (
    (await captchaIframe.count().catch(() => 0)) > 0 ||
    (await captchaTexto.count().catch(() => 0)) > 0
  );
}
