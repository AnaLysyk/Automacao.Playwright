import { expect, Page } from '@playwright/test';
import { SelecaoPostoElements } from './selecao-posto.elements';

export class SelecaoPostoFlow {
  private readonly elements: SelecaoPostoElements;

  constructor(private readonly page: Page) {
    this.elements = new SelecaoPostoElements(page);
  }

  async acessar(): Promise<void> {
    await this.page.goto('/agendamentos/novo/local');
    await expect(this.page).toHaveURL(/\/agendamentos\/novo\/local/);

    if (await this.elements.loginMarker().isVisible({ timeout: 1_500 }).catch(() => false)) {
      throw new Error('BOOKING_REQUER_LOGIN_SMART');
    }
  }

  async validarTela(): Promise<void> {
    await expect(this.elements.instrucaoLocalizacao()).toBeVisible();
    await expect(this.elements.cidadeInput()).toBeVisible();
  }

  async buscarCidade(cidade: string): Promise<void> {
    if (await this.elements.cidadeRadio().isVisible({ timeout: 1_000 }).catch(() => false)) {
      await this.elements.cidadeRadio().check();
    }

    await this.elements.cidadeInput().fill(cidade);
  }

  async selecionarCidade(cidade: string): Promise<void> {
    await expect(this.elements.cidadeOpcao(cidade)).toBeVisible();
    await this.elements.cidadeOpcao(cidade).click();
  }

  async selecionarPosto(nomePosto: string): Promise<void> {
    await expect(this.elements.postoOpcao(nomePosto)).toBeVisible();
    await this.elements.postoOpcao(nomePosto).click();
  }

  async prosseguir(): Promise<void> {
    await expect(this.elements.prosseguirButton()).toBeVisible();

    if (!(await this.elements.prosseguirButton().isEnabled())) {
      throw new Error('BOOKING_PROSSEGUIR_BLOQUEADO');
    }

    await this.elements.prosseguirButton().click();
  }
}
