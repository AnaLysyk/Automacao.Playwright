import { Page } from '@playwright/test';

export class EmissaoOnlineElements {
  constructor(private readonly page: Page) {}

  cpfInput() {
    // TODO: solicitar data-testid para campo de CPF.
    return this.page
      .locator('input[placeholder*="CPF" i], input[name*="cpf" i], input[id*="cpf" i], input[type="text"]')
      .first();
  }

  prosseguirButton() {
    return this.page.getByRole('button', { name: /prosseguir|continuar/i }).first();
  }

  enviarFotoButton() {
    return this.page.getByRole('button', { name: /enviar nova foto/i }).first();
  }

  usarCameraButton() {
    return this.page.getByRole('button', { name: /usar c.mera/i }).first();
  }

  aceitarFotoButton() {
    return this.page.getByRole('button', { name: /aceitar/i }).first();
  }

  fotoCapturadaMessage() {
    return this.page.getByText(/foto capturada com sucesso|sua nova foto/i).first();
  }

  resumoDadosRequerente() {
    return this.page.getByText(/dados do requerente/i).first();
  }

  aceiteResumo() {
    // TODO: solicitar data-testid para aceite no resumo.
    return this.page
      .locator('input[type="checkbox"], [role="checkbox"], label')
      .filter({ hasText: /estou de acordo|desejo prosseguir/i })
      .first();
  }
}
