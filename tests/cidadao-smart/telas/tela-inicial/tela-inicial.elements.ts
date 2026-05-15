import { Page } from '@playwright/test';

export class TelaInicialElements {
  constructor(private readonly page: Page) {}

  body() {
    return this.page.locator('body');
  }

  tituloEmissaoOnline() {
    // TODO: solicitar data-testid para o card/titulo de emissao online.
    return this.page.getByRole('heading', { name: /emiss.o online/i }).first();
  }

  declaracaoMaior16() {
    // TODO: solicitar data-testid para o aceite de idade.
    return this.page.getByText(/declaro que tenho 16 anos ou mais/i).first();
  }

  cardConsultarPedido() {
    // TODO: solicitar data-testid para o card de consulta de pedido.
    return this.page.getByText(/consultar pedido/i).first();
  }
}
