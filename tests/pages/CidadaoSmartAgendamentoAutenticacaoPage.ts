import { expect, Locator, Page } from '@playwright/test';
import { CidadaoSmartAgendamentoAutenticacaoPageSelectors as S } from './selectors/CidadaoSmartAgendamentoAutenticacaoPageSelectors.ts';

export class CidadaoSmartAgendamentoAutenticacaoPage {
  constructor(private readonly page: Page) {}

  /**
   * Valida a tela de autenticacao aceitando dois estados validos:
   * codigo ainda pendente ou codigo ja validado automaticamente pelo ambiente.
   */
  async validarTelaAutenticacao(): Promise<void> {
    await expect(this.page).toHaveURL(S.route);
    await expect(this.page.getByText(S.tituloAutenticacao)).toBeVisible();

    if (await this.codigoJaValidado()) {
      return;
    }

    await expect(this.page.getByText(S.mensagemCodigoEnviado)).toBeVisible();
    await expect(await this.obterCampoCodigoSeguranca()).toBeVisible();
  }

  /**
   * Preenche o codigo somente quando o campo existe; se a tela ja validou,
   * a automacao segue sem tentar interagir com um input ausente.
   */
  async preencherCodigoSeguranca(codigo: string): Promise<void> {
    if (await this.codigoJaValidado()) {
      return;
    }

    await (await this.obterCampoCodigoSeguranca()).fill(codigo);
  }

  /**
   * Clica em Verificar quando ainda ha desafio de e-mail pendente.
   */
  async verificarCodigo(): Promise<void> {
    if (await this.codigoJaValidado()) {
      return;
    }

    await this.page.getByRole('button', { name: S.botaoVerificar }).click();
  }

  async validarCodigoValidado(): Promise<void> {
    await expect(this.page.getByText(S.mensagemCodigoValidado)).toBeVisible();
  }

  async codigoJaValidado(): Promise<boolean> {
    return this.page
      .getByText(S.mensagemCodigoValidado)
      .first()
      .isVisible({ timeout: 2_000 })
      .catch(() => false);
  }

  async prosseguir(): Promise<void> {
    await this.page.getByRole('button', { name: S.botaoProsseguir }).click();
  }

  /**
   * Procura o input do codigo por label, placeholder, atributo ou fallback generico.
   */
  private async obterCampoCodigoSeguranca(): Promise<Locator> {
    const locators = [
      this.page.getByLabel(S.campoCodigoSeguranca),
      this.page.getByPlaceholder(S.campoCodigoSeguranca),
      this.page.getByRole('textbox', { name: S.campoCodigoSeguranca }),
      this.page.locator('input[autocomplete="one-time-code"]').first(),
      this.page.locator('input[name*="codigo" i], input[id*="codigo" i]').first(),
      this.page.locator('input[type="text"], input[type="tel"], input:not([type])').first(),
    ];

    for (const locator of locators) {
      const campo = locator.first();
      if (await campo.isVisible({ timeout: 1_000 }).catch(() => false)) {
        return campo;
      }
    }

    throw new Error('Campo de codigo de seguranca nao encontrado na tela de autenticacao.');
  }
}
