import { expect, Page } from '@playwright/test';
import { CidadaoSmartAgendamentoLocalPageSelectors as S } from './selectors/CidadaoSmartAgendamentoLocalPageSelectors';

export class CidadaoSmartAgendamentoLocalPage {
  constructor(private readonly page: Page) {}

  /**
   * Eu abro diretamente a rota de localizacao do agendamento presencial.
   */
  async acessar(): Promise<void> {
    await this.page.goto('/agendamentos/novo/local');
    await expect(this.page).toHaveURL(S.route);
  }

  /**
   * Eu confiro se a tela de localizacao exibiu os textos e opcoes principais.
   */
  async validarTelaLocal(): Promise<void> {
    await expect(this.page.getByText(S.instrucaoLocalizacao)).toBeVisible();
    await expect(this.page.getByText(S.radioCidade).first()).toBeVisible();
    await expect(this.page.getByText(S.radioCep).first()).toBeVisible();
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
   * Eu valido que o fluxo nao trocou silenciosamente o posto por Aeroporto.
   */
  async validarQueNaoSelecionouPostoErrado(): Promise<void> {
    await expect(this.page.getByText(/aeroporto/i)).toHaveCount(0);
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

    if (!(await botaoProsseguir.isEnabled())) {
      console.log(
        'Botao Prosseguir ainda esta desabilitado. Marque o CAPTCHA, clique em Prosseguir manualmente e depois clique em Resume no Playwright.'
      );

      await this.page.pause();

      if (this.page.url().includes('/agendamentos/novo/data-e-hora')) {
        return;
      }
    }

    await expect(botaoProsseguir).toBeEnabled();
    await botaoProsseguir.click();
  }
}
