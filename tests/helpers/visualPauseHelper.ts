import { Page } from '@playwright/test';

export async function visualPause(page: Page, motivo: string): Promise<void> {
  console.log(`[VISUAL-PAUSE] Pausa solicitada: ${motivo}`);
  await page.pause();
}
