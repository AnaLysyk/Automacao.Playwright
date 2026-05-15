import { Page } from '@playwright/test';

export class ConsultaPedidoElements {
  constructor(private readonly page: Page) {}

  protocoloInput() {
    // TODO: solicitar data-testid para campo de protocolo.
    return this.page
      .locator('input[name*="protocolo" i], input[id*="protocolo" i], input[placeholder*="protocolo" i], input[type="text"]')
      .first();
  }

  dataNascimentoInput() {
    // TODO: solicitar data-testid para campo de data de nascimento.
    return this.page
      .locator('input[name*="nascimento" i], input[id*="nascimento" i], input[placeholder*="dd/mm/aaaa" i], input[type="text"]')
      .nth(1);
  }

  prosseguirButton() {
    return this.page.getByRole('button', { name: /prosseguir/i }).first();
  }

  erroObrigatorioMessage() {
    return this.page.getByText(/obrigatorio|campo requerido/i).first();
  }
}
