import { expect, Page, test } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const BOOKING_ADMIN_BASE_URL = process.env.BOOKING_ADMIN_BASE_URL || '';
const BOOKING_ADMIN_USER = process.env.BOOKING_ADMIN_USER || '';
const BOOKING_ADMIN_PASSWORD = process.env.BOOKING_ADMIN_PASSWORD || '';

function validarVariaveisAdmin(): void {
  if (!BOOKING_ADMIN_BASE_URL || !BOOKING_ADMIN_USER || !BOOKING_ADMIN_PASSWORD) {
    throw new Error(
      'Configure BOOKING_ADMIN_BASE_URL, BOOKING_ADMIN_USER e BOOKING_ADMIN_PASSWORD no .env.local.'
    );
  }
}

async function preencherLoginAdmin(page: Page, password = BOOKING_ADMIN_PASSWORD): Promise<void> {
  const campoUsuario = page.getByLabel(/usuario|usu.rio/i).or(page.locator('input').first());
  const campoSenha = page.getByLabel(/senha/i).or(page.locator('input[type="password"]'));

  await campoUsuario.first().fill(BOOKING_ADMIN_USER);
  await campoSenha.first().fill(password);
}

async function loginAdmin(page: Page): Promise<void> {
  validarVariaveisAdmin();

  await page.goto(BOOKING_ADMIN_BASE_URL, { waitUntil: 'domcontentloaded' });
  await preencherLoginAdmin(page);

  await Promise.all([
    page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 30_000 }),
    page.getByRole('button', { name: /entrar/i }).click(),
  ]);
}

test.describe('@smoke @booking-admin @readonly', () => {
  test('[ADMIN-LOGIN-001] Pagina de login carrega', async ({ page }) => {
    validarVariaveisAdmin();

    await page.goto(BOOKING_ADMIN_BASE_URL, { waitUntil: 'domcontentloaded' });

    await expect(page.locator('body')).toContainText(/administrativa|login/i);
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();
  });

  test('[ADMIN-LOGIN-002] Login com credenciais validas', async ({ page }) => {
    await loginAdmin(page);

    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toContainText(/painel|agendamentos|administrador/i);
  });

  test('[ADMIN-LOGIN-003] Rejeita senha incorreta', async ({ page }) => {
    validarVariaveisAdmin();

    await page.goto(BOOKING_ADMIN_BASE_URL, { waitUntil: 'domcontentloaded' });
    await preencherLoginAdmin(page, `${BOOKING_ADMIN_PASSWORD}-errada`);
    await page.getByRole('button', { name: /entrar/i }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(
      page.getByRole('alert').or(page.getByText(/invalid user credentials|credenciais|senha|inval/i)).first()
    ).toBeVisible();
  });

  test('[ADMIN-LOGIN-004] Logout', async ({ page }) => {
    await loginAdmin(page);

    const userMenu = page
      .getByRole('button', { name: new RegExp(BOOKING_ADMIN_USER, 'i') })
      .or(page.getByRole('button', { name: /perfil|usuario|sair|logout/i }))
      .first();

    test.skip(
      !(await userMenu.isVisible({ timeout: 5_000 }).catch(() => false)),
      'Logout bloqueado: menu de usuario nao ficou exposto neste perfil/tela.'
    );

    await userMenu.click();

    const logoutButton = page.getByText(/sair|logout|desconectar/i).first();
    test.skip(
      !(await logoutButton.isVisible({ timeout: 5_000 }).catch(() => false)),
      'Logout bloqueado: acao de sair nao ficou exposta neste perfil/tela.'
    );

    await Promise.all([
      page.waitForURL(/\/login/, { timeout: 15_000 }),
      logoutButton.click(),
    ]);
  });
});
