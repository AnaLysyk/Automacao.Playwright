import { test, expect, Page } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const BOOKING_ADMIN_BASE_URL = process.env.BOOKING_ADMIN_BASE_URL || '';
const BOOKING_ADMIN_USER = process.env.BOOKING_ADMIN_USER || '';
const BOOKING_ADMIN_PASSWORD = process.env.BOOKING_ADMIN_PASSWORD || '';

function validarVariaveisAdmin(): void {
  if (!BOOKING_ADMIN_BASE_URL) {
    throw new Error('BOOKING_ADMIN_BASE_URL não configurada no .env.local');
  }

  if (!BOOKING_ADMIN_USER) {
    throw new Error('BOOKING_ADMIN_USER não configurado no .env.local');
  }

  if (!BOOKING_ADMIN_PASSWORD) {
    throw new Error('BOOKING_ADMIN_PASSWORD não configurada no .env.local');
  }
}

async function preencherLoginAdmin(page: Page): Promise<void> {
  const campoUsuarioPorLabel = page.getByLabel(/usu[aá]rio/i);
  const campoSenhaPorLabel = page.getByLabel(/senha/i);

  if ((await campoUsuarioPorLabel.count()) > 0) {
    await campoUsuarioPorLabel.fill(BOOKING_ADMIN_USER);
  } else {
    await page.locator('input').first().fill(BOOKING_ADMIN_USER);
  }

  if ((await campoSenhaPorLabel.count()) > 0) {
    await campoSenhaPorLabel.fill(BOOKING_ADMIN_PASSWORD);
  } else {
    await page.locator('input[type="password"]').fill(BOOKING_ADMIN_PASSWORD);
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

test.describe('@smoke @booking @admin @readonly', () => {
  test('[ADMIN-LOGIN-001] Deve carregar página de login', async ({ page }) => {
    validarVariaveisAdmin();

    await page.goto(BOOKING_ADMIN_BASE_URL, { waitUntil: 'domcontentloaded' });

    await expect(page.getByText(/área administrativa/i)).toBeVisible();
    await expect(page.getByText(/faça login para continuar/i)).toBeVisible();

    const campoUsuario =
      (await page.getByLabel(/usu[aá]rio/i).count()) > 0
        ? page.getByLabel(/usu[aá]rio/i)
        : page.locator('input').first();

    const campoSenha =
      (await page.getByLabel(/senha/i).count()) > 0
        ? page.getByLabel(/senha/i)
        : page.locator('input[type="password"]');

    await expect(campoUsuario).toBeVisible();
    await expect(campoSenha).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();
  });

  test('[ADMIN-LOGIN-002] Deve fazer login com credenciais válidas', async ({ page }) => {
    await loginAdmin(page);

    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('[ADMIN-LOGIN-003] Deve rejeitar login com senha incorreta', async ({ page }) => {
    validarVariaveisAdmin();

    await page.goto(BOOKING_ADMIN_BASE_URL, { waitUntil: 'domcontentloaded' });

    const senhaOriginal = BOOKING_ADMIN_PASSWORD;

    if ((await page.getByLabel(/usu[aá]rio/i).count()) > 0) {
      await page.getByLabel(/usu[aá]rio/i).fill(BOOKING_ADMIN_USER);
    } else {
      await page.locator('input').first().fill(BOOKING_ADMIN_USER);
    }

    if ((await page.getByLabel(/senha/i).count()) > 0) {
      await page.getByLabel(/senha/i).fill(`${senhaOriginal}-errada`);
    } else {
      await page.locator('input[type="password"]').fill(`${senhaOriginal}-errada`);
    }

    await page.getByRole('button', { name: /entrar/i }).click();

    await expect(page).toHaveURL(/\/login/);

    const mensagemErro = page.locator(
      '[role="alert"], .error, .alert, .alert-danger, text=/inv[aá]lido|erro|senha|credenciais/i'
    );

    await expect(mensagemErro.first()).toBeVisible();
  });

  test('[ADMIN-SMOKE-001] Deve acessar listagem de agendamentos', async ({ page }) => {
    await loginAdmin(page);

    const linkAgendamentos = page
      .getByRole('link', { name: /agendamentos/i })
      .or(page.getByText(/agendamentos/i))
      .first();

    await linkAgendamentos.click();

    await expect(page).toHaveURL(/agendamentos/);

    await expect(
      page.locator('table, [role="table"], [role="grid"]').first()
    ).toBeVisible();
  });

  test('[ADMIN-SMOKE-002] Deve acessar gestão de posto', async ({ page }) => {
    await loginAdmin(page);

    const linkGestaoPosto = page
      .getByRole('link', { name: /gest[aã]o do posto|postos/i })
      .or(page.getByText(/gest[aã]o do posto|postos/i))
      .first();

    await linkGestaoPosto.click();

    await expect(page.locator('body')).toContainText(/posto|atendimento/i);
  });

  test('[ADMIN-SMOKE-003] Deve acessar auditoria', async ({ page }) => {
    await loginAdmin(page);

    const linkAuditoria = page
      .getByRole('link', { name: /auditoria/i })
      .or(page.getByText(/auditoria/i))
      .first();

    await linkAuditoria.click();

    await expect(page.locator('body')).toContainText(/auditoria/i);
  });

  test('[ADMIN-SMOKE-004] Deve acessar permissões', async ({ page }) => {
    await loginAdmin(page);

    const linkPermissoes = page
      .getByRole('link', { name: /permiss[oõ]es/i })
      .or(page.getByText(/permiss[oõ]es/i))
      .first();

    await linkPermissoes.click();

    await expect(page.locator('body')).toContainText(/bloqueados|liberados|permiss/i);
  });

  test('[ADMIN-SMOKE-005] Deve acessar ambiente', async ({ page }) => {
    await loginAdmin(page);

    const linkAmbiente = page
      .getByRole('link', { name: /ambiente/i })
      .or(page.getByText(/ambiente/i))
      .first();

    await linkAmbiente.click();

    await expect(page.locator('body')).toContainText(/ambiente|configura/i);
  });
});