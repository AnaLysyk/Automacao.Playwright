import { expect, Page } from '@playwright/test';
import { emailClient } from '../../../../support/email/email.client';
import { ValidacaoEmailElements } from './validacao-email.elements';

export class ValidacaoEmailFlow {
  private readonly elements: ValidacaoEmailElements;

  constructor(private readonly page: Page) {
    this.elements = new ValidacaoEmailElements(page);
  }

  async acessarEntradaEmissao(): Promise<void> {
    await this.page.goto('/emitir');
    await expect(this.page).toHaveURL(/\/emitir\/?$/);
  }

  async validarEntradaCpf(): Promise<void> {
    await expect(this.elements.cpfInput()).toBeVisible();
    await expect(this.elements.prosseguirButton()).toBeVisible();
  }

  async informarCpf(cpf: string): Promise<void> {
    await this.elements.cpfInput().fill(cpf);
  }

  async prosseguir(): Promise<void> {
    await expect(this.elements.prosseguirButton()).toBeVisible();
    await this.elements.prosseguirButton().click();
  }

  async preencherContato(email: string, telefone: string): Promise<void> {
    if (await this.elements.emailInput().isVisible({ timeout: 2_000 }).catch(() => false)) {
      await this.elements.emailInput().fill(email);
    }

    if (await this.elements.telefoneInput().isVisible({ timeout: 2_000 }).catch(() => false)) {
      await this.elements.telefoneInput().fill(telefone);
    }
  }

  async preencherCodigoMaisRecente(email: string): Promise<void> {
    const codigo = await emailClient.getLatestCode(email);
    await this.elements.codigoInput().fill(codigo);
  }

  async verificarCodigo(): Promise<void> {
    if (await this.elements.verificarButton().isVisible({ timeout: 2_000 }).catch(() => false)) {
      await this.elements.verificarButton().click();
    }

    await expect(this.elements.codigoValidadoMessage()).toBeVisible();
  }
}
