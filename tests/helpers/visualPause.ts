import { Page } from '@playwright/test';

export async function visualPause(page: Page, message = 'Aguardando ação manual no browser'): Promise<void> {
  console.log(message);
  try {
    await page.pause();
  } catch (error) {
    console.warn('Não foi possível abrir Playwright Inspector; aguardando 10s como fallback.', error);
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
}
