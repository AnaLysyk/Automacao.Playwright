import { Page } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

/**
 * Helper para autenticação em sistemas com login por email/password
 */
export class AuthHelper {
  /**
   * Fazer login no Booking Admin
   */
  static async loginBookingAdmin(page: Page): Promise<void> {
    const user = process.env.BOOKING_ADMIN_USER || '';
    const password = process.env.BOOKING_ADMIN_PASSWORD || '';
    const baseUrl = process.env.BOOKING_ADMIN_BASE_URL || '';

    if (!user || !password || !baseUrl) {
      throw new Error(
        'Variáveis BOOKING_ADMIN_USER, BOOKING_ADMIN_PASSWORD e BOOKING_ADMIN_BASE_URL obrigatórias'
      );
    }

    // Navegar para login
    await page.goto(baseUrl, { waitUntil: 'networkidle' });

    // Preencher credenciais
    await page.fill('input[type="email"], input[name="email"], input[id*="email"]', user);
    await page.fill('input[type="password"], input[name="password"]', password);

    // Clicar em submit
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Entrar")');

    // Aguardar navegação pós-login
    await page.waitForNavigation({ waitUntil: 'networkidle' });

    // Validar se está autenticado (não está mais em /login)
    if (page.url().includes('/login')) {
      throw new Error(
        'Falha no login Booking Admin. URL ainda contém /login. Verifique credenciais.'
      );
    }
  }

  /**
   * Fazer logout no Booking Admin
   */
  static async logoutBookingAdmin(page: Page): Promise<void> {
    try {
      // Tentar encontrar menu do usuário (pode estar em dropdown, ícone, etc)
      const userMenuSelectors = [
        '[data-testid="user-menu"]',
        '.user-dropdown',
        '.profile-menu',
        'button:has-text("Menu")',
        'button:has-text("Perfil")',
        'button:has-text("User")',
        'img[alt="Avatar"]',
      ];

      let menuFound = false;
      for (const selector of userMenuSelectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
          await element.click();
          menuFound = true;
          break;
        }
      }

      if (!menuFound) {
        throw new Error('Menu do usuário não encontrado');
      }

      // Clicar em logout/sair
      const logoutSelectors = [
        'text=Logout',
        'text=Sair',
        'text=Sign Out',
        'text=Desconectar',
        'a[href*="logout"]',
        'a[href*="signout"]',
        'button:has-text("Logout")',
        'button:has-text("Sair")',
      ];

      let logoutClicked = false;
      for (const selector of logoutSelectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
          await element.click();
          logoutClicked = true;
          break;
        }
      }

      if (!logoutClicked) {
        throw new Error('Botão de logout não encontrado');
      }

      // Aguardar redirecionamento para login
      await page.waitForNavigation({ waitUntil: 'networkidle' });
    } catch (error) {
      console.warn('Erro ao fazer logout:', error);
      // Não lançar erro, apenas avisar
    }
  }

  /**
   * Fazer login no SMART interno
   */
  static async loginSmart(page: Page): Promise<void> {
    const user = process.env.SMART_USER || '';
    const password = process.env.SMART_PASSWORD || '';
    const baseUrl = process.env.SMART_BASE_URL || '';

    if (!user || !password || !baseUrl) {
      throw new Error(
        'Variáveis SMART_USER, SMART_PASSWORD e SMART_BASE_URL obrigatórias'
      );
    }

    // Navegar para login
    await page.goto(baseUrl, { waitUntil: 'networkidle' });

    // Preencher credenciais
    await page.fill('input[type="email"], input[name="email"]', user);
    await page.fill('input[type="password"], input[name="password"]', password);

    // Clicar em submit
    await page.click('button[type="submit"]');

    // Aguardar navegação
    await page.waitForNavigation({ waitUntil: 'networkidle' });

    if (page.url().includes('/login')) {
      throw new Error('Falha no login SMART. URL ainda contém /login.');
    }
  }

  /**
   * Fazer logout no SMART
   */
  static async logoutSmart(page: Page): Promise<void> {
    try {
      const userMenuSelectors = [
        '[data-testid="user-menu"]',
        '.user-dropdown',
        '.profile-menu',
        'button:has-text("Menu")',
      ];

      let menuFound = false;
      for (const selector of userMenuSelectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
          await element.click();
          menuFound = true;
          break;
        }
      }

      if (!menuFound) {
        throw new Error('Menu do usuário não encontrado');
      }

      const logoutSelectors = ['text=Sair', 'text=Logout', 'a[href*="logout"]'];

      let logoutClicked = false;
      for (const selector of logoutSelectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
          await element.click();
          logoutClicked = true;
          break;
        }
      }

      if (!logoutClicked) {
        throw new Error('Botão de logout não encontrado');
      }

      await page.waitForNavigation({ waitUntil: 'networkidle' });
    } catch (error) {
      console.warn('Erro ao fazer logout do SMART:', error);
    }
  }

  /**
   * Verificar se está autenticado
   */
  static async isAuthenticated(page: Page): Promise<boolean> {
    try {
      // Se a URL contém /login, não está autenticado
      if (page.url().includes('/login')) {
        return false;
      }

      // Se conseguir encontrar elemento que indica usuário logado, está autenticado
      const userIndicators = [
        '[data-testid="user-menu"]',
        '.user-dropdown',
        '.profile-menu',
        'button:has-text("Perfil")',
      ];

      for (const selector of userIndicators) {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
          return true;
        }
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Fazer login no Cidadão Smart (via API ou UI)
   * Nota: Cidadão Smart geralmente não tem login tradicional
   */
  static async loginCidadaoSmartViaApi(token: string): Promise<string> {
    // Placeholder para login via API Token
    // Implementar conforme integração com Keycloak
    return token;
  }
}
