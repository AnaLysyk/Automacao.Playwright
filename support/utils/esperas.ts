import { Page } from '@playwright/test';

export async function aguardarInterface(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
}
