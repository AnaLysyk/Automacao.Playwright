import { expect, Page } from '@playwright/test';
import { CidadaoSmartEmissaoTipoPageSelectors as S } from './selectors/CidadaoSmartEmissaoTipoPageSelectors.ts';

export class CidadaoSmartEmissaoTipoPage {
  constructor(private readonly page: Page) {}

  async acessar(): Promise<void> {
    await this.page.goto('/emitir/tipo-emissao');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async validarTelaTipoEmissao(): Promise<void> {
    await expect(this.page.getByText(S.titulo)).toBeVisible();
    await expect(this.page.getByText(S.opcaoSegundaViaComAlteracoes)).toBeVisible();
    await expect(this.page.getByText(S.opcaoReimpressao)).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoVoltar })).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoProsseguir })).toBeVisible();
  }

  async telaCompativelComTipoEmissao(): Promise<boolean> {
    const botaoProsseguir = this.page.getByRole('button', { name: S.botaoProsseguir }).first();
    const opcaoReimpressao = this.page.getByText(S.opcaoReimpressao).first();
    const opcaoAlteracoes = this.page.getByText(S.opcaoSegundaViaComAlteracoes).first();

    return (
      (await this.estaVisivel(botaoProsseguir)) &&
      (await this.estaVisivel(opcaoReimpressao)) &&
      (await this.estaVisivel(opcaoAlteracoes))
    );
  }

  async selecionarReimpressao(): Promise<void> {
    const radio = this.page.getByRole('radio', { name: S.opcaoReimpressao });
    if ((await radio.count()) > 0) {
      await radio.check();
      return;
    }
    const opcao = this.page.getByText(S.opcaoReimpressao).first();
    await this.clicarComRetry(opcao);
  }

  async selecionarSegundaViaComAlteracoes(): Promise<void> {
    const radio = this.page.getByRole('radio', { name: S.opcaoSegundaViaComAlteracoes });
    if ((await radio.count()) > 0) {
      await radio.check();
      return;
    }
    const opcao = this.page.getByText(S.opcaoSegundaViaComAlteracoes).first();
    await this.clicarComRetry(opcao);
  }

  async prosseguir(): Promise<void> {
    const botaoProsseguir = this.page.getByRole('button', { name: S.botaoProsseguir }).first();

    for (let tentativa = 0; tentativa < 3; tentativa += 1) {
      try {
        await expect(botaoProsseguir).toBeVisible({ timeout: 5_000 });
        await expect(botaoProsseguir).toBeEnabled({ timeout: 5_000 });
        await botaoProsseguir.click({ timeout: 5_000 });
        return;
      } catch {
        if (tentativa === 2) {
          throw new Error('Falha ao clicar em Prosseguir na tela de tipo de emissao apos retries.');
        }

        await this.page.waitForTimeout(500);
      }
    }
  }

  private async clicarComRetry(opcao: ReturnType<Page['getByText']>): Promise<void> {
    for (let tentativa = 0; tentativa < 3; tentativa += 1) {
      try {
        await opcao.scrollIntoViewIfNeeded({ timeout: 3_000 });
        await opcao.click({ timeout: 3000 });
        return;
      } catch {
        if (tentativa === 2) throw new Error('Falha ao selecionar opcao de tipo de emissao apos retries.');
      }
    }
  }

  private async estaVisivel(locator: ReturnType<Page['getByText']>): Promise<boolean> {
    return locator
      .waitFor({ state: 'visible', timeout: 2_000 })
      .then(() => true)
      .catch(() => false);
  }
}
