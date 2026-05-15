import { Page, TestInfo } from '@playwright/test';
import { loadEnv } from '../config/env';

export async function captchaVisivel(page: Page): Promise<boolean> {
  const iframe = page.locator('iframe[src*="recaptcha"], iframe[src*="api2/anchor"], iframe[title*="captcha" i]');
  const texto = page.getByText(/captcha|nao sou um robo|n.o sou um rob.|selecione todas as imagens/i);

  return (await iframe.count().catch(() => 0)) > 0 || (await texto.count().catch(() => 0)) > 0;
}

export async function resolverCaptchaSePermitido(page: Page, testInfo?: TestInfo): Promise<void> {
  const env = loadEnv();
  const visivel = await captchaVisivel(page);

  if (!visivel && env.captchaMode !== 'manual') {
    return;
  }

  if (visivel && env.captchaMode === 'disabled') {
    throw new Error('CAPTCHA_ATIVO_SEM_BYPASS_OFICIAL');
  }

  testInfo?.annotations.push({
    type: 'manual',
    description: 'Resolver Captury/CAPTCHA manualmente neste ponto do fluxo.',
  });

  await page.pause();
}
