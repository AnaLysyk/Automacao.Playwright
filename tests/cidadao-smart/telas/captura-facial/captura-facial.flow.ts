import { expect, Page } from '@playwright/test';
import { caminhoAbsoluto } from '../../../../support/utils/arquivos';
import { CapturaFacialElements } from './captura-facial.elements';

export class CapturaFacialFlow {
  private readonly elements: CapturaFacialElements;

  constructor(private readonly page: Page) {
    this.elements = new CapturaFacialElements(page);
  }

  async acessar(): Promise<void> {
    await this.page.goto('/emitir/captura');
    await expect(this.page).toHaveURL(/\/emitir\/captura/);
  }

  async validarTela(): Promise<void> {
    await expect(this.elements.titulo()).toBeVisible();
    await expect(this.elements.enviarNovaFotoButton()).toBeVisible();
    await expect(this.elements.usarCameraButton()).toBeVisible();
    await expect(this.elements.prosseguirButton()).toBeVisible();
  }

  async enviarImagem(caminhoArquivo: string): Promise<void> {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.elements.enviarNovaFotoButton().click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(caminhoAbsoluto(caminhoArquivo));
  }

  async aceitarAjuste(): Promise<void> {
    await expect(this.elements.aceitarAjusteButton()).toBeVisible();
    await this.elements.aceitarAjusteButton().click();
  }

  async validarImagemAceita(): Promise<void> {
    await expect(this.elements.sucessoFotoMessage()).toBeVisible();
    await expect(this.elements.prosseguirButton()).toBeEnabled();
  }
}
