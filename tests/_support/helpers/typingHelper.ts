import { Locator } from '@playwright/test';

export async function digitarComoUsuario(locator: Locator, texto: string): Promise<void> {
  await locator.click();
  await locator.fill('');
  for (const char of texto) {
    await locator.type(char, { delay: 50 });
  }
}
