import { expect, Locator, Page } from '@playwright/test';
import { knownIssues } from '../config/knownIssues';
import { CidadaoSmartAgendamentoLocalPageSelectors as S } from './selectors/CidadaoSmartAgendamentoLocalPageSelectors.ts';

export class CidadaoSmartAgendamentoLocalPage {
  private captchaPauseExecutada = false;

  constructor(private readonly page: Page) {}

  /**
   * Abre diretamente a rota de localizacao do agendamento presencial.
   */
  async acessar(): Promise<void> {
    await this.page.goto('/agendamentos/novo/local');
    await expect(this.page).toHaveURL(S.route);

    if (await this.estaTelaDeLoginSmart()) {
      const currentUrl = this.page.url();
      const currentTitle = await this.page.title();
      throw new Error(
        `AGENDAMENTO_REQUER_LOGIN_SMART: a rota /agendamentos/novo/local abriu a tela de login SMART. url=${currentUrl} title=${currentTitle}. Verifique autenticacao previa ou URL base.`
      );
    }
  }

  /**
   * Confere se a tela de localizacao exibiu os textos e opcoes principais.
   */
  async validarTelaLocal(): Promise<void> {
    await expect(this.page.getByText(S.instrucaoLocalizacao)).toBeVisible();
    await expect(this.page.getByText(S.radioCidade).first()).toBeVisible();
    await expect(this.page.getByText(S.radioCep).first()).toBeVisible();
  }

  /**
   * Marca busca por cidade, quando o radio existe, e digita a cidade desejada.
   */
  async buscarPorCidade(cidade: string): Promise<void> {
    const radioCidade = this.page.getByRole('radio', { name: S.radioCidade });
    if ((await radioCidade.count()) > 0) {
      await radioCidade.check();
    }

    await this.page.getByPlaceholder(S.inputCidadePlaceholder).fill(cidade);
  }

