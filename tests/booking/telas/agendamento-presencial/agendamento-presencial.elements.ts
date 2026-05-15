import { Page } from '@playwright/test';

export class AgendamentoPresencialElements {
  constructor(private readonly page: Page) {}

  resumoTitle() {
    return this.page.getByText(/^resumo$/i).first();
  }

  resumoProsseguirButton() {
    return this.page.getByRole('button', { name: /prosseguir/i }).first();
  }

  protocoloText() {
    return this.page.getByText(/0\d{11,}/).first();
  }
}
