import { expect, Page } from '@playwright/test';
import { CidadaoSmartAgendamentoLocalPageSelectors as S } from './selectors/CidadaoSmartAgendamentoLocalPageSelectors';

export class CidadaoSmartAgendamentoLocalPage {
  constructor(private readonly page: Page) {}

  async acessar(): Promise<void> {
    await this.page.goto('/agendamentos/novo/local');
    await expect(this.page).toHaveURL(S.route);
  }

  async validarTelaLocal(): Promise<void> {
  await expect(this.page.getByText(S.instrucaoLocalizacao)).toBeVisible();
  await expect(this.page.getByText(S.radioCidade).first()).toBeVisible();
  await expect(this.page.getByText(S.radioCep).first()).toBeVisible();
}

  async buscarPorCidade(cidade: string): Promise<void> {
    const radioCidade = this.page.getByRole('radio', { name: S.radioCidade });
    if ((await radioCidade.count()) > 0) {
      await radioCidade.check();
    }

    await this.page.getByPlaceholder(S.inputCidadePlaceholder).fill(cidade);
  }

  async selecionarCidade(cidade: string): Promise<void> {
  await expect(this.page.getByText(new RegExp(cidade, 'i')).first()).toBeVisible();
}

  async selecionarPosto(nomePosto: string): Promise<void> {
    await this.page.getByText(nomePosto, { exact: true }).click();
  }

  async validarQueNaoSelecionouPostoErrado(): Promise<void> {
    await expect(this.page.getByText(/aeroporto/i)).toHaveCount(0);
  }

  async resolverCaptchaManual(): Promise<void> {
  const captchaIframe = this.page.locator(
    'iframe[src*="recaptcha"], iframe[src*="api2/anchor"]'
  );

  const captchaTexto = this.page.getByText(/selecione todas as imagens/i);

  if ((await captchaIframe.count()) > 0 || (await captchaTexto.count()) > 0) {
    console.log(
      'CAPTCHA detectado: marque "Não sou um robô", clique em Prosseguir manualmente e depois clique em Resume no Playwright.'
    );

    await this.page.pause();
  }
}
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
      'Botão Prosseguir ainda está desabilitado. Marque o CAPTCHA, clique em Prosseguir manualmente e depois clique em Resume no Playwright.'
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
