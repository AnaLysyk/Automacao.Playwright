import { expect, Page } from '@playwright/test';
import { CidadaoSmartEmissaoResumoPageSelectors as S } from './selectors/CidadaoSmartEmissaoResumoPageSelectors';
import { ServicePoint, cidadaoSmartServicePoints } from '../support/data/cidadaoSmartServicePoints';

export class CidadaoSmartEmissaoResumoPage {
  constructor(private readonly page: Page) {}

  async acessar(): Promise<void> {
    await this.page.goto('/emitir/resumo');
    await expect(this.page).toHaveURL(S.route);
  }

  async validarTelaResumo(): Promise<void> {
    await expect(this.page.getByText(S.tituloDadosRequerente)).toBeVisible();
    await expect(this.page.getByText(S.tituloLocalRetirada)).toBeVisible();
    await expect(this.page.getByText(S.horarioAtendimento)).toBeVisible();
    await expect(this.page.getByText(S.emailPosto)).toBeVisible();
    await expect(this.page.getByText(S.telefonePosto)).toBeVisible();
    await expect(this.page.getByRole('checkbox', { name: S.aceite })).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoVoltar })).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoProsseguir })).toBeVisible();
  }

  async validarPostoSelecionado(servicePoint: ServicePoint): Promise<void> {
    await expect(this.page.getByText(servicePoint.nome)).toBeVisible();
    await expect(this.page.getByText(servicePoint.enderecoParcial)).toBeVisible();

    for (const other of cidadaoSmartServicePoints.filter((sp) => sp.id !== servicePoint.id)) {
      await expect(this.page.getByText(other.nome)).toHaveCount(0);
    }
  }

  async validarProsseguirDesabilitado(): Promise<void> {
    await expect(this.page.getByRole('button', { name: S.botaoProsseguir })).toBeDisabled();
  }

  async marcarAceite(): Promise<void> {
    await this.page.getByRole('checkbox', { name: S.aceite }).check();
  }

  async validarProsseguirHabilitado(): Promise<void> {
    await expect(this.page.getByRole('button', { name: S.botaoProsseguir })).toBeEnabled();
  }
}
