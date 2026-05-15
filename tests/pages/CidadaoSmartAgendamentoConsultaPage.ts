import { expect, Locator, Page } from '@playwright/test';
import { CidadaoSmartAgendamentoConsultaPageSelectors as S } from './selectors/CidadaoSmartAgendamentoConsultaPageSelectors.ts';

export class CidadaoSmartAgendamentoConsultaPage {
  constructor(private readonly page: Page) {}

  async acessar(): Promise<void> {
    await this.page.goto('/agendamentos/consultar');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async validarTelaConsultaAgendamento(): Promise<void> {
    await expect(this.page.getByText(S.titulo)).toBeVisible();
    await expect(await this.obterCampoProtocolo()).toBeVisible();
    await expect(await this.obterCampoDataNascimento()).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoVoltar })).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoProsseguir })).toBeVisible();
  }

  async telaCompativelComConsultaAgendamento(): Promise<boolean> {
    const tituloVisivel = await this.page
      .getByText(S.titulo)
      .first()
      .waitFor({ state: 'visible', timeout: 3_000 })
      .then(() => true)
      .catch(() => false);
    const campoProtocoloVisivel = await this.existeLocatorVisivel(this.locatorsCampoProtocolo());
    const campoDataVisivel = await this.existeLocatorVisivel(this.locatorsCampoDataNascimento());

    return tituloVisivel && campoProtocoloVisivel && campoDataVisivel;
  }

  async preencherProtocolo(valor: string): Promise<void> {
    await (await this.obterCampoProtocolo()).fill(valor);
  }

  async preencherDataNascimento(valor: string): Promise<void> {
    await (await this.obterCampoDataNascimento()).fill(valor);
  }

  async prosseguir(): Promise<void> {
    const botaoProsseguir = this.page.getByRole('button', { name: S.botaoProsseguir }).first();
    await expect(botaoProsseguir).toBeVisible();

    if (!(await botaoProsseguir.isEnabled())) {
      throw new Error('CONSULTA_AGENDAMENTO_PROSSEGUIR_BLOQUEADO');
    }

    await botaoProsseguir.click();
  }

  async tentarProsseguir(): Promise<boolean> {
    const botaoProsseguir = this.page.getByRole('button', { name: S.botaoProsseguir }).first();
    await expect(botaoProsseguir).toBeVisible();

    if (!(await botaoProsseguir.isEnabled())) {
      return false;
    }

    await botaoProsseguir.click();
    return true;
  }

  async validarProsseguirDesabilitado(): Promise<void> {
    await expect(this.page.getByRole('button', { name: S.botaoProsseguir }).first()).toBeDisabled();
  }

  async validarErrosObrigatorios(): Promise<void> {
    await expect(this.page.getByText(S.erroObrigatorio)).toBeVisible();
  }

  private locatorsCampoProtocolo(): Locator[] {
    return [
      this.page.getByLabel(S.campoProtocolo),
      this.page.getByPlaceholder(/protocolo/i),
      this.page.locator('input[name*="protocolo" i], input[id*="protocolo" i], input[placeholder*="protocolo" i]').first(),
      this.page.getByRole('textbox').first(),
      this.page.locator('input[type="text"]').first(),
    ];
  }

  private locatorsCampoDataNascimento(): Locator[] {
    return [
      this.page.getByLabel(S.campoDataNascimento),
      this.page.getByPlaceholder(/dd\/mm\/aaaa|data/i),
      this.page.locator('input[name*="nascimento" i], input[id*="nascimento" i], input[placeholder*="dd/mm/aaaa" i]').first(),
      this.page.getByRole('textbox').nth(1),
      this.page.locator('input[type="text"]').nth(1),
    ];
  }

  private async obterCampoProtocolo(): Promise<Locator> {
    return this.obterPrimeiroLocatorVisivel(this.locatorsCampoProtocolo(), 'Campo de protocolo nao encontrado na consulta de agendamento.');
  }

  private async obterCampoDataNascimento(): Promise<Locator> {
    return this.obterPrimeiroLocatorVisivel(this.locatorsCampoDataNascimento(), 'Campo de data de nascimento nao encontrado na consulta de agendamento.');
  }

  private async existeLocatorVisivel(locators: Locator[]): Promise<boolean> {
    return (await this.tentarObterPrimeiroLocatorVisivel(locators)) !== null;
  }

  private async obterPrimeiroLocatorVisivel(locators: Locator[], mensagemErro: string): Promise<Locator> {
    const locator = await this.tentarObterPrimeiroLocatorVisivel(locators);

    if (!locator) {
      throw new Error(mensagemErro);
    }

    return locator;
  }

  private async tentarObterPrimeiroLocatorVisivel(locators: Locator[]): Promise<Locator | null> {
    for (const locator of locators) {
      const primeiro = locator.first();
      const visivel = await primeiro
        .waitFor({ state: 'visible', timeout: 3_000 })
        .then(() => true)
        .catch(() => false);

      if (visivel) {
        return primeiro;
      }
    }

    return null;
  }
}
