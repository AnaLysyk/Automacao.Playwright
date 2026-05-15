import { expect, Page } from '@playwright/test';
import { TelaInicialElements } from './tela-inicial.elements';

export class TelaInicialFlow {
  private readonly elements: TelaInicialElements;

  constructor(private readonly page: Page) {
    this.elements = new TelaInicialElements(page);
  }

  async acessar(): Promise<void> {
    await this.page.goto('/');
  }

  async validarConteudoVisivel(): Promise<void> {
    await expect(this.elements.body()).toBeVisible();
    await expect(this.elements.body()).not.toHaveText('');
  }

  async validarEntradaPrincipal(): Promise<void> {
    await expect(this.elements.tituloEmissaoOnline()).toBeVisible();
    await expect(this.elements.declaracaoMaior16()).toBeVisible();
    await expect(this.elements.cardConsultarPedido()).toBeVisible();
  }
}
