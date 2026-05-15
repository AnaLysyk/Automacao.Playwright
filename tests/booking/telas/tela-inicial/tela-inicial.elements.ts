import { Page } from '@playwright/test';

export class BookingTelaInicialElements {
  constructor(private readonly page: Page) {}

  body() {
    return this.page.locator('body');
  }

  cidadeInput() {
    // TODO: solicitar data-testid para a busca por cidade.
    return this.page.getByPlaceholder(/digite o nome da cidade/i).first();
  }

  prosseguirButton() {
    return this.page.getByRole('button', { name: /prosseguir/i }).first();
  }
}
