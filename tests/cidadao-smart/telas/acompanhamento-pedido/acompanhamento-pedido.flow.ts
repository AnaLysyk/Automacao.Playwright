import { expect, Page } from '@playwright/test';
import { AcompanhamentoPedidoElements } from './acompanhamento-pedido.elements';

export class AcompanhamentoPedidoFlow {
  private readonly elements: AcompanhamentoPedidoElements;

  constructor(private readonly page: Page) {
    this.elements = new AcompanhamentoPedidoElements(page);
  }

  async acessar(): Promise<void> {
    await this.page.goto('/consulta-protocolo');
    await expect(this.page).toHaveURL(/\/consulta-protocolo/);
  }

  async telaVisivel(): Promise<boolean> {
    return this.elements.protocoloInput().isVisible({ timeout: 3_000 }).catch(() => false);
  }

  async validarTela(): Promise<void> {
    await expect(this.elements.protocoloInput()).toBeVisible();
    await expect(this.elements.dataNascimentoInput()).toBeVisible();
    await expect(this.elements.prosseguirButton()).toBeVisible();
  }

  async preencherConsulta(protocolo: string, dataNascimento: string): Promise<void> {
    await this.elements.protocoloInput().fill(protocolo);
    await this.elements.dataNascimentoInput().fill(dataNascimento);
  }

  async tentarProsseguir(): Promise<boolean> {
    await expect(this.elements.prosseguirButton()).toBeVisible();

    if (!(await this.elements.prosseguirButton().isEnabled())) {
      return false;
    }

    await this.elements.prosseguirButton().click();
    return true;
  }

  async validarCamposObrigatorios(): Promise<void> {
    if (await this.elements.prosseguirButton().isDisabled().catch(() => false)) {
      await expect(this.elements.prosseguirButton()).toBeDisabled();
      return;
    }

    await expect(this.elements.erroObrigatorioMessage()).toBeVisible();
  }

  async validarPermaneceNaConsulta(): Promise<void> {
    await expect(this.page).toHaveURL(/\/consulta-protocolo/i);
  }
}
