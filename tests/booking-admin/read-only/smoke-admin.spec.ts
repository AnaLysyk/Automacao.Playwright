import { expect, Page, test } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const BOOKING_ADMIN_BASE_URL = process.env.BOOKING_ADMIN_BASE_URL || '';
const BOOKING_ADMIN_USER = process.env.BOOKING_ADMIN_USER || '';
const BOOKING_ADMIN_PASSWORD = process.env.BOOKING_ADMIN_PASSWORD || '';

function validarVariaveisAdmin(): void {
  if (!BOOKING_ADMIN_BASE_URL) {
    throw new Error('BOOKING_ADMIN_BASE_URL nao configurada no .env.local');
  }

  if (!BOOKING_ADMIN_USER) {
    throw new Error('BOOKING_ADMIN_USER nao configurado no .env.local');
  }

  if (!BOOKING_ADMIN_PASSWORD) {
    throw new Error('BOOKING_ADMIN_PASSWORD nao configurada no .env.local');
  }
}

async function preencherLoginAdmin(page: Page, password = BOOKING_ADMIN_PASSWORD): Promise<void> {
  const campoUsuarioPorLabel = page.getByLabel(/usuario|usu.rio/i);
  const campoSenhaPorLabel = page.getByLabel(/senha/i);

  if ((await campoUsuarioPorLabel.count()) > 0) {
    await campoUsuarioPorLabel.fill(BOOKING_ADMIN_USER);
  } else {
    await page.locator('input').first().fill(BOOKING_ADMIN_USER);
  }

  if ((await campoSenhaPorLabel.count()) > 0) {
    await campoSenhaPorLabel.fill(password);
  } else {
    await page.locator('input[type="password"]').fill(password);
  }
}

async function loginAdmin(page: Page): Promise<void> {
  validarVariaveisAdmin();

  await page.goto(BOOKING_ADMIN_BASE_URL, { waitUntil: 'domcontentloaded' });
  await preencherLoginAdmin(page);

  await Promise.all([
    page.waitForURL((url) => !url.pathname.includes('/login'), {
      timeout: 30_000,
    }),
    page.getByRole('button', { name: /entrar/i }).click(),
  ]);
}

async function abrirItemMenu(page: Page, name: RegExp): Promise<void> {
  const item = page.getByRole('link', { name }).or(page.getByText(name)).first();
  await expect(item).toBeVisible();
  await item.click();
}

test.describe('@smoke @booking @admin @readonly', () => {
  test('[ADMIN-LOGIN-001] Deve carregar pagina de login', async ({ page }) => {
    validarVariaveisAdmin();

    await page.goto(BOOKING_ADMIN_BASE_URL, { waitUntil: 'domcontentloaded' });

    await expect(page.locator('body')).toContainText(/administrativa|login/i);
    await expect(page.getByLabel(/usuario|usu.rio/i).or(page.locator('input').first())).toBeVisible();
    await expect(page.getByLabel(/senha/i).or(page.locator('input[type="password"]'))).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();
  });

  test('[ADMIN-LOGIN-002] Deve fazer login com credenciais validas', async ({ page }) => {
    await loginAdmin(page);

    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('[ADMIN-LOGIN-003] Deve rejeitar login com senha incorreta', async ({ page }) => {
    validarVariaveisAdmin();

    await page.goto(BOOKING_ADMIN_BASE_URL, { waitUntil: 'domcontentloaded' });
    await preencherLoginAdmin(page, `${BOOKING_ADMIN_PASSWORD}-errada`);
    await page.getByRole('button', { name: /entrar/i }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(
      page.getByRole('alert').or(page.getByText(/invalid user credentials|credenciais|senha|inval/i)).first()
    ).toBeVisible();
  });

  test('[ADMIN-SMOKE-001] Deve acessar listagem de agendamentos', async ({ page }) => {
    await loginAdmin(page);
    await abrirItemMenu(page, /agendamentos/i);

    await expect(page.locator('body')).toContainText(/painel do administrador|agendamentos/i);
    await expect(page.locator('body')).toContainText(/buscar agendamento|protocolo|selecione um posto/i);
  });

  test('[ADMIN-SMOKE-002] Deve acessar gestao de posto', async ({ page }) => {
    await loginAdmin(page);
    await abrirItemMenu(page, /gest.*posto|postos/i);

    await expect(page.locator('body')).toContainText(/posto|atendimento/i);
  });

  test('[ADMIN-SMOKE-003] Deve acessar auditoria', async ({ page }) => {
    await loginAdmin(page);
    await abrirItemMenu(page, /auditoria/i);

    await expect(page.locator('body')).toContainText(/auditoria/i);
  });

  test('[ADMIN-SMOKE-004] Deve acessar permissoes', async ({ page }) => {
    await loginAdmin(page);
    await abrirItemMenu(page, /permiss/i);

    await expect(page.locator('body')).toContainText(/bloqueados|liberados|permiss/i);
  });

  test('[ADMIN-SMOKE-005] Deve acessar ambiente', async ({ page }) => {
    await loginAdmin(page);
    await abrirItemMenu(page, /ambiente/i);

    await expect(page.locator('body')).toContainText(/ambiente|configura/i);
  });
});
