import { Page } from '@playwright/test';

export async function resolverCaptchaManual(page: Page): Promise<void> {
  const captchaIframe = page.locator('iframe[src*="recaptcha"], iframe[src*="api2/anchor"]');
  const captchaTexto = page.getByText(/selecione todas as imagens/i);

  if ((await captchaIframe.count()) > 0 || (await captchaTexto.count()) > 0) {
    console.log(
      '[CAPTCHA-HELPER] CAPTCHA detectado: marque "Não sou um robô" e clique em prosseguir manualmente.'
    );
    console.log('[CAPTCHA-HELPER] Depois clique em Resume no Playwright.');
    await page.pause();
  }
}
