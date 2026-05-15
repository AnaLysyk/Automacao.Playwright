import { expect, Page } from '@playwright/test';
import { emailClient } from '../../../../support/email/email.client';
import { BookingValidacaoEmailElements } from './validacao-email.elements';

export class BookingValidacaoEmailFlow {
  private readonly elements: BookingValidacaoEmailElements;

  constructor(private readonly page: Page) {
    this.elements = new BookingValidacaoEmailElements(page);
  }

  async acessarDireto(): Promise<void> {
    await this.page.goto('/agendamentos/novo/autenticacao');
  }

  async telaVisivel(): Promise<boolean> {
    return this.elements.codigoInput().isVisible({ timeout: 3_000 }).catch(() => false);
  }

  async preencherCodigo(email: string): Promise<void> {
    const codigo = await emailClient.getLatestCode(email);
    await this.elements.codigoInput().fill(codigo);
  }

  async verificarCodigo(): Promise<void> {
    if (await this.elements.verificarButton().isVisible({ timeout: 2_000 }).catch(() => false)) {
      await this.elements.verificarButton().click();
    }

    await expect(this.elements.codigoValidadoMessage()).toBeVisible();
  }

  async prosseguir(): Promise<void> {
    await expect(this.elements.prosseguirButton()).toBeVisible();
    await this.elements.prosseguirButton().click();
  }
}
