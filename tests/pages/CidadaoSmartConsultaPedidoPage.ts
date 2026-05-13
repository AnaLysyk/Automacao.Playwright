import { expect, Page } from '@playwright/test';
import { CidadaoSmartConsultaPedidoPageSelectors as S } from './selectors/CidadaoSmartConsultaPedidoPageSelectors';

export class CidadaoSmartConsultaPedidoPage {
  constructor(private readonly page: Page) {}

  async acessar(): Promise<void> {
    await this.page.goto('/consulta-protocolo');
    await expect(this.page).toHaveURL(S.route);
  }

  async validarTelaConsultaPedido(): Promise<void> {
    await expect(this.page.getByText(S.titulo)).toBeVisible();
    await expect(this.page.getByText(S.textoAjuda)).toBeVisible();
    await expect(this.page.getByLabel(S.campoProtocolo)).toBeVisible();
    await expect(this.page.getByLabel(S.campoDataNascimento)).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoVoltar })).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoProsseguir })).toBeVisible();
  }

  async preencherProtocolo(valor: string): Promise<void> {
    await this.page.getByLabel(S.campoProtocolo).fill(valor);
  }

  async preencherDataNascimento(valor: string): Promise<void> {
    await this.page.getByLabel(S.campoDataNascimento).fill(valor);
  }

  async prosseguir(): Promise<void> {
    await this.page.getByRole('button', { name: S.botaoProsseguir }).click();
  }

  async validarErrosObrigatorios(): Promise<void> {
    await expect(this.page.getByText(S.erroObrigatorio)).toBeVisible();
  }
}
