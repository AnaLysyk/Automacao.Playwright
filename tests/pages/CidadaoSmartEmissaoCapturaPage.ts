import path from 'path';
import { expect, Page } from '@playwright/test';
import { CidadaoSmartEmissaoCapturaPageSelectors as S } from './selectors/CidadaoSmartEmissaoCapturaPageSelectors.ts';

export class CidadaoSmartEmissaoCapturaPage {
  constructor(private readonly page: Page) {}

  async acessar(): Promise<void> {
    await this.page.goto('/emitir/captura');
    await expect(this.page).toHaveURL(S.route);
  }

  async validarTelaCaptura(): Promise<void> {
    await expect(this.page.getByText(S.titulo)).toBeVisible();
    for (const recomendacao of S.recomendacoes) {
      await expect(this.page.getByText(recomendacao)).toBeVisible();
    }

    await expect(this.page.getByRole('button', { name: S.botaoEnviarNovaFoto })).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoUsarCamera })).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoVoltar })).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoProsseguir })).toBeVisible();
  }

  async enviarNovaFoto(caminhoRelativoArquivo: string): Promise<void> {
    const caminhoAbsoluto = path.resolve(caminhoRelativoArquivo);
    const fileChooserPromise = this.page.waitForEvent('filechooser');

    await this.page.getByRole('button', { name: S.botaoEnviarNovaFoto }).click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(caminhoAbsoluto);
  }

  async aceitarAjusteFoto(): Promise<void> {
    await expect(this.page.getByText(S.modalAjustarFoto)).toBeVisible();
    await this.page.getByRole('button', { name: S.botaoAceitar }).click();
  }

  async validarFotoCapturadaComSucesso(): Promise<void> {
    await expect(this.page.getByText(S.sucessoFotoCapturada)).toBeVisible();
  }

  async validarProsseguirHabilitado(): Promise<void> {
    await expect(this.page.getByRole('button', { name: S.botaoProsseguir })).toBeEnabled();
  }

  async prosseguir(): Promise<void> {
    await this.page.getByRole('button', { name: S.botaoProsseguir }).click();
  }
}
