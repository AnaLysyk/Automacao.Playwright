import { expect, Page, TestInfo } from '@playwright/test';
import { resolverCaptchaSePermitido } from '../../../../support/captcha/captcha.helper';
import { emailClient } from '../../../../support/email/email.client';
import { AgendamentoPresencialElements } from './agendamento-presencial.elements';
import { agendamentoPresencialData } from './agendamento-presencial.data';

export class AgendamentoPresencialFlow {
  private readonly elements: AgendamentoPresencialElements;

  constructor(private readonly page: Page) {
    this.elements = new AgendamentoPresencialElements(page);
  }

  async acessar(): Promise<void> {
    await this.page.goto('/agendamentos/novo/local');
  }

  async validarTelaInicial(): Promise<void> {
    await expect(this.elements.body()).toBeVisible();
    await expect(this.elements.body()).not.toHaveText('');
  }

  async selecionarPosto(): Promise<void> {
    if (await this.elements.cidadeRadio().isVisible({ timeout: 1_000 }).catch(() => false)) {
      await this.elements.cidadeRadio().check();
    }

    await this.elements.cidadeInput().fill(agendamentoPresencialData.cidade);
    await expect(this.elements.cidadeOpcao(agendamentoPresencialData.cidade)).toBeVisible();
    await this.elements.cidadeOpcao(agendamentoPresencialData.cidade).click();
    await expect(this.elements.postoOpcao(agendamentoPresencialData.posto)).toBeVisible();
    await this.elements.postoOpcao(agendamentoPresencialData.posto).click();
  }

  async avancarAposCaptcha(testInfo?: TestInfo): Promise<void> {
    await resolverCaptchaSePermitido(this.page, testInfo);
    await expect(this.elements.prosseguirButton()).toBeVisible();
    await expect(this.elements.prosseguirButton()).toBeEnabled();
    await this.elements.prosseguirButton().click();
  }

  async preencherRequerente(): Promise<void> {
    const { requerente } = agendamentoPresencialData;

    await expect(this.elements.nomeInput()).toBeVisible();
    await this.elements.nomeInput().fill(requerente.nome);
    await this.elements.dataNascimentoInput().fill(requerente.dataNascimento);
    await this.elements.emailInput().fill(requerente.email);
    await this.elements.telefoneInput().fill(requerente.telefone);

    if (requerente.cpf) {
      await this.elements.cpfInput().fill(requerente.cpf);
    }
  }

  async selecionarDataHorario(): Promise<void> {
    await this.selecionarData(agendamentoPresencialData.dataAgendamento);
    await this.selecionarHorario(agendamentoPresencialData.horario);
  }

  async avancarParaResumo(): Promise<void> {
    await expect(this.elements.prosseguirButton()).toBeEnabled();
    await this.elements.prosseguirButton().click();
    await expect(this.elements.resumoTitle()).toBeVisible();
  }

  async confirmarResumo(): Promise<void> {
    await expect(this.elements.prosseguirButton()).toBeVisible();
    await this.elements.prosseguirButton().click();
  }

  async tratarCodigoEmail(testInfo?: TestInfo): Promise<void> {
    if (!(await this.elements.codigoInput().isVisible({ timeout: 5_000 }).catch(() => false))) {
      return;
    }

    try {
      const codigo = await emailClient.getLatestCode(agendamentoPresencialData.requerente.email);
      await this.elements.codigoInput().fill(codigo);

      if (await this.elements.verificarButton().isVisible({ timeout: 2_000 }).catch(() => false)) {
        await this.elements.verificarButton().click();
      }

      await expect(this.elements.codigoValidadoMessage()).toBeVisible();
      return;
    } catch (error) {
      testInfo?.annotations.push({
        type: 'manual',
        description: `Preencher codigo de e-mail manualmente: ${error instanceof Error ? error.message : String(error)}`,
      });
    }

    await this.page.pause();
  }

  async obterProtocoloSeVisivel(): Promise<string | null> {
    if (await this.elements.protocoloText().isVisible({ timeout: 15_000 }).catch(() => false)) {
      return (await this.elements.protocoloText().innerText()).trim();
    }

    return null;
  }

  async executarFluxoAssistido(testInfo?: TestInfo): Promise<string | null> {
    await this.acessar();
    await this.validarTelaInicial();
    await this.selecionarPosto();
    await this.avancarAposCaptcha(testInfo);
    await this.preencherRequerente();
    await this.selecionarDataHorario();
    await this.avancarParaResumo();
    await this.confirmarResumo();
    await this.tratarCodigoEmail(testInfo);

    if (await this.elements.prosseguirButton().isVisible({ timeout: 2_000 }).catch(() => false)) {
      await this.elements.prosseguirButton().click();
    }

    return this.obterProtocoloSeVisivel();
  }

  private async selecionarData(dataAgendamento: string): Promise<void> {
    const [dia] = dataAgendamento.split('/');
    const diaSemZero = String(Number(dia));

    await this.elements.selecioneButton(0).click();

    if (await this.elements.diaButton(diaSemZero).isEnabled().catch(() => false)) {
      await this.elements.diaButton(diaSemZero).click();
      await this.confirmarSeNecessario();
      return;
    }

    const opcoes = this.elements.diasDisponiveis();
    const total = await opcoes.count();

    for (let index = 0; index < total; index += 1) {
      const opcao = opcoes.nth(index);
      if (await opcao.isEnabled().catch(() => false)) {
        await opcao.click();
        await this.confirmarSeNecessario();
        return;
      }
    }

    throw new Error('BOOKING_DATA_INDISPONIVEL');
  }

  private async selecionarHorario(horario: string): Promise<void> {
    await this.elements.selecioneButton(1).click();

    if (await this.elements.horarioButton(horario).isEnabled().catch(() => false)) {
      await this.elements.horarioButton(horario).click();
      await this.confirmarSeNecessario();
      return;
    }

    const opcoes = this.elements.horariosDisponiveis();
    const total = await opcoes.count();

    for (let index = 0; index < total; index += 1) {
      const opcao = opcoes.nth(index);
      if (await opcao.isEnabled().catch(() => false)) {
        await opcao.click();
        await this.confirmarSeNecessario();
        return;
      }
    }

    throw new Error('BOOKING_HORARIO_INDISPONIVEL');
  }

  private async confirmarSeNecessario(): Promise<void> {
    if (await this.elements.confirmarButton().isVisible({ timeout: 2_000 }).catch(() => false)) {
      await this.elements.confirmarButton().click();
    }
  }
}
