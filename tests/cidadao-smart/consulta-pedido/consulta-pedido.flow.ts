import { expect, Page } from '@playwright/test';
import { resolverCaptchaSePermitido } from '../../../support/captcha/captcha.helper';
import { ConsultaPedidoElements } from './consulta-pedido.elements';
import { consultaPedidoData } from './consulta-pedido.data';

export class ConsultaPedidoFlow {
  private readonly elements: ConsultaPedidoElements;

  constructor(private readonly page: Page) {
    this.elements = new ConsultaPedidoElements(page);
  }

  async acessar(): Promise<void> {
    await this.page.goto('/consulta-protocolo');
  }

  async telaVisivel(): Promise<boolean> {
    return this.elements.protocoloInput().isVisible({ timeout: 3_000 }).catch(() => false);
  }

  async validarTela(): Promise<void> {
    await expect(this.elements.protocoloInput()).toBeVisible();
    await expect(this.elements.dataNascimentoInput()).toBeVisible();
    await expect(this.elements.prosseguirButton()).toBeVisible();
  }

  async validarObrigatoriedade(): Promise<void> {
    if (await this.elements.prosseguirButton().isDisabled().catch(() => false)) {
      await expect(this.elements.prosseguirButton()).toBeDisabled();
      return;
    }

    await this.elements.prosseguirButton().click();
    await expect(this.elements.erroObrigatorioMessage()).toBeVisible();
  }

  async consultarProtocoloInvalido(): Promise<void> {
    await this.elements.protocoloInput().fill(consultaPedidoData.protocoloInvalido);
    await this.elements.dataNascimentoInput().fill(consultaPedidoData.dataNascimento);
    await resolverCaptchaSePermitido(this.page);

    if (await this.elements.prosseguirButton().isEnabled().catch(() => false)) {
      await this.elements.prosseguirButton().click();
    }

    await expect(this.page).toHaveURL(/\/consulta-protocolo/i);
  }
}
