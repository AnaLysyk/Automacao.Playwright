import { test, expect, Page } from '@playwright/test';
import { AuthHelper } from '../helpers/AuthHelper';

const BOOKING_ADMIN_BASE_URL = process.env.BOOKING_ADMIN_BASE_URL || 'http://localhost:3000';

test.describe('@smoke @booking-admin @readonly', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
  });

  test('[ADMIN-LOGIN-001] Página de login carrega', async () => {
    await page.goto(BOOKING_ADMIN_BASE_URL, { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: /login|entrar/i })).toBeVisible();
  });

  test('[ADMIN-LOGIN-002] Login com credenciais válidas', async () => {
    await AuthHelper.loginBookingAdmin(page);
    
    // Validar que navegou para além da página de login
    expect(page.url()).not.toContain('/login');
    
    // Procurar por elemento que indica autenticação bem-sucedida
    const userMenu = page.locator('[data-testid="user-menu"], .user-dropdown, .profile-menu').first();
    await expect(userMenu).toBeVisible({ timeout: 10000 });
  });

  test('[ADMIN-LOGIN-003] Rejeita senha incorreta', async () => {
    const BOOKING_ADMIN_USER = process.env.BOOKING_ADMIN_USER || 'admin';
    
    await page.goto(BOOKING_ADMIN_BASE_URL, { waitUntil: 'networkidle' });
    await page.fill('input[type="email"], input[name*="email"]', BOOKING_ADMIN_USER);
    await page.fill('input[type="password"]', 'senha-errada-123');
    await page.click('button[type="submit"], button:has-text("Entrar"), button:has-text("Login")');

    // Deve voltar para login com mensagem de erro
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/login');
  });

  test('[ADMIN-LOGIN-004] Logout', async () => {
    await AuthHelper.loginBookingAdmin(page);
    
    // Procurar pelo menu de usuário e logout
    const userMenu = page.locator('[data-testid="user-menu"], .user-dropdown, .profile-menu').first();
    await userMenu.click({ timeout: 10000 });

    const logoutButton = page.locator('text=/logout|sair|sign out/i').first();
    await logoutButton.click({ timeout: 10000 });

    // Deve retornar à página de login
    await page.waitForNavigation();
    expect(page.url()).toContain('/login');
  });
});
