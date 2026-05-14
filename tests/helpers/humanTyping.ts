import { Locator, Page } from '@playwright/test';

export async function typeSlowly(locator: Locator, text: string, delay = 100): Promise<void> {
  await locator.fill('');
  for (const char of text) {
    await locator.type(char, { delay });
  }
}

export async function typeSlowlyOnSelector(page: Page, selector: string, text: string, delay = 100): Promise<void> {
  const locator = page.locator(selector);
  await typeSlowly(locator, text, delay);
}
