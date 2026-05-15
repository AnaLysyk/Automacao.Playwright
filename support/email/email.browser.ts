import { BrowserContext, Page, chromium } from '@playwright/test';
import { caminhoAbsoluto } from '../utils/arquivos';
import { loadEnv } from '../config/env';

export class EmailBrowserClient {
  private context?: BrowserContext;
  private page?: Page;

  async abrirEmail(): Promise<void> {
    const env = loadEnv();

    this.context = await chromium.launchPersistentContext(caminhoAbsoluto(env.emailBrowserProfileDir), {
      headless: false,
      channel: process.env.EMAIL_BROWSER_CHANNEL || 'chrome',
    });

    this.page = await this.context.newPage();
    await this.page.goto('https://mail.google.com');
  }

  async buscarCodigoMaisRecente(): Promise<string> {
    if (!this.page) {
      throw new Error('EMAIL_BROWSER_NAO_INICIALIZADO');
    }

    const env = loadEnv();
    const searchBox = this.page.getByRole('textbox', { name: /pesquisar|search/i }).first();

    await searchBox.fill(env.emailBrowserSearchQuery);
    await this.page.keyboard.press('Enter');

    const primeiroEmail = this.page.locator('tr').filter({ hasText: /\d{4,8}|codigo|código/i }).first();
    await primeiroEmail.click();

    const corpo = await this.page.locator('body').innerText();
    const codigo = corpo.match(/\b\d{4,8}\b/)?.[0];

    if (!codigo) {
      throw new Error('EMAIL_BROWSER_CODIGO_NAO_ENCONTRADO');
    }

    return codigo;
  }

  async fechar(): Promise<void> {
    await this.context?.close();
    this.context = undefined;
    this.page = undefined;
  }
}
