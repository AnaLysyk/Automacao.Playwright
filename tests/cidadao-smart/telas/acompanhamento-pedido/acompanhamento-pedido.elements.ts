import { Page } from '@playwright/test';

export class AcompanhamentoPedidoElements {
  constructor(private readonly page: Page) {}

  titulo() {
    return this.page.getByText(/autenticacao|consulta.*pedido|protocolo/i).first();
  }

  protocoloInput() {
    // TODO: solicitar data-testid para o campo de protocolo.
    return this.page
      .locator('input[name*="protocolo" i], input[id*="protocolo" i], input[placeholder*="protocolo" i], input[type="text"]')
      .first();
  }

  dataNascimentoInput() {
    // TODO: solicitar data-testid para o campo de data de nascimento.
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
