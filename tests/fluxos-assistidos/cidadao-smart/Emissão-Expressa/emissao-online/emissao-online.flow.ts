import type { Page } from '@playwright/test';
import { arquivoExiste, caminhoAbsoluto } from '../../../../../support/utils/arquivos';
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

  async entradaCpfVisivel(): Promise<boolean> {
    return this.todosVisiveis([
      this.elements.cpfInput().isVisible({ timeout: 15_000 }),
      this.elements.prosseguirButton().isVisible({ timeout: 15_000 }),
    ]);
  }

  cpfElegivelConfigurado(): boolean {
    return Boolean(emissaoOnlineData.cpfElegivel);
  }

  fotoValidaConfigurada(): boolean {
    return arquivoExiste(emissaoOnlineData.fotoValida);
  }

  async preencherCpfElegivel(): Promise<void> {
    if (!emissaoOnlineData.cpfElegivel) {
      throw new Error('CPF_ELEGIVEL_NAO_CONFIGURADO');
    }

    await this.preencherCpf(emissaoOnlineData.cpfElegivel);
  }

  async preencherCpf(cpf: string): Promise<void> {
    await this.elements.cpfInput().fill(cpf);
  }

  async cpfPreenchidoCom(cpf: string): Promise<boolean> {
    const valorPreenchido = await this.elements.cpfInput().inputValue();

    return this.apenasDigitos(valorPreenchido) === this.apenasDigitos(cpf);
  }

  async prosseguirSeDisponivel(): Promise<boolean> {
    const botao = this.elements.prosseguirButton();
    const habilitado = await botao.isEnabled().catch(() => false);

    if (!habilitado) return false;

    await botao.click();
    return true;
  }

  async acessarCapturaFacial(): Promise<void> {
    await this.page.goto('/emitir/captura');
  }

  async capturaFacialVisivel(): Promise<boolean> {
    return this.todosVisiveis([
      this.elements.enviarFotoButton().isVisible({ timeout: 15_000 }),
      this.elements.usarCameraButton().isVisible({ timeout: 15_000 }),
      this.elements.prosseguirButton().isVisible({ timeout: 15_000 }),
    ]);
  }

  async enviarFotoValida(): Promise<void> {
    if (!this.fotoValidaConfigurada()) {
      throw new Error('CIDADAO_SMART_VALID_PHOTO_PATH_NAO_CONFIGURADO');
    }

    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.elements.enviarFotoButton().click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(caminhoAbsoluto(emissaoOnlineData.fotoValida));
  }

  async confirmarFoto(): Promise<void> {
    await this.elements.aceitarFotoButton().click();
  }

  async fotoConfirmadaVisivel(): Promise<boolean> {
    return this.elements.fotoCapturadaMessage().isVisible({ timeout: 15_000 }).catch(() => false);
  }

  async acessarResumo(): Promise<void> {
    await this.page.goto('/emitir/resumo');
  }

  async resumoDisponivel(): Promise<boolean> {
    return this.elements.resumoDadosRequerente().isVisible({ timeout: 3_000 }).catch(() => false);
  }

  async resumoVisivel(): Promise<boolean> {
    return this.todosVisiveis([
      this.elements.resumoDadosRequerente().isVisible({ timeout: 15_000 }),
      this.elements.prosseguirButton().isVisible({ timeout: 15_000 }),
    ]);
  }

  async aceitarResumo(): Promise<void> {
    await this.elements.aceiteResumo().click({ force: true });
  }

  private async todosVisiveis(checagens: Array<Promise<boolean>>): Promise<boolean> {
    const resultados = await Promise.all(checagens.map((checagem) => checagem.catch(() => false)));

    return resultados.every(Boolean);
  }

  private apenasDigitos(valor: string): string {
    return valor.replace(/\D/g, '');
  }
}
