import { expect, Locator, Page } from '@playwright/test';
import { CidadaoSmartEmissaoAutenticacaoPageSelectors as S } from './selectors/CidadaoSmartEmissaoAutenticacaoPageSelectors';

export class CidadaoSmartEmissaoAutenticacaoPage {
  constructor(private readonly page: Page) {}

  async acessar(): Promise<void> {
    await this.page.goto('/emitir/nao-sei-meu-cpf');
    await expect(this.page).toHaveURL(S.route);
  }

  async validarTelaAutenticacao(): Promise<void> {
    await expect(this.page.getByText(S.titulo)).toBeVisible();
    await expect(this.page.getByText(S.textoAjuda)).toBeVisible();
    await expect(await this.obterCampoNomeCompleto()).toBeVisible();
    await expect(await this.obterCampoDataNascimento()).toBeVisible();
    await expect(await this.obterCampoNomeMaeCompleto()).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoVoltar })).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoProsseguir })).toBeVisible();
  }

  async telaCompativelComAutenticacao(): Promise<boolean> {
    const nome = await this.obterCampoNomeCompleto();
    const data = await this.obterCampoDataNascimento();
    return (await nome.count()) > 0 || (await data.count()) > 0;
  }

  async preencherNomeCompleto(valor: string): Promise<void> {
    await (await this.obterCampoNomeCompleto()).fill(valor);
  }

  async preencherDataNascimento(valor: string): Promise<void> {
    await (await this.obterCampoDataNascimento()).fill(valor);
  }

  async preencherNomeMaeCompleto(valor: string): Promise<void> {
    await (await this.obterCampoNomeMaeCompleto()).fill(valor);
  }

  async prosseguir(): Promise<void> {
    await this.page.getByRole('button', { name: S.botaoProsseguir }).click();
  }

  async validarErrosObrigatorios(): Promise<void> {
    await expect(this.page.getByText(S.erroObrigatorio)).toBeVisible();
  }

  async validarProsseguirDesabilitado(): Promise<void> {
    await expect(this.page.getByRole('button', { name: S.botaoProsseguir })).toBeDisabled();
  }

  private async obterCampoNomeCompleto(): Promise<Locator> {
    const byLabel = this.page.getByLabel(S.campoNomeCompleto);
    if ((await byLabel.count()) > 0) return byLabel.first();

    const byPlaceholder = this.page.getByPlaceholder(S.campoNomeCompleto);
    if ((await byPlaceholder.count()) > 0) return byPlaceholder.first();

    const byName = this.page.locator('input[name*="nome" i], input[id*="nome" i], input[type="text"]');
    return byName.first();
  }

  private async obterCampoDataNascimento(): Promise<Locator> {
    const byLabel = this.page.getByLabel(S.campoDataNascimento);
    if ((await byLabel.count()) > 0) return byLabel.first();

    const byPlaceholder = this.page.getByPlaceholder(S.campoDataNascimento);
    if ((await byPlaceholder.count()) > 0) return byPlaceholder.first();

    const byName = this.page.locator('input[name*="nascimento" i], input[id*="nascimento" i], input[name*="data" i], input[type="date"]');
    return byName.first();
  }

  private async obterCampoNomeMaeCompleto(): Promise<Locator> {
    const byLabel = this.page.getByLabel(S.campoNomeMaeCompleto);
    if ((await byLabel.count()) > 0) return byLabel.first();

    const byPlaceholder = this.page.getByPlaceholder(S.campoNomeMaeCompleto);
    if ((await byPlaceholder.count()) > 0) return byPlaceholder.first();

    const byName = this.page.locator('input[name*="mae" i], input[id*="mae" i], input[name*="m\u00e3e" i], input[id*="m\u00e3e" i]');
    return byName.first();
  }
}
