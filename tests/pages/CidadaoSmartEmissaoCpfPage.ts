import { expect, Locator, Page } from '@playwright/test';
import { CidadaoSmartEmissaoCpfPageSelectors as S } from './selectors/CidadaoSmartEmissaoCpfPageSelectors.ts';
import { visualPause } from '../helpers/visualPause';
import { loadEnvConfig } from '../config/env';
import { ImapEmailCodeProvider } from '../providers/ImapEmailCodeProvider';
import { GmailCodeProvider } from '../providers/GmailCodeProvider';

export class CidadaoSmartEmissaoCpfPage {
  private readonly env = loadEnvConfig();
  private readonly imapProvider = new ImapEmailCodeProvider(this.env);
  private readonly gmailProvider = new GmailCodeProvider(this.env);

  constructor(private readonly page: Page) {}

  /**
   * Abre a autenticação por CPF, que é a entrada real da emissão online.
   */
  async acessar(): Promise<void> {
    await this.page.goto('/emitir');
    await expect(this.page).toHaveURL(S.route);
  }

  /**
   * Confirma que a tela carregou com CPF e botões principais.
   */
  async validarTelaCpf(): Promise<void> {
    await expect(await this.obterCampoCpf()).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoVoltar }).first()).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoProsseguir }).first()).toBeVisible();
  }

  /**
   * Preenche o CPF da massa finalizada.
   */
  async preencherCpf(cpf: string): Promise<void> {
    const campoCpf = await this.obterCampoCpf();

    await expect(campoCpf).toBeVisible();
    await campoCpf.click();
    await campoCpf.fill('');
    await campoCpf.type(cpf, { delay: 60 });
  }

  /**
   * Informa se a jornada ainda está na entrada por CPF.
   */
  async estaNaTelaCpf(): Promise<boolean> {
    return this.obterCampoCpf()
      .then((campo) => campo.isVisible({ timeout: 2_000 }))
      .catch(() => false);
  }

  /**
   * Clica em Prosseguir depois do CPF/CAPTCHA e aguarda a próxima tela real.
   *
   * Se o botão ainda estiver desabilitado, pausa para o QA confirmar se o CAPTCHA
   * realmente foi resolvido antes de seguir.
   */
  async prosseguirAutenticacaoAtual(): Promise<void> {
    const botaoProsseguir = this.page.getByRole('button', { name: S.botaoProsseguir }).first();

    await expect(botaoProsseguir).toBeVisible({ timeout: 10_000 });

    if (!(await botaoProsseguir.isEnabled().catch(() => false))) {
      await visualPause(
        this.page,
        '[EMISSAO-EXPRESSA] O botão Prosseguir ainda está desabilitado. Resolva o CAPTCHA, confirme que o botão habilitou e clique em Resume.'
      );
    }

    await expect(botaoProsseguir).toBeEnabled({ timeout: 30_000 });

    const aguardarProximaRota = this.page
      .waitForURL(/\/emitir\/(escolha-posto|autenticacao|tipo-emissao)/i, { timeout: 30_000 })
      .catch(() => undefined);

    await this.clicarBotaoAtual(botaoProsseguir);
    await aguardarProximaRota;

    await this.page.waitForLoadState('domcontentloaded').catch(() => undefined);
  }

  /**
   * Seleciona o posto de retirada quando o fluxo da emissão expressa exigir.
   *
   * Fluxo esperado:
   * CPF/CAPTCHA -> escolha de posto -> autenticação por e-mail/telefone.
   */
  async selecionarPostoRetiradaSeNecessario(): Promise<void> {
    await this.page
      .waitForURL(/\/emitir\/escolha-posto/i, { timeout: 15_000 })
      .catch(() => undefined);

    if (!/\/emitir\/escolha-posto/i.test(this.page.url())) {
      return;
    }

    const cidade =
      process.env.CIDADAO_SMART_2VIA_EXPRESSA_CIDADE ||
      process.env.CIDADAO_SMART_DEFAULT_CITY ||
      'Florianópolis';

    const campoCidade = await this.primeiroVisivel([
      this.page.getByPlaceholder(/digite o nome da cidade|nome da cidade|cidade/i).first(),
      this.page.locator('input[placeholder*="cidade" i]').first(),
      this.page.locator('input').first(),
    ]);

    await campoCidade.click();
    await campoCidade.fill('');
    await campoCidade.type(cidade, { delay: 80 });

    await this.page.waitForTimeout(1_500).catch(() => undefined);

    await this.selecionarPostoTopTower();

    const botaoProsseguir = this.page.getByRole('button', { name: S.botaoProsseguir }).first();

    await expect(botaoProsseguir).toBeVisible({ timeout: 10_000 });
    await expect(botaoProsseguir).toBeEnabled({ timeout: 10_000 });

    const aguardarAutenticacao = this.page
      .waitForURL(/\/emitir\/autenticacao/i, { timeout: 30_000 })
      .catch(() => undefined);

    await this.clicarBotaoAtual(botaoProsseguir);
    await aguardarAutenticacao;

    await this.page.waitForLoadState('domcontentloaded').catch(() => undefined);
  }

  /**
   * Preenche e-mail e telefone quando a tela de autenticação solicita contato
   * para envio do código de segurança.
   *
   * Se a tela já estiver no código, não tenta preencher contato de novo.
   */
  async preencherContatoSeNecessario(email?: string, telefone?: string): Promise<void> {
    await this.page
      .waitForURL(/\/emitir\/autenticacao/i, { timeout: 15_000 })
      .catch(() => undefined);

    if (!/\/emitir\/autenticacao/i.test(this.page.url())) {
      return;
    }

    const emailFinal =
      email ||
      process.env.CIDADAO_SMART_2VIA_EXPRESSA_EMAIL ||
      process.env.CIDADAO_SMART_TEST_EMAIL ||
      'ana.testing.company@gmail.com';

    const telefoneFinal =
      telefone ||
      process.env.CIDADAO_SMART_2VIA_EXPRESSA_TELEFONE ||
      process.env.CIDADAO_SMART_TEST_TELEFONE ||
      '51999917265';

    const campoEmail = await this.obterCampoEmailOpcional();
    const campoTelefone = await this.obterCampoTelefoneOpcional();
    const campoCodigo = await this.obterCampoCodigoOpcional();

    if (!campoEmail && !campoTelefone) {
      if (campoCodigo || (await this.codigoJaValidado())) {
        return;
      }

      const botaoProsseguir = this.page.getByRole('button', { name: S.botaoProsseguir }).first();

      if (await botaoProsseguir.isVisible({ timeout: 2_000 }).catch(() => false)) {
        return;
      }

      return;
    }

    if (campoEmail) {
      await expect(campoEmail).toBeVisible({ timeout: 10_000 });
      await campoEmail.click();
      await campoEmail.fill('');
      await campoEmail.type(emailFinal, { delay: 60 });
      await expect(campoEmail).toHaveValue(emailFinal);
    }

    if (campoTelefone) {
      await expect(campoTelefone).toBeVisible({ timeout: 10_000 });
      await campoTelefone.click();
      await campoTelefone.fill('');
      await campoTelefone.type(telefoneFinal, { delay: 60 });
    }

    const botaoProsseguir = this.page.getByRole('button', { name: S.botaoProsseguir }).first();

    await expect(botaoProsseguir).toBeVisible({ timeout: 10_000 });
    await expect(botaoProsseguir).toBeEnabled({ timeout: 10_000 });

    await this.clicarBotaoAtual(botaoProsseguir);

    await this.page.waitForLoadState('domcontentloaded').catch(() => undefined);

    const campoCodigoDepoisDoContato = await this.aguardarCampoCodigoOpcional(30_000);

    if (campoCodigoDepoisDoContato) {
      console.log('[EMISSAO-EXPRESSA] Código de segurança solicitado.');
      return;
    }

    if (/\/emitir\/autenticacao/i.test(this.page.url())) {
      await visualPause(
        this.page,
        '[EMISSAO-EXPRESSA] Contato enviado. Se o código apareceu, preencha, clique em Verificar e depois Resume.'
      );
    }
  }

  /**
   * Resolve a etapa de código por env ou por pausa manual assistida.
   */
  async tratarCodigoSeNecessario(): Promise<void> {
    if (this.estaNaTelaSucesso()) {
      return;
    }

    if (await this.codigoJaValidado()) {
      return;
    }

    let campoCodigo = await this.aguardarCampoCodigoOpcional(30_000);

    const codigo = await this.obterCodigoAutomatico();

    if (campoCodigo && codigo) {
      await campoCodigo.fill(codigo);
      await this.verificarCodigoSeNecessario();
      await this.validarCodigoValidado();
      return;
    }

    if (campoCodigo) {
      await visualPause(
        this.page,
        '[EMISSAO-EXPRESSA] Preencha o código de segurança, clique em Verificar e depois clique em Resume.'
      );

      if (this.estaNaTelaSucesso()) {
        return;
      }

      if (!(await this.codigoJaValidado())) {
        await this.verificarCodigoSeNecessario();
        await this.validarCodigoValidado();
      }

      return;
    }

    if (/\/emitir\/autenticacao/i.test(this.page.url())) {
      await visualPause(
        this.page,
        '[EMISSAO-EXPRESSA] Tela de autenticação aberta. Se o código foi enviado, preencha/verifique manualmente e clique em Resume.'
      );

      if (this.estaNaTelaSucesso()) {
        return;
      }

      campoCodigo = await this.aguardarCampoCodigoOpcional(5_000);

      const codigoAposPausa = await this.obterCodigoAutomatico();

      if (campoCodigo && codigoAposPausa && !(await this.codigoJaValidado())) {
        await campoCodigo.fill(codigoAposPausa);
        await this.verificarCodigoSeNecessario();
        await this.validarCodigoValidado();
        return;
      }

      if (campoCodigo && !(await this.codigoJaValidado())) {
        await this.verificarCodigoSeNecessario();
        await this.validarCodigoValidado();
      }
    }
  }

  /**
   * Avança para tipo de emissão depois que CPF, CAPTCHA, posto,
   * contato e código já foram tratados.
   */
  async prosseguirParaTipoEmissao(): Promise<void> {
    const rotaTipoEmissao = /\/emitir\/tipo-emissao/i;

    if (rotaTipoEmissao.test(this.page.url()) || this.estaNaTelaSucesso()) {
      return;
    }

    for (let tentativa = 1; tentativa <= 3; tentativa += 1) {
      if (rotaTipoEmissao.test(this.page.url()) || this.estaNaTelaSucesso()) {
        return;
      }

      if (/\/emitir\/escolha-posto/i.test(this.page.url())) {
        await this.selecionarPostoRetiradaSeNecessario();
        continue;
      }

      if (/\/emitir\/autenticacao/i.test(this.page.url())) {
        await this.preencherContatoSeNecessario();
        await this.tratarCodigoSeNecessario();

        if (rotaTipoEmissao.test(this.page.url()) || this.estaNaTelaSucesso()) {
          return;
        }

        const botaoProsseguir = this.page.getByRole('button', { name: S.botaoProsseguir }).first();

        if (await botaoProsseguir.isVisible({ timeout: 3_000 }).catch(() => false)) {
          if (await botaoProsseguir.isEnabled().catch(() => false)) {
            const aguardarTipoEmissao = this.page
              .waitForURL(rotaTipoEmissao, { timeout: 15_000 })
              .catch(() => undefined);

            await this.clicarBotaoAtual(botaoProsseguir);
            await aguardarTipoEmissao;

            if (rotaTipoEmissao.test(this.page.url()) || this.estaNaTelaSucesso()) {
              return;
            }
          }
        }

        await visualPause(
          this.page,
          `[EMISSAO-EXPRESSA] Ainda estamos na tela de autenticação. Verifique se o código foi preenchido, clique em Verificar/Prosseguir se necessário e depois clique em Resume. Tentativa ${tentativa}/3.`
        );

        if (rotaTipoEmissao.test(this.page.url()) || this.estaNaTelaSucesso()) {
          return;
        }

        continue;
      }

      const botaoProsseguir = this.page.getByRole('button', { name: S.botaoProsseguir }).first();

      if (await botaoProsseguir.isVisible({ timeout: 3_000 }).catch(() => false)) {
        if (await botaoProsseguir.isEnabled().catch(() => false)) {
          const aguardarTipoEmissao = this.page
            .waitForURL(rotaTipoEmissao, { timeout: 15_000 })
            .catch(() => undefined);

          await this.clicarBotaoAtual(botaoProsseguir);
          await aguardarTipoEmissao;

          if (rotaTipoEmissao.test(this.page.url()) || this.estaNaTelaSucesso()) {
            return;
          }
        }
      }

      await this.page.waitForTimeout(1_000).catch(() => undefined);
    }

    if (await this.page.getByText(S.erroCaptcha).isVisible().catch(() => false)) {
      throw new Error('CAPTCHA_BLOQUEANDO_EMISSAO_CPF');
    }

    throw new Error(`EMISSAO_CPF_NAO_AVANCOU url=${this.page.url()}`);
  }

  private async selecionarPostoTopTower(): Promise<void> {
    const radioTopTower = this.page
      .getByRole('radio', {
        name: /Top Tower|PCI - FLORIANÓPOLIS - Top Tower|PCI - FLORIANOPOLIS - Top Tower/i,
      })
      .first();

    if (await radioTopTower.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await radioTopTower.click({ force: true });
      await this.page.waitForTimeout(800).catch(() => undefined);
      return;
    }

    const labelTopTower = this.page
      .getByLabel(/Top Tower|PCI - FLORIANÓPOLIS - Top Tower|PCI - FLORIANOPOLIS - Top Tower/i)
      .first();

    if (await labelTopTower.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await labelTopTower.click({ force: true });
      await this.page.waitForTimeout(800).catch(() => undefined);
      return;
    }

    const textoTopTower = this.page
      .getByText(/PCI - FLORIANÓPOLIS - Top Tower|PCI - FLORIANOPOLIS - Top Tower|Top Tower/i)
      .first();

    await expect(textoTopTower).toBeVisible({ timeout: 15_000 });

    const cardTopTower = textoTopTower.locator(
      'xpath=ancestor::*[self::div or self::label or self::button][contains(., "Top Tower")][1]'
    );

    if (await cardTopTower.isVisible({ timeout: 2_000 }).catch(() => false)) {
      const radioNoCard = cardTopTower.locator('input[type="radio"], [role="radio"]').first();

      if (await radioNoCard.isVisible({ timeout: 1_000 }).catch(() => false)) {
        await radioNoCard.click({ force: true });
        await this.page.waitForTimeout(800).catch(() => undefined);
        return;
      }

      const box = await cardTopTower.boundingBox();

      if (box) {
        await this.page.mouse.click(box.x + box.width - 25, box.y + 30);
        await this.page.waitForTimeout(800).catch(() => undefined);
        return;
      }
    }

    const boxTexto = await textoTopTower.boundingBox();

    if (!boxTexto) {
      throw new Error('EMISSAO_POSTO_TOP_TOWER_SEM_BOUNDING_BOX');
    }

    await this.page.mouse.click(boxTexto.x + 390, boxTexto.y + 5);
    await this.page.waitForTimeout(800).catch(() => undefined);
  }

  private estaNaTelaSucesso(): boolean {
    return /\/emitir\/sucesso/i.test(this.page.url());
  }

  private async obterCampoCpf(): Promise<Locator> {
    const placeholder = this.page.getByPlaceholder(S.campoCpfPlaceholder);

    if ((await placeholder.count()) > 0) {
      return placeholder.first();
    }

    const byLabel = this.page.getByLabel(/cpf/i);

    if ((await byLabel.count()) > 0) {
      return byLabel.first();
    }

    return this.page.locator('input[name*="cpf" i], input[id*="cpf" i], input[type="text"]').first();
  }

  private async obterCampoEmailOpcional(): Promise<Locator | null> {
    const locators = [
      this.page.getByLabel(/e-mail|email/i).first(),
      this.page.getByPlaceholder(/digite seu e-mail/i).first(),
      this.page.getByPlaceholder(/digite seu email/i).first(),
      this.page.getByPlaceholder(/email|e-mail/i).first(),
      this.page.locator('input[type="email"]').first(),
      this.page.locator('input[name*="email" i]').first(),
      this.page.locator('input[id*="email" i]').first(),
      this.page.locator('input[placeholder*="email" i]').first(),
      this.page.locator('input[placeholder*="e-mail" i]').first(),
    ];

    return this.primeiroVisivelOpcional(locators);
  }

  private async obterCampoTelefoneOpcional(): Promise<Locator | null> {
    const locators = [
      this.page.getByLabel(/telefone|celular/i).first(),
      this.page.getByPlaceholder(/telefone|celular/i).first(),
      this.page.getByPlaceholder(/\(00\) 00000-0000/i).first(),
      this.page.getByPlaceholder(/\(48\) 00000-0000/i).first(),
      this.page.locator('input[type="tel"]').first(),
      this.page.locator('input[name*="telefone" i]').first(),
      this.page.locator('input[id*="telefone" i]').first(),
      this.page.locator('input[placeholder*="telefone" i]').first(),
      this.page.locator('input[placeholder*="00000" i]').first(),
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

      await this.page.waitForTimeout(500).catch(() => undefined);
    }

    return null;
  }

  private async primeiroVisivel(locators: Locator[]): Promise<Locator> {
    const locator = await this.primeiroVisivelOpcional(locators);

    if (!locator) {
      throw new Error('Nenhum locator visível encontrado.');
    }

    return locator;
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

  private async obterCodigoAutomatico(): Promise<string | null> {
    switch (this.env.emailCodeMode) {
      case 'env': {
        const codigo = this.env.securityCode?.trim();
        if (!codigo) {
          console.warn('[EMISSAO-EXPRESSA] EMAIL_CODE_MODE=env sem CIDADAO_SMART_SECURITY_CODE.');
          return null;
        }

        console.log('[EMISSAO-EXPRESSA] Codigo lido de CIDADAO_SMART_SECURITY_CODE.');
        return codigo;
      }
      case 'imap':
        return this.imapProvider.obterCodigoMaisRecente();
      case 'gmail-api':
        return this.gmailProvider.obterCodigoMaisRecente();
      case 'internal-api':
      case 'log':
        console.warn(`[EMISSAO-EXPRESSA] EMAIL_CODE_MODE=${this.env.emailCodeMode} ainda nao implementado neste fluxo.`);
        return null;
      case 'manual':
      default:
        return null;
    }
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

  private async clicarBotaoAtual(botao: Locator): Promise<void> {
    await botao.scrollIntoViewIfNeeded();

    try {
      await botao.click({ timeout: 5_000 });
      return;
    } catch {
      // Alguns layouts interceptam o clique; nesse caso usamos o elemento já resolvido.
    }

    await botao.evaluate((element: any) => {
      element.click();
    });
  }
}
