import { expect, Page } from '@playwright/test';
import { CidadaoSmartEmissaoTipoPageSelectors as S } from './selectors/CidadaoSmartEmissaoTipoPageSelectors';

export class CidadaoSmartEmissaoTipoPage {
  constructor(private readonly page: Page) {}

  async acessar(): Promise<void> {
    await this.page.goto('/emitir/tipo-emissao');
    await expect(this.page).toHaveURL(S.route);
  }

  async validarTelaTipoEmissao(): Promise<void> {
    await expect(this.page.getByText(S.titulo)).toBeVisible();
    await expect(this.page.getByText(S.opcaoSegundaViaComAlteracoes)).toBeVisible();
    await expect(this.page.getByText(S.opcaoReimpressao)).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoVoltar })).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoProsseguir })).toBeVisible();
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
    await this.page.getByRole('button', { name: S.botaoProsseguir }).click();
  }

  private async clicarComRetry(opcao: ReturnType<Page['getByText']>): Promise<void> {
    for (let tentativa = 0; tentativa < 3; tentativa += 1) {
      try {
        await opcao.scrollIntoViewIfNeeded();
        await opcao.click({ timeout: 3000 });
        return;
      } catch {
        if (tentativa === 2) throw new Error('Falha ao selecionar opcao de tipo de emissao apos retries.');
      }
    }
  }
}
