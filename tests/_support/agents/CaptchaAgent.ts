import { Page } from '@playwright/test';
import { ExecutionContext } from '@support/types/ExecutionContext';
import { visualPause } from '@support/helpers/visualPause';

export class CaptchaAgent {
  constructor(private readonly page: Page) {}

  async detectarETratar(context: ExecutionContext): Promise<void> {
    await this.tratarCaptchaExpirado(context);

    const captchaVisivel = await this.isCaptchaVisivel();
    const mode = context.env.captchaMode;

    if (mode === 'disabled' && !captchaVisivel) {
      context.captchaStatus = 'disabled';
      console.log('[CAPTCHA] CAPTCHA_MODE=disabled. Nenhuma acao manual executada.');
      return;
    }

    if (mode === 'test' && !captchaVisivel) {
      context.captchaStatus = 'test';
      console.log('[CAPTCHA] CAPTCHA_MODE=test. Aguardando ambiente QA com bypass oficial.');
      return;
    }

    if (!captchaVisivel && mode !== 'manual') {
      context.captchaStatus = mode;
      console.log(`[CAPTCHA] Nenhum CAPTCHA visivel. Modo atual: ${mode}.`);
      return;
    }

    context.captchaStatus = 'manual';
    console.warn('[CAPTCHA] CAPTCHA detectado ou modo manual habilitado.');
    await visualPause(
      this.page,
      '[CAPTCHA] Resolva o CAPTCHA no navegador. Se necessario, clique em Prosseguir e depois Resume no Playwright.'
    );

    if (this.page.isClosed()) {
      throw new Error('[CAPTCHA] Browser/page fechado durante a resolucao manual do CAPTCHA.');
    }

    console.log(`[CAPTCHA] Resume recebido. URL atual: ${this.page.url()}`);

    await this.tratarCaptchaExpirado(context);
  }

  private async isCaptchaVisivel(): Promise<boolean> {
    if (this.page.isClosed()) return false;
    const captchaIframe = this.page.locator('iframe[src*="recaptcha"], iframe[src*="api2/anchor"]');
    const captchaTexto = this.page.getByText(/nao sou um robo|não sou um robô|selecione todas as imagens/i);
    return (await captchaIframe.count().catch(() => 0)) > 0 || (await captchaTexto.count().catch(() => 0)) > 0;
  }

  private async isCaptchaExpiradoVisivel(): Promise<boolean> {
    if (this.page.isClosed()) return false;
    const modal = this.page.getByText(/captcha expirado/i);
    return (await modal.count().catch(() => 0)) > 0 && (await modal.first().isVisible().catch(() => false));
  }

  private async tratarCaptchaExpirado(context: ExecutionContext): Promise<void> {
    for (let tentativa = 0; tentativa < 2; tentativa += 1) {
      if (!(await this.isCaptchaExpiradoVisivel())) return;

      context.captchaStatus = 'expirado';
      console.warn('[CAPTCHA] Captcha expirado detectado. Fechando modal e aguardando nova resolucao.');

      const botaoFechar = this.page.getByRole('button', { name: /fechar|ok/i }).first();
      if ((await botaoFechar.count()) > 0) {
        await botaoFechar.click();
      }

      await visualPause(
        this.page,
        '[CAPTCHA] Captcha expirado. Resolva novamente no navegador e clique em Resume.'
      );
    }
  }
}
