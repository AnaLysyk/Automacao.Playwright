import { expect, test } from '@playwright/test';

test.describe('@smoke Cidadao Smart', () => {
  test('[SMOKE-HOME-001] home deve responder com conteudo visivel', async ({ page }) => {
    await page.goto('/');

    const corpoDaPagina = page.locator('body');

    await expect(corpoDaPagina).toBeVisible();
    await expect(corpoDaPagina).not.toHaveText('');
  });
});