  /**
   * Seleciona a cidade sugerida pela tela depois da busca.
   */
  async selecionarCidade(cidade: string): Promise<void> {
    const cidadeOption = this.page.getByText(new RegExp(cidade, 'i')).first();
    await expect(cidadeOption).toBeVisible();
    await cidadeOption.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Seleciona exatamente o posto esperado para manter a validacao de negocio fiel.
   */
  async selecionarPosto(nomePosto: string): Promise<void> {
    const postoText = this.page.getByText(nomePosto, { exact: true }).first();
    await expect(postoText).toBeVisible();

    // Alguns layouts exibem o nome dentro de um card; clicar no texto nem sempre
    // aciona a selecao. Primeiro tentamos clicar no ancestral clicavel.
    const card = postoText.locator('xpath=ancestor::div[contains(@class, "cursor-pointer")]');
    if ((await card.count()) > 0) {
      await this.clicarPostoCard(card.first());
      await this.page.waitForTimeout(250);
      return;
    }

    await postoText.click();
  }

  private async clicarPostoCard(card: Locator): Promise<void> {
    await card.scrollIntoViewIfNeeded();

    try {
      await card.click({ timeout: 5_000 });
      return;
    } catch (error) {
      console.warn(`[BOOKING] Clique normal no card do posto falhou; usando fallback mobile. ${String(error)}`);
    }

    // No mobile, a barra fixa inferior e o recaptcha podem interceptar o ponto
    // central do card. O fallback dispara o click no proprio elemento clicavel.
    await card.evaluate((element: any) => {
      element.click();
    });
  }

  /**
   * Registra a divergencia conhecida Top Tower/Aeroporto sem bloquear o fluxo principal.
   */
  async validarQueNaoSelecionouPostoErrado(): Promise<void> {
    const aeroportoVisivel = await this.page
      .getByText(/aeroporto/i)
      .first()
      .isVisible()
      .catch(() => false);

    if (aeroportoVisivel) {
      const issue = knownIssues.postoTopTowerAeroporto;
      console.warn(`[KNOWN-ISSUE][${issue.id}] ${issue.message}`);
    }
  }

  /**
   * Pausa quando a tela mostra CAPTCHA real.
   * A automacao nao resolve CAPTCHA: a pessoa deve marcar o desafio e pode clicar em Prosseguir.
   */
  async resolverCaptchaManual(): Promise<void> {
    if ((process.env.CAPTCHA_MODE || 'manual') !== 'manual') {
      return;
    }

    if (!(await this.isCaptchaVisivel())) {
      return;
    }

    console.log(
      'CAPTCHA detectado: marque "Nao sou um robo". Se o botao liberar, clique em Prosseguir; depois clique em Resume no Playwright.'
    );

    this.captchaPauseExecutada = true;
    await this.page.pause();
    await this.aguardarTelaDataHoraOpcional(2_000);
  }

  /**
   * Avanca para Data e Hora.
   * Se o CAPTCHA real continuar travando o botao, gera erro classificavel como bloqueio.
   */
  async prosseguir(): Promise<void> {
    if (await this.estaNaTelaDataHora()) {
      return;
    }

    const botaoProsseguir = this.page.getByRole('button', { name: S.botaoProsseguir }).first();
    await expect(botaoProsseguir).toBeVisible();

    if (!(await botaoProsseguir.isEnabled())) {
      await this.tratarBotaoProsseguirDesabilitado(botaoProsseguir);
    }

    if (await this.estaNaTelaDataHora()) {
      return;
    }

    if (!(await botaoProsseguir.isEnabled())) {
      throw new Error(await this.erroProsseguirDesabilitado(botaoProsseguir));
    }

    await Promise.all([
      this.page.waitForURL(/\/agendamentos\/novo\/data-e-hora/i, { timeout: 30_000 }).catch(() => undefined),
      botaoProsseguir.click(),
    ]);

    if (!(await this.estaNaTelaDataHora())) {
      throw new Error(`PROSSEGUIR_NAO_NAVEGOU url=${this.page.url()}`);
    }
  }

  private async tratarBotaoProsseguirDesabilitado(botaoProsseguir: Locator): Promise<void> {
    const mode = process.env.CAPTCHA_MODE || 'manual';
    const captchaVisivel = await this.isCaptchaVisivel();

    if (mode === 'manual' && captchaVisivel && !this.captchaPauseExecutada) {
      console.log(
        'CAPTCHA bloqueando Prosseguir: resolva no navegador e clique em Resume. Se o botao liberar, a automacao clica; se voce ja clicar, ela continua.'
      );

      this.captchaPauseExecutada = true;
      await this.page.pause();
      await this.aguardarTelaDataHoraOpcional(5_000);
      return;
    }

    if (mode === 'manual' && this.captchaPauseExecutada) {
      throw new Error(await this.erroCaptchaBloqueando(botaoProsseguir));
    }

    if (mode === 'disabled' && (captchaVisivel || !(await botaoProsseguir.isEnabled()))) {
      throw new Error(await this.erroCaptchaBloqueando(botaoProsseguir));
    }

    throw new Error(await this.erroProsseguirDesabilitado(botaoProsseguir));
  }

  private async erroCaptchaBloqueando(botaoProsseguir: Locator): Promise<string> {
    const buttonText = (await botaoProsseguir.textContent())?.trim();
    const disabled = await botaoProsseguir.getAttribute('disabled');
    const captchaVisivel = await this.isCaptchaVisivel();

    return [
      'CAPTCHA_BLOQUEOU_PROSSEGUIR',
      `url=${this.page.url()}`,
      `text="${buttonText}"`,
      `disabled=${disabled}`,
      `captchaVisivel=${captchaVisivel}`,
      `captchaMode=${process.env.CAPTCHA_MODE || 'manual'}`,
    ].join(' ');
  }

  private async erroProsseguirDesabilitado(botaoProsseguir: Locator): Promise<string> {
    const buttonText = (await botaoProsseguir.textContent())?.trim();
    const disabled = await botaoProsseguir.getAttribute('disabled');

    return `PROSSEGUIR_BOTAO_DESABILITADO url=${this.page.url()} text="${buttonText}" disabled=${disabled}`;
  }

  private async estaNaTelaDataHora(): Promise<boolean> {
    if (/\/agendamentos\/novo\/data-e-hora/i.test(this.page.url())) {
      return true;
    }

    return this.page
      .waitForURL(/\/agendamentos\/novo\/data-e-hora/i, { timeout: 500 })
      .then(() => true)
      .catch(() => false);
  }

  private async aguardarTelaDataHoraOpcional(timeoutMs: number): Promise<void> {
    await this.page
      .waitForURL(/\/agendamentos\/novo\/data-e-hora/i, { timeout: timeoutMs })
      .catch(() => undefined);
  }

  private async isCaptchaVisivel(): Promise<boolean> {
    const captchaIframe = this.page.locator('iframe[src*="recaptcha"], iframe[src*="api2/anchor"]');
    const captchaTexto = this.page.getByText(/nao sou um robo|n.o sou um rob.|selecione todas as imagens/i);

    return (
      (await captchaIframe.count().catch(() => 0)) > 0 ||
      (await captchaTexto.count().catch(() => 0)) > 0
    );
  }

  private async estaTelaDeLoginSmart(): Promise<boolean> {
    await this.page.waitForTimeout(1_500);

    const loginMarkers = [
      this.page.getByText(/SMART/i).first(),
      this.page.getByText(/usuario|senha/i).first(),
      this.page.getByRole('button', { name: /acessar|entrar|login/i }).first(),
      this.page.getByPlaceholder(/usuario|login|senha/i).first(),
    ];

    for (const locator of loginMarkers) {
      if (await locator.isVisible().catch(() => false)) {
        return true;
      }
    }

    return false;
  }
}
