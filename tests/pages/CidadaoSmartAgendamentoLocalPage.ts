import { expect, Page } from '@playwright/test';
import { knownIssues } from '../config/knownIssues';
import { CidadaoSmartAgendamentoLocalPageSelectors as S } from './selectors/CidadaoSmartAgendamentoLocalPageSelectors.ts';

export class CidadaoSmartAgendamentoLocalPage {
  constructor(private readonly page: Page) {}

  /**
   * Eu abro diretamente a rota de localizacao do agendamento presencial.
   */
  async acessar(): Promise<void> {
    await this.page.goto('/agendamentos/novo/local');
    await expect(this.page).toHaveURL(S.route);

    if (await this.estaTelaDeLoginSmart()) {
      const currentUrl = this.page.url();
      const currentTitle = await this.page.title();
      throw new Error(
        `AGENDAMENTO_REQUER_LOGIN_SMART: a rota /agendamentos/novo/local abriu a tela de login SMART. url=${currentUrl} title=${currentTitle}. Verifique se o ambiente exige autenticação prévia ou se a URL base está incorreta.`
      );
    }
  }

  /**
   * Eu confiro se a tela de localizacao exibiu os textos e opcoes principais.
   */
  async validarTelaLocal(): Promise<void> {
    await expect(this.page.getByText(S.instrucaoLocalizacao)).toBeVisible();
    await expect(this.page.getByText(S.radioCidade).first()).toBeVisible();
    await expect(this.page.getByText(S.radioCep).first()).toBeVisible();
  }

  private async estaTelaDeLoginSmart(): Promise<boolean> {
    await this.page.waitForTimeout(1500);

    const loginMarkers = [
      this.page.getByText(/SMART/i).first(),
      this.page.getByText(/usuário|usuario/i).first(),
      this.page.getByText(/senha/i).first(),
      this.page.getByRole('button', { name: /acessar|entrar|login/i }).first(),
      this.page.getByPlaceholder(/usuario|usuário|login/i).first(),
      this.page.getByPlaceholder(/senha/i).first(),
    ];

    for (const locator of loginMarkers) {
      if (await locator.isVisible().catch(() => false)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Eu marco a busca por cidade, quando o radio existir, e digito a cidade desejada.
   */
  async buscarPorCidade(cidade: string): Promise<void> {
    const radioCidade = this.page.getByRole('radio', { name: S.radioCidade });
    if ((await radioCidade.count()) > 0) {
      await radioCidade.check();
    }

    await this.page.getByPlaceholder(S.inputCidadePlaceholder).fill(cidade);
  }

  /**
   * Eu seleciono a cidade sugerida pela tela depois da busca.
   */
  async selecionarCidade(cidade: string): Promise<void> {
    const cidadeOption = this.page.getByText(new RegExp(cidade, 'i')).first();
    await expect(cidadeOption).toBeVisible();
    await cidadeOption.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Eu seleciono exatamente o posto esperado para manter a validacao de negocio fiel.
   */
  async selecionarPosto(nomePosto: string): Promise<void> {
    await this.page.getByText(nomePosto, { exact: true }).click();
  }

  /**
   * Eu registro a divergencia conhecida Top Tower/Aeroporto sem bloquear o fluxo principal.
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
   * Eu pauso a execucao quando a tela mostra CAPTCHA e preciso de acao humana.
   */
  async resolverCaptchaManual(): Promise<void> {
    const captchaIframe = this.page.locator(
      'iframe[src*="recaptcha"], iframe[src*="api2/anchor"]'
    );
    const captchaTexto = this.page.getByText(/selecione todas as imagens/i);

    if ((await captchaIframe.count()) > 0 || (await captchaTexto.count()) > 0) {
      console.log(
        'CAPTCHA detectado: marque "Nao sou um robo", clique em Prosseguir manualmente e depois clique em Resume no Playwright.'
      );

      await this.page.pause();
    }
  }

  /**
   * Eu avanço para Data e Hora; se o botao ainda estiver travado por CAPTCHA,
   * eu pauso para resolver manualmente antes de continuar.
   */
  async prosseguir(): Promise<void> {
    if (this.page.url().includes('/agendamentos/novo/data-e-hora')) {
      return;
    }

    const botaoProsseguir = this.page.getByRole('button', {
      name: S.botaoProsseguir,
    });

    await expect(botaoProsseguir).toBeVisible();

    const estaHabilitado = await botaoProsseguir.isEnabled();
    if (!estaHabilitado) {
      console.log(
        'Botao Prosseguir esta desabilitado. Verifique se o CAPTCHA foi resolvido ou se a tela exige outra acao antes de continuar.'
      );
      const buttonText = (await botaoProsseguir.textContent())?.trim();
      const pageUrl = this.page.url();
      const buttonDisabledAttribute = await botaoProsseguir.getAttribute('disabled');

      await this.page.pause();

      if (this.page.url().includes('/agendamentos/novo/data-e-hora')) {
        return;
      }

      const estaHabilitadoAposPausa = await botaoProsseguir.isEnabled();
      if (!estaHabilitadoAposPausa) {
        throw new Error(
          `PROSSEGUIR_BOTAO_DESABILITADO url=${pageUrl} text="${buttonText}" disabled=${buttonDisabledAttribute}`
        );
      }
    }

    await botaoProsseguir.click();
  }
}
