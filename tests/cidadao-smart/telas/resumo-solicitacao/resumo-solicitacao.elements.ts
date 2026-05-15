import { Page } from '@playwright/test';

export class ResumoSolicitacaoElements {
  constructor(private readonly page: Page) {}

  dadosRequerenteTitle() {
    return this.page.getByText(/dados do requerente/i).first();
  }

  localRetiradaTitle() {
    return this.page.getByText(/local de retirada/i).first();
  }

  aceiteControl() {
    // TODO: solicitar data-testid para o aceite do resumo.
    return this.page
      .locator('input[type="checkbox"], [role="checkbox"], label')
      .filter({ hasText: /estou de acordo|desejo prosseguir/i })
      .first();
  }

  prosseguirButton() {
    return this.page.getByRole('button', { name: /prosseguir/i }).first();
  }
}
