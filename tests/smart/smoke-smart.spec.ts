import { test, expect, Page } from '@playwright/test';
import { AuthHelper } from '../helpers/AuthHelper';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

test.describe('@smart @smoke', () => {
  let page: Page;
  const SMART_BASE_URL = process.env.SMART_BASE_URL || '';

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('[SMART-LOGIN-001] Deve carregar página de login', async () => {
    // Arrange
    if (!SMART_BASE_URL) {
      throw new Error('SMART_BASE_URL não configurada em .env.local');
    }

    // Act
    await page.goto(SMART_BASE_URL, { waitUntil: 'networkidle' });

    // Assert
    // Verificar se está na página de login
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('[SMART-LOGIN-002] Deve fazer login com credenciais válidas', async () => {
    // Arrange
    if (!SMART_BASE_URL) {
      throw new Error('SMART_BASE_URL não configurada em .env.local');
    }

    if (!process.env.SMART_USER || !process.env.SMART_PASSWORD) {
      throw new Error(
        'SMART_USER e SMART_PASSWORD não configuradas em .env.local'
      );
    }

    // Act
    await AuthHelper.loginSmart(page);

    // Assert
    // Verificar se está autenticado
    const isAuthenticated = await AuthHelper.isAuthenticated(page);
    expect(isAuthenticated).toBe(true);
  });

  test('[SMART-LOGIN-003] Deve rejeitar login com senha incorreta', async () => {
    // Arrange
    if (!SMART_BASE_URL) {
      throw new Error('SMART_BASE_URL não configurada em .env.local');
    }

    if (!process.env.SMART_USER) {
      throw new Error('SMART_USER não configurada em .env.local');
    }

    // Act
    await page.goto(SMART_BASE_URL, { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', process.env.SMART_USER);
    await page.fill('input[type="password"]', 'SenhaErrada12345');
    await page.click('button[type="submit"]');

    // Aguardar resposta
    await page.waitForTimeout(2000);

    // Assert
    // Deve permanecer na login ou mostrar erro
    const stillOnLogin = page.url().includes('/login');
    const hasError = await page
      .locator('[role="alert"], .error, .alert-danger')
      .isVisible()
      .catch(() => false);

    expect(stillOnLogin || hasError).toBe(true);
  });

  test('[SMART-MENU-001] Menu principal deve carregar', async () => {
    // Arrange
    if (!SMART_BASE_URL || !process.env.SMART_USER || !process.env.SMART_PASSWORD) {
      throw new Error(
        'SMART_BASE_URL, SMART_USER e SMART_PASSWORD obrigatórias'
      );
    }

    // Act
    await AuthHelper.loginSmart(page);

    // Assert
    // Verificar se menu está visível
    const menuItems = page.locator('nav, [role="navigation"], .menu, .sidebar').first();
    await expect(menuItems).toBeVisible();
  });

  test('[SMART-PROCESSOS-001] Deve listar processos civis', async () => {
    // Arrange
    if (!SMART_BASE_URL || !process.env.SMART_USER || !process.env.SMART_PASSWORD) {
      throw new Error(
        'SMART_BASE_URL, SMART_USER e SMART_PASSWORD obrigatórias'
      );
    }

    // Act
    await AuthHelper.loginSmart(page);

    // Navegar para processos
    const processosLink = page
      .locator('text=Processos|text=Processes|a[href*="processos"]')
      .first();
    await processosLink.click();

    // Aguardar carregamento
    await page.waitForLoadState('networkidle');

    // Assert
    // Deve exibir listagem de processos
    const table = page.locator('table, [role="table"], [role="grid"]').first();
    await expect(table).toBeVisible();

    // Deve ter pelo menos uma linha (processo)
    const rows = page.locator('tbody tr, [role="row"]').all();
    const rowCount = await rows.length;
    expect(rowCount).toBeGreaterThan(0);
  });

  test('[SMART-DETALHE-001] Deve abrir detalhes de um processo', async () => {
    // Arrange
    if (!SMART_BASE_URL || !process.env.SMART_USER || !process.env.SMART_PASSWORD) {
      throw new Error(
        'SMART_BASE_URL, SMART_USER e SMART_PASSWORD obrigatórias'
      );
    }

    // Act
    await AuthHelper.loginSmart(page);

    // Navegar para processos
    const processosLink = page
      .locator('text=Processos|text=Processes|a[href*="processos"]')
      .first();
    await processosLink.click();

    await page.waitForLoadState('networkidle');

    // Clicar na primeira linha/processo
    const firstRow = page.locator('tbody tr, [role="row"]').first();
    await firstRow.click();

    // Aguardar carregamento de detalhes
    await page.waitForLoadState('networkidle');

    // Assert
    // Deve exibir informações do processo
    const detailsPanel = page
      .locator('[class*="detail"], [class*="form"], [role="tabpanel"]')
      .first();
    await expect(detailsPanel).toBeVisible();

    // Deve exibir protocolo ou ID do processo
    const protocolOrId = page.locator('text=Protocolo|text=Protocol|text=Número').first();
    await expect(protocolOrId).toBeVisible();
  });

  test('[SMART-LOGOUT-001] Deve fazer logout', async () => {
    // Arrange
    if (!SMART_BASE_URL || !process.env.SMART_USER || !process.env.SMART_PASSWORD) {
      throw new Error(
        'SMART_BASE_URL, SMART_USER e SMART_PASSWORD obrigatórias'
      );
    }

    // Act
    await AuthHelper.loginSmart(page);
    await AuthHelper.logoutSmart(page);

    // Assert
    // Deve retornar para login
    expect(page.url()).toContain('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('[SMART-SMOKE-001] Dashboard deve estar acessível', async () => {
    // Arrange
    if (!SMART_BASE_URL || !process.env.SMART_USER || !process.env.SMART_PASSWORD) {
      throw new Error(
        'SMART_BASE_URL, SMART_USER e SMART_PASSWORD obrigatórias'
      );
    }

    // Act
    await AuthHelper.loginSmart(page);

    // Assert
    // Verificar se dashboard carregou
    const dashboard = page
      .locator('h1, [role="heading"], [class*="title"], [class*="header"]')
      .first();
    await expect(dashboard).toBeVisible();

    // Deve ter informações do usuário/operador
    const userInfo = page.locator('[class*="user"], [class*="profile"], [role="button"]').first();
    await expect(userInfo).toBeVisible();
  });
});
