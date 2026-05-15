import { expect, Locator, Page } from '@playwright/test';
import { CidadaoSmartEmissaoResumoPageSelectors as S } from './selectors/CidadaoSmartEmissaoResumoPageSelectors.ts';
import { ServicePoint, cidadaoSmartServicePoints } from '../support/data/cidadaoSmartServicePoints';

export class CidadaoSmartEmissaoResumoPage {
  constructor(private readonly page: Page) {}

  async acessar(): Promise<void> {
    await this.page.goto('/emitir/resumo');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async validarTelaResumo(): Promise<void> {
    await expect(this.page.getByText(S.tituloDadosRequerente)).toBeVisible();
    await expect(this.page.getByText(S.tituloLocalRetirada)).toBeVisible();
    await expect(this.page.getByText(S.horarioAtendimento)).toBeVisible();
    await expect(this.page.getByText(S.emailPosto).first()).toBeVisible();
    await expect(this.page.getByText(S.telefonePosto).first()).toBeVisible();

    const aceite = await this.obterControleAceite();
    await expect(aceite).toBeVisible();

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
    const botaoProsseguir = this.page.getByRole('button', { name: S.botaoProsseguir }).first();
    await expect(botaoProsseguir).toBeVisible();

    if (await botaoProsseguir.isEnabled().catch(() => false)) {
      return;
    }

    await expect(botaoProsseguir).toBeDisabled();
  }

  async marcarAceite(): Promise<void> {
    const aceite = await this.obterControleAceite();

    await expect(aceite).toBeVisible();
    await aceite.click({ force: true });

    await this.page.waitForTimeout(500).catch(() => undefined);
  }

  async validarProsseguirHabilitado(): Promise<void> {
    const botaoProsseguir = this.page.getByRole('button', { name: S.botaoProsseguir }).first();

    await expect(botaoProsseguir).toBeVisible();
    await expect(botaoProsseguir).toBeEnabled();
  }

  async prosseguir(): Promise<void> {
    const botaoProsseguir = this.page.getByRole('button', { name: S.botaoProsseguir }).first();

    await expect(botaoProsseguir).toBeVisible();
    await expect(botaoProsseguir).toBeEnabled();

    const aguardarTelaSucesso = this.page
      .waitForURL(/\/emitir\/sucesso/i, { timeout: 60_000 })
      .catch(() => undefined);

    await botaoProsseguir.click();
    await aguardarTelaSucesso;
  }

  private async obterControleAceite(): Promise<Locator> {
    const candidatos = [
      this.page.getByRole('checkbox', { name: S.aceite }).first(),
      this.page.getByRole('checkbox').first(),
      this.page.locator('.size-6.left-0.top-0.absolute.overflow-hidden').first(),
      this.page.locator('[class*="size-6"][class*="absolute"][class*="overflow-hidden"]').first(),
      this.page.getByText(S.aceite).first(),
      this.page
        .locator('div, label, button')
        .filter({ hasText: S.aceite })
        .first(),
    ];

    for (const candidato of candidatos) {
      if (await candidato.isVisible({ timeout: 2_000 }).catch(() => false)) {
        return candidato;
      }
    }

    throw new Error('EMISSAO_RESUMO_ACEITE_NAO_ENCONTRADO');
  }
}
