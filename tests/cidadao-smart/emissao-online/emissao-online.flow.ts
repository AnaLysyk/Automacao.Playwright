import { expect, Page } from '@playwright/test';
import { arquivoExiste, caminhoAbsoluto } from '../../../support/utils/arquivos';
import { EmissaoOnlineElements } from './emissao-online.elements';
import { emissaoOnlineData } from './emissao-online.data';

export class EmissaoOnlineFlow {
  private readonly elements: EmissaoOnlineElements;

  constructor(private readonly page: Page) {
    this.elements = new EmissaoOnlineElements(page);
  }

  async acessarEntradaCpf(): Promise<void> {
    await this.page.goto('/emitir');
  }

  async validarEntradaCpf(): Promise<void> {
    await expect(this.elements.cpfInput()).toBeVisible();
    await expect(this.elements.prosseguirButton()).toBeVisible();
  }

  async preencherCpfElegivel(): Promise<void> {
    if (!emissaoOnlineData.cpfElegivel) {
      throw new Error('CPF_ELEGIVEL_NAO_CONFIGURADO');
    }

    await this.elements.cpfInput().fill(emissaoOnlineData.cpfElegivel);
  }

  async acessarCapturaFacial(): Promise<void> {
    await this.page.goto('/emitir/captura');
  }

  async validarCapturaFacial(): Promise<void> {
    await expect(this.elements.enviarFotoButton()).toBeVisible();
    await expect(this.elements.usarCameraButton()).toBeVisible();
    await expect(this.elements.prosseguirButton()).toBeVisible();
  }

  async enviarFotoValida(): Promise<void> {
    if (!arquivoExiste(emissaoOnlineData.fotoValida)) {
      throw new Error('CIDADAO_SMART_VALID_PHOTO_PATH_NAO_CONFIGURADO');
    }

    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.elements.enviarFotoButton().click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(caminhoAbsoluto(emissaoOnlineData.fotoValida));
  }

  async confirmarFoto(): Promise<void> {
    await expect(this.elements.aceitarFotoButton()).toBeVisible();
    await this.elements.aceitarFotoButton().click();
    await expect(this.elements.fotoCapturadaMessage()).toBeVisible();
  }

  async acessarResumo(): Promise<void> {
    await this.page.goto('/emitir/resumo');
  }

  async resumoDisponivel(): Promise<boolean> {
    return this.elements.resumoDadosRequerente().isVisible({ timeout: 3_000 }).catch(() => false);
  }

  async validarResumo(): Promise<void> {
    await expect(this.elements.resumoDadosRequerente()).toBeVisible();
    await expect(this.elements.prosseguirButton()).toBeVisible();
  }

  async aceitarResumo(): Promise<void> {
    await expect(this.elements.aceiteResumo()).toBeVisible();
    await this.elements.aceiteResumo().click({ force: true });
  }
}
