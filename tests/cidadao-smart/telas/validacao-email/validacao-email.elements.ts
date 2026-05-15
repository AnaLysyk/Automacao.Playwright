import { Page } from '@playwright/test';

export class ValidacaoEmailElements {
  constructor(private readonly page: Page) {}

  cpfInput() {
    // TODO: solicitar data-testid para o campo de CPF.
    return this.page
      .locator('input[placeholder*="CPF" i], input[name*="cpf" i], input[id*="cpf" i], input[type="text"]')
      .first();
  }

  emailInput() {
    // TODO: solicitar data-testid para o campo de e-mail.
    return this.page
      .locator('input[type="email"], input[name*="email" i], input[id*="email" i], input[placeholder*="email" i]')
      .first();
  }

  telefoneInput() {
    // TODO: solicitar data-testid para o campo de telefone.
    return this.page
      .locator('input[type="tel"], input[name*="telefone" i], input[id*="telefone" i], input[placeholder*="telefone" i]')
      .first();
  }

  codigoInput() {
    // TODO: solicitar data-testid para o campo de codigo.
    return this.page
      .locator('input[autocomplete="one-time-code"], input[name*="codigo" i], input[id*="codigo" i], input[type="number"]')
      .first();
  }

  prosseguirButton() {
    return this.page.getByRole('button', { name: /prosseguir|continuar/i }).first();
  }

  verificarButton() {
    return this.page.getByRole('button', { name: /verificar/i }).first();
  }

  codigoValidadoMessage() {
    return this.page.getByText(/codigo.*validado|j. pode prosseguir/i).first();
  }
}
