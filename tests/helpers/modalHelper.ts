import { Page, expect } from '@playwright/test';

export class ModalHelper {
  constructor(private readonly page: Page) {}

  async abrirModalPorTexto(texto: string): Promise<void> {
    await this.page.getByText('Selecione', { exact: true }).first().click();
    await expect(this.page.getByText(new RegExp(texto, 'i'))).toBeVisible();
  }

  async fecharModal(): Promise<void> {
    await this.page.getByRole('button', { name: /fechar|cancelar/i }).last().click();
  }
}
