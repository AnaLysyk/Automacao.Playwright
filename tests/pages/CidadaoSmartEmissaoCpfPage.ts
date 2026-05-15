import { expect, Locator, Page } from '@playwright/test';
import { CidadaoSmartEmissaoCpfPageSelectors as S } from './selectors/CidadaoSmartEmissaoCpfPageSelectors.ts';
import { visualPause } from '../helpers/visualPause';

export class CidadaoSmartEmissaoCpfPage {
  constructor(private readonly page: Page) {}

  /**
   * Abre a autenticacao por CPF, que e a entrada real da emissao online.
   */
  async acessar(): Promise<void> {
    await this.page.goto('/emitir');
    await expect(this.page).toHaveURL(S.route);
  }

  /**
   * Confirma que a tela carregou com CPF, botoes principais e atalho sem CPF.
   */
  async validarTelaCpf(): Promise<void> {
    await expect(await this.obterCampoCpf()).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoVoltar }).first()).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoProsseguir }).first()).toBeVisible();
  }

  /**
   * Preenche o CPF da massa finalizada sem gravar esse valor no codigo.
   */
  async preencherCpf(cpf: string): Promise<void> {
    await (await this.obterCampoCpf()).fill(cpf);
  }

  /**
   * Informa se a jornada ainda esta na entrada por CPF.
   */
  async estaNaTelaCpf(): Promise<boolean> {
    return this.obterCampoCpf()
      .then((campo) => campo.isVisible({ timeout: 2_000 }))
      .catch(() => false);
  }

  /**
   * Preenche contato quando o backend pede e-mail e telefone antes do codigo.
   */
  async preencherContatoSeNecessario(email: string, telefone: string): Promise<void> {
    const campoEmail = await this.obterCampoEmailOpcional();
    const campoTelefone = await this.obterCampoTelefoneOpcional();

    if (!campoEmail && !campoTelefone) {
      return;
    }

    if (!email || !telefone) {
      throw new Error('EMISSAO_CONTATO_OBRIGATORIO: informe email e telefone para receber o codigo.');
    }

    if (campoEmail) {
      await campoEmail.fill(email);
    }

    if (campoTelefone) {
      await campoTelefone.fill(telefone);
    }

    await this.clicarProsseguirAtual();
  }

  /**
   * Resolve a etapa de codigo por env ou por pausa manual assistida.
   */
  async tratarCodigoSeNecessario(): Promise<void> {
    if (await this.codigoJaValidado()) {
      return;
    }

    const campoCodigo = await this.aguardarCampoCodigoOpcional();
    if (!campoCodigo) {
      return;
    }

    const usarCodigoDoEnv = (process.env.EMAIL_CODE_MODE || 'manual') === 'env';
    const codigo = usarCodigoDoEnv ? process.env.CIDADAO_SMART_SECURITY_CODE?.trim() : '';
    if (codigo) {
      await campoCodigo.fill(codigo);
      await this.verificarCodigoSeNecessario();
      await this.validarCodigoValidado();
      return;
    }

    await visualPause(
      this.page,
      '[EMISSAO-EXPRESSA] Preencha o codigo de verificacao, clique em Verificar e depois Resume.'
    );

    if (!(await this.codigoJaValidado())) {
      await this.verificarCodigoSeNecessario();
      await this.validarCodigoValidado();
    }
  }

  /**
   * Clica em Prosseguir no estado atual da autenticacao, sem assumir a proxima tela.
   */
  async prosseguirAutenticacaoAtual(): Promise<void> {
    await this.clicarProsseguirAtual();
  }

  /**
   * Avanca para tipo de emissao depois que o CAPTCHA manual ja foi resolvido.
   */
  async prosseguirParaTipoEmissao(): Promise<void> {
    if (/\/emitir\/tipo-emissao/i.test(this.page.url())) {
      return;
    }

    const botaoProsseguir = this.page.getByRole('button', { name: S.botaoProsseguir }).first();
    await expect(botaoProsseguir).toBeVisible();

    if (!(await botaoProsseguir.isEnabled())) {
      await this.tratarCodigoSeNecessario();
    }

    if (!(await botaoProsseguir.isEnabled()) && /\/emitir\/autenticacao/i.test(this.page.url())) {
      await visualPause(
        this.page,
        '[EMISSAO-EXPRESSA] Autenticacao aguardando codigo. Preencha o codigo, clique em Verificar e depois Resume.'
      );
    }

    await expect(botaoProsseguir).toBeEnabled();

    const aguardarTipoEmissao = this.page
      .waitForURL(/\/emitir\/tipo-emissao/i, { timeout: 30_000 })
      .catch(() => undefined);

    await this.clicarBotaoAtual(botaoProsseguir);
    await aguardarTipoEmissao;

    if (/\/emitir\/tipo-emissao/i.test(this.page.url())) {
      return;
    }

    if (/\/emitir\/autenticacao/i.test(this.page.url()) && (await this.codigoJaValidado())) {
      await botaoProsseguir.click({ force: true }).catch(() => undefined);
      await this.page.waitForURL(/\/emitir\/tipo-emissao/i, { timeout: 10_000 }).catch(() => undefined);
    }

    if (/\/emitir\/tipo-emissao/i.test(this.page.url())) {
      return;
    }

    if (/\/emitir\/autenticacao/i.test(this.page.url()) && (await this.codigoJaValidado())) {
      await visualPause(
        this.page,
        '[EMISSAO-EXPRESSA] Codigo validado. Clique em Prosseguir na tela de autenticacao e depois Resume.'
      );
      await this.page.waitForURL(/\/emitir\/tipo-emissao/i, { timeout: 10_000 }).catch(() => undefined);
    }

    if (/\/emitir\/tipo-emissao/i.test(this.page.url())) {
      return;
    }

    if (await this.page.getByText(S.erroCaptcha).isVisible().catch(() => false)) {
      throw new Error('CAPTCHA_BLOQUEANDO_EMISSAO_CPF');
    }

    throw new Error(`EMISSAO_CPF_NAO_AVANCOU url=${this.page.url()}`);
  }

  private async obterCampoCpf(): Promise<Locator> {
    const placeholder = this.page.getByPlaceholder(S.campoCpfPlaceholder);
    if ((await placeholder.count()) > 0) return placeholder.first();

    const byLabel = this.page.getByLabel(/cpf/i);
    if ((await byLabel.count()) > 0) return byLabel.first();

    return this.page.locator('input[name*="cpf" i], input[id*="cpf" i], input[type="text"]').first();
  }

  private async obterCampoEmailOpcional(): Promise<Locator | null> {
    const locators = [
      this.page.getByLabel(S.campoEmail).first(),
      this.page.getByPlaceholder(/digite seu e-mail|email|e-mail/i).first(),
      this.page.locator('input[type="email"], input[name*="email" i], input[id*="email" i]').first(),
    ];

    return this.primeiroVisivelOpcional(locators);
  }

  private async obterCampoTelefoneOpcional(): Promise<Locator | null> {
    const locators = [
      this.page.getByLabel(S.campoTelefone).first(),
      this.page.getByPlaceholder(/\(00\) 00000-0000|telefone/i).first(),
      this.page.locator('input[name*="telefone" i], input[id*="telefone" i], input[type="tel"]').first(),
    ];

    return this.primeiroVisivelOpcional(locators);
  }

  private async obterCampoCodigoOpcional(): Promise<Locator | null> {
    const locators = [
      this.page.getByLabel(S.campoCodigo).first(),
      this.page.getByPlaceholder(S.campoCodigo).first(),
      this.page.getByRole('textbox', { name: S.campoCodigo }).first(),
      this.page.getByRole('spinbutton').first(),
      this.page.locator('input[autocomplete="one-time-code"]').first(),
      this.page.locator('input[name*="codigo" i], input[id*="codigo" i], input[type="number"]').first(),
    ];

    return this.primeiroVisivelOpcional(locators);
  }

  private async aguardarCampoCodigoOpcional(timeoutMs = 15_000): Promise<Locator | null> {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      if (await this.codigoJaValidado()) {
        return null;
      }

      const campoCodigo = await this.obterCampoCodigoOpcional();
      if (campoCodigo) {
        return campoCodigo;
      }

      if (/\/emitir\/tipo-emissao/i.test(this.page.url())) {
        return null;
      }

      await this.page.waitForTimeout(500);
    }

    return null;
  }

  private async primeiroVisivelOpcional(locators: Locator[]): Promise<Locator | null> {
    for (const locator of locators) {
      if (await locator.isVisible({ timeout: 1_000 }).catch(() => false)) {
        return locator;
      }
    }

    return null;
  }

  private async codigoJaValidado(): Promise<boolean> {
    return this.page
      .getByText(S.mensagemCodigoValidado)
      .first()
      .isVisible({ timeout: 1_000 })
      .catch(() => false);
  }

  private async validarCodigoValidado(): Promise<void> {
    await expect(this.page.getByText(S.mensagemCodigoValidado).first()).toBeVisible();
  }

  private async verificarCodigoSeNecessario(): Promise<void> {
    if (await this.codigoJaValidado()) {
      return;
    }

    const botaoVerificar = this.page.getByRole('button', { name: S.botaoVerificar }).first();
    if (await botaoVerificar.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await expect(botaoVerificar).toBeEnabled();
      await this.clicarBotaoAtual(botaoVerificar);
    }
  }

  private async clicarProsseguirAtual(): Promise<void> {
    const botaoProsseguir = this.page.getByRole('button', { name: S.botaoProsseguir }).first();
    await expect(botaoProsseguir).toBeVisible();
    await expect(botaoProsseguir).toBeEnabled();
    await this.clicarBotaoAtual(botaoProsseguir);
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
  }

  private async clicarBotaoAtual(botao: Locator): Promise<void> {
    await botao.scrollIntoViewIfNeeded();

    try {
      await botao.click({ timeout: 5_000 });
      return;
    } catch {
      // Alguns layouts mobile interceptam o ponto do clique; nesse caso usamos
      // o elemento ja resolvido para nao clicar em outro botao apos a troca da SPA.
    }

    await botao.evaluate((element: any) => {
      element.click();
    });
  }
}
