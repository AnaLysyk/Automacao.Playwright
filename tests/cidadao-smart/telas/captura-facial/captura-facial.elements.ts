import { Page } from '@playwright/test';

export class CapturaFacialElements {
  constructor(private readonly page: Page) {}

  titulo() {
    // TODO: solicitar data-testid para o titulo da tela de captura.
    return this.page.getByText(/foto para o documento/i).first();
  }

  enviarNovaFotoButton() {
    return this.page.getByRole('button', { name: /enviar nova foto/i }).first();
  }

  usarCameraButton() {
    return this.page.getByRole('button', { name: /usar c.mera/i }).first();
  }

  aceitarAjusteButton() {
    return this.page.getByRole('button', { name: /aceitar/i }).first();
  }

  sucessoFotoMessage() {
    return this.page.getByText(/foto capturada com sucesso|sua nova foto/i).first();
  }

  prosseguirButton() {
    return this.page.getByRole('button', { name: /prosseguir/i }).first();
  }
}
