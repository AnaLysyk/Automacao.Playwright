import { expect, Locator, Page } from '@playwright/test';
import { CidadaoSmartHomePageSelectors as S } from './selectors/CidadaoSmartHomePageSelectors';

export class CidadaoSmartHomePage {
  constructor(private readonly page: Page) {}

  async acessar(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page).toHaveURL(S.route);
  }

  async validarTelaHome(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: S.tituloEmissaoOnline }).first()).toBeVisible();
    await expect(this.page.getByText(S.textoCIN).first()).toBeVisible();
    await expect(await this.obterControleMaior16()).toBeVisible();
    await expect(this.page.getByText(S.cardEmissaoOnline).first()).toBeVisible();
    await expect(this.page.getByText(S.cardConsultarPedido)).toBeVisible();
  }

  async marcarDeclaracaoMaior16(): Promise<void> {
    const controle = await this.obterControleMaior16();
    const tag = await controle.evaluate((el) => el.tagName.toLowerCase());

    if (tag === 'input') {
      await controle.check();
      return;
    }

    await controle.click();
  }

  async clicarEmissaoOnline(): Promise<void> {
    const card = this.page.getByRole('link', { name: S.cardEmissaoOnline });
    if ((await card.count()) > 0) {
      await card.first().click();
      return;
    }
    await this.page.getByText(S.cardEmissaoOnline).first().click();
  }

  async clicarConsultarPedido(): Promise<void> {
    const card = this.page.getByRole('link', { name: S.cardConsultarPedido });
    if ((await card.count()) > 0) {
      await card.first().click();
      return;
    }
    await this.page.getByText(S.cardConsultarPedido).first().click();
  }

  private async obterControleMaior16(): Promise<Locator> {
    const checkbox = this.page.getByRole('checkbox', { name: S.checkboxMaior16 });
    if ((await checkbox.count()) > 0) return checkbox.first();

    const label = this.page.getByLabel(S.checkboxMaior16);
    if ((await label.count()) > 0) return label.first();

    return this.page.getByText(S.checkboxMaior16).first();
  }
}
