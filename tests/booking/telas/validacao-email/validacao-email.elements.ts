import { Page } from '@playwright/test';

export class BookingValidacaoEmailElements {
  constructor(private readonly page: Page) {}

  codigoInput() {
    // TODO: solicitar data-testid para o codigo de seguranca.
    return this.page
      .locator('input[autocomplete="one-time-code"], input[name*="codigo" i], input[id*="codigo" i], input[type="text"], input[type="tel"]')
      .first();
  }

  verificarButton() {
    return this.page.getByRole('button', { name: /verificar/i }).first();
  }

  codigoValidadoMessage() {
    return this.page.getByText(/codigo.*validado|j. pode prosseguir/i).first();
  }

  prosseguirButton() {
    return this.page.getByRole('button', { name: /prosseguir/i }).first();
  }
}
