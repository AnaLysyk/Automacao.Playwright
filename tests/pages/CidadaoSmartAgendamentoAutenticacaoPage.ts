import { expect, Page } from '@playwright/test';
import { CidadaoSmartAgendamentoAutenticacaoPageSelectors as S } from './selectors/CidadaoSmartAgendamentoAutenticacaoPageSelectors';

export class CidadaoSmartAgendamentoAutenticacaoPage {
  constructor(private readonly page: Page) {}

  async validarTelaAutenticacao(): Promise<void> {
    await expect(this.page).toHaveURL(S.route);
    await expect(this.page.getByText(S.tituloAutenticacao)).toBeVisible();
    await expect(this.page.getByText(S.mensagemCodigoEnviado)).toBeVisible();
    await expect(this.page.getByLabel(S.campoCodigoSeguranca)).toBeVisible();
  }

  async preencherCodigoSeguranca(codigo: string): Promise<void> {
    await this.page.getByLabel(S.campoCodigoSeguranca).fill(codigo);
  }

  async verificarCodigo(): Promise<void> {
    await this.page.getByRole('button', { name: S.botaoVerificar }).click();
  }

  async validarCodigoValidado(): Promise<void> {
    await expect(this.page.getByText(S.mensagemCodigoValidado)).toBeVisible();
  }

  async prosseguir(): Promise<void> {
    await this.page.getByRole('button', { name: S.botaoProsseguir }).click();
  }
}
