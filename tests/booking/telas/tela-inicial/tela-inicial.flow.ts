import { expect, Page } from '@playwright/test';
import { BookingTelaInicialElements } from './tela-inicial.elements';

export class BookingTelaInicialFlow {
  private readonly elements: BookingTelaInicialElements;

  constructor(private readonly page: Page) {
    this.elements = new BookingTelaInicialElements(page);
  }

  async acessar(): Promise<void> {
    await this.page.goto('/agendamentos/novo/local');
  }

  async validarCarregamento(): Promise<void> {
    await expect(this.elements.body()).toBeVisible();
    await expect(this.elements.body()).not.toHaveText('');
  }

  async validarEntradaAgendamento(): Promise<void> {
    await expect(this.elements.cidadeInput()).toBeVisible();
    await expect(this.elements.prosseguirButton()).toBeVisible();
  }
}
