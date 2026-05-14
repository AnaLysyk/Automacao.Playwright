import { expect, Page } from '@playwright/test';
import { loadEnvConfig } from '../config/env';
import { EvidenceAgent } from './EvidenceAgent';
import { ExecutionContext } from '../types/ExecutionContext';
import { visualPause } from '../helpers/visualPause';

export class CaptureAgent {
  private readonly env = loadEnvConfig();

  constructor(
    private readonly page: Page,
    private readonly context?: ExecutionContext,
    private readonly evidenceAgent?: EvidenceAgent
  ) {}

  /**
   * Eu preparo a captura conforme CAPTURE_MODE antes de interagir com a tela.
   */
  async prepararCaptura(): Promise<void> {
    console.log(`[CAPTURE] Modo de captura: ${this.env.captureMode}`);
    this.context && (this.context.captureStatus = this.env.captureMode);

    if (this.env.captureMode === 'fake-video') {
      await this.concederPermissaoCamera();
      return;
    }

    if (this.env.captureMode === 'disabled') {
      console.warn('[CAPTURE] Captura marcada como disabled. Usar somente em QA controlado.');
    }
  }

  /**
   * Eu concedo permissão de câmera e microfone para a origem configurada.
   */
  async concederPermissaoCamera(): Promise<void> {
    const origin = this.env.cidadaoSmartBaseUrl;
    await this.page.context().grantPermissions(['camera', 'microphone'], { origin });
    console.log('[CAPTURE] Permissão de câmera concedida.');
  }

  /**
   * Eu valido se a tela exibiu um preview de câmera em elemento video.
   */
  async validarPreviewCamera(): Promise<void> {
    const preview = this.page.locator('video').first();
    await expect(preview).toBeVisible({ timeout: 15_000 });

    this.context && (this.context.captureStatus = 'preview-detectado');
    console.log('[CAPTURE] Preview de câmera detectado.');
  }

  /**
   * Eu executo a captura em modo manual, fake-video ou disabled.
   */
  async executarCaptura(): Promise<void> {
    if (this.env.captureMode === 'disabled') {
      this.context && (this.context.captureStatus = 'disabled');
      console.warn('[CAPTURE] Captura pulada por CAPTURE_MODE=disabled.');
      return;
    }

    if (this.env.captureMode === 'manual') {
      this.context && (this.context.captureStatus = 'manual');
      await visualPause(this.page, '[CAPTURE] Realize a captura manualmente e clique em Resume.');
      await this.registrarEvidencia('captura-manual');
      return;
    }

    await this.validarPreviewCamera();
    await this.clicarBotaoCapturaQuandoDisponivel();
    this.context && (this.context.captureStatus = 'capturada');
    await this.registrarEvidencia('captura-fake-video');
    console.log('[CAPTURE] Captura realizada.');
  }

  /**
   * Eu classifico a falha de captura e registro evidência antes de relançar o erro.
   */
  async tratarFalhaCaptura(error: unknown): Promise<void> {
    this.context && (this.context.captureStatus = 'falha');
    console.error('[CAPTURE][FALHA] Possível problema no Capturing, permissão de câmera ou vídeo fake.', error);
    await this.registrarEvidencia('captura-falha');
    throw error;
  }

  /**
   * Eu tento acionar o botão de captura quando a tela exige clique manual.
   */
  private async clicarBotaoCapturaQuandoDisponivel(): Promise<void> {
    const botao = this.page
      .getByRole('button', { name: /capturar|tirar foto|usar foto|confirmar|continuar|prosseguir/i })
      .first();

    const visivel = await botao.isVisible({ timeout: 5_000 }).catch(() => false);
    if (!visivel) return;

    const habilitado = await botao.isEnabled().catch(() => false);
    if (habilitado) {
      await botao.click();
    }
  }

  /**
   * Eu delego a evidência para o EvidenceAgent quando ele está disponível.
   */
  private async registrarEvidencia(nome: string): Promise<void> {
    if (!this.evidenceAgent) return;

    await this.evidenceAgent.capture(nome, {
      description: 'Evidência da etapa de captura',
      status: this.context?.captureStatus === 'falha' ? 'falha' : 'parcial',
      category: 'captura',
    });
  }
}
