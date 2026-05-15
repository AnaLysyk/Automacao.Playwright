import { Locator, Page } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

/**
 * Centraliza login e logout dos sistemas usados pelos testes.
 * Mantem credenciais fora do codigo: tudo vem do .env.local.
 */
export class AuthHelper {
  /**
   * Entra no Booking Admin usando usuario/senha configurados no ambiente.
   */
  static async loginBookingAdmin(page: Page): Promise<void> {
    const user = process.env.BOOKING_ADMIN_USER || '';
    const password = process.env.BOOKING_ADMIN_PASSWORD || '';
    const baseUrl = process.env.BOOKING_ADMIN_BASE_URL || '';

    if (!user || !password || !baseUrl) {
      throw new Error(
        'Variaveis BOOKING_ADMIN_USER, BOOKING_ADMIN_PASSWORD e BOOKING_ADMIN_BASE_URL obrigatorias'
      );
    }

    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.fill('input[type="email"], input[name="email"], input[id*="email"]', user);
    await page.fill('input[type="password"], input[name="password"]', password);
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Entrar")');
    await page.waitForNavigation({ waitUntil: 'networkidle' });

    if (page.url().includes('/login')) {
      throw new Error('Falha no login Booking Admin. URL ainda contem /login. Verifique credenciais.');
    }
  }

  /**
   * Sai do Booking Admin quando o menu de usuario esta disponivel.
   * Falha de logout gera aviso, mas nao quebra o teste que ja validou o fluxo principal.
   */
  static async logoutBookingAdmin(page: Page): Promise<void> {
    try {
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
        if (await element.isVisible({ timeout: 3_000 }).catch(() => false)) {
          await element.click();
          menuFound = true;
          break;
        }
      }

      if (!menuFound) {
        throw new Error('Menu do usuario nao encontrado');
      }

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
        if (await element.isVisible({ timeout: 2_000 }).catch(() => false)) {
          await element.click();
          logoutClicked = true;
          break;
        }
      }

      if (!logoutClicked) {
        throw new Error('Botao de logout nao encontrado');
      }

      await page.waitForNavigation({ waitUntil: 'networkidle' });
    } catch (error) {
      console.warn('Erro ao fazer logout:', error);
    }
  }

  /**
   * Entra no SMART interno.
   * O metodo e idempotente: se a sessao ja esta aberta, ele apenas continua.
   */
  static async loginSmart(page: Page): Promise<void> {
    const user = process.env.SMART_USER || '';
    const password = process.env.SMART_PASSWORD || '';
    const baseUrl = process.env.SMART_BASE_URL || '';

    if (!user || !password || !baseUrl) {
      throw new Error('Variaveis SMART_USER, SMART_PASSWORD e SMART_BASE_URL obrigatorias');
    }

    await page.goto(baseUrl, { waitUntil: 'networkidle' });

    const campoSenha = page.locator('input[type="password"], input[name*="password" i], input[name*="senha" i]').first();
    const telaLoginVisivel = await campoSenha.isVisible({ timeout: 5_000 }).catch(() => false);

    if (!telaLoginVisivel) {
      console.log('[SMART] Sessao ja autenticada ou tela de login nao exibida.');
      return;
    }

    const campoUsuario = await AuthHelper.primeiroCampoVisivel([
      page.getByLabel(/usuario|usu.rio|login|email/i).first(),
      page.getByPlaceholder(/usuario|usu.rio|login|email/i).first(),
      page.locator('input[type="email"], input[name*="email" i], input[name*="user" i], input[name*="usuario" i], input[name*="login" i]').first(),
      page.locator('input:not([type="password"])').first(),
    ]);

    await campoUsuario.fill(user);
    await campoSenha.fill(password);

    const botaoEntrar = await AuthHelper.primeiroCampoVisivel([
      page.getByRole('button', { name: /entrar|acessar|login|sign in/i }).first(),
      page.locator('button[type="submit"]').first(),
    ]);

    await Promise.all([
      page.waitForLoadState('networkidle').catch(() => undefined),
      botaoEntrar.click(),
    ]);

    if (page.url().includes('/login')) {
      throw new Error('Falha no login SMART. URL ainda contem /login.');
    }
  }

  /**
   * Retorna o primeiro locator visivel de uma lista de fallbacks.
   */
  private static async primeiroCampoVisivel(locators: Locator[]): Promise<Locator> {
    for (const locator of locators) {
      if (await locator.isVisible({ timeout: 2_000 }).catch(() => false)) {
        return locator;
      }
    }

    throw new Error('Campo esperado nao encontrado.');
  }

  /**
   * Sai do SMART quando o menu da sessao aparece na tela.
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
        if (await element.isVisible({ timeout: 3_000 }).catch(() => false)) {
          await element.click();
          menuFound = true;
          break;
        }
      }

      if (!menuFound) {
        throw new Error('Menu do usuario nao encontrado');
      }

      const logoutSelectors = ['text=Sair', 'text=Logout', 'a[href*="logout"]'];

      let logoutClicked = false;
      for (const selector of logoutSelectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 2_000 }).catch(() => false)) {
          await element.click();
          logoutClicked = true;
          break;
        }
      }

      if (!logoutClicked) {
        throw new Error('Botao de logout nao encontrado');
      }

      await page.waitForNavigation({ waitUntil: 'networkidle' });
    } catch (error) {
      console.warn('Erro ao fazer logout do SMART:', error);
    }
  }

  /**
   * Verifica sinais simples de sessao autenticada.
   */
  static async isAuthenticated(page: Page): Promise<boolean> {
    try {
      if (page.url().includes('/login')) {
        return false;
      }

      const userIndicators = [
        '[data-testid="user-menu"]',
        '.user-dropdown',
        '.profile-menu',
        'button:has-text("Perfil")',
      ];

      for (const selector of userIndicators) {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1_000 }).catch(() => false)) {
          return true;
        }
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Mantem o ponto de extensao para login via API do Cidadao Smart.
   */
  static async loginCidadaoSmartViaApi(token: string): Promise<string> {
    return token;
  }
}
