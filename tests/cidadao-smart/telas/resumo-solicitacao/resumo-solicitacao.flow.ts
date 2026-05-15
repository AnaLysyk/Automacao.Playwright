import { expect, Page } from '@playwright/test';
import { ResumoSolicitacaoElements } from './resumo-solicitacao.elements';

export class ResumoSolicitacaoFlow {
  private readonly elements: ResumoSolicitacaoElements;

  constructor(private readonly page: Page) {
    this.elements = new ResumoSolicitacaoElements(page);
  }

  async acessar(): Promise<void> {
    await this.page.goto('/emitir/resumo');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async telaVisivel(): Promise<boolean> {
    return this.elements.dadosRequerenteTitle().isVisible({ timeout: 3_000 }).catch(() => false);
  }

  async validarResumo(): Promise<void> {
    await expect(this.elements.dadosRequerenteTitle()).toBeVisible();
    await expect(this.elements.localRetiradaTitle()).toBeVisible();
    await expect(this.elements.prosseguirButton()).toBeVisible();
  }

  async aceitarTermos(): Promise<void> {
    await expect(this.elements.aceiteControl()).toBeVisible();
    await this.elements.aceiteControl().click({ force: true });
  }
}
