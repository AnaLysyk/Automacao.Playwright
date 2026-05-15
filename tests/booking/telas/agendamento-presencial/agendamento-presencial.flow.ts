import { expect, Page, TestInfo } from '@playwright/test';
import { resolverCaptchaSePermitido } from '../../../../support/captcha/captcha.helper';
import { emailClient } from '../../../../support/email/email.client';
import { AgendamentoPresencialElements } from './agendamento-presencial.elements';
import { agendamentoPresencialData } from './agendamento-presencial.data';
import { SelecaoDataHorarioFlow } from '../selecao-data-horario/selecao-data-horario.flow';
import { SelecaoPostoFlow } from '../selecao-posto/selecao-posto.flow';
import { BookingValidacaoEmailFlow } from '../validacao-email/validacao-email.flow';

export class AgendamentoPresencialFlow {
  private readonly elements: AgendamentoPresencialElements;
  private readonly selecaoPosto: SelecaoPostoFlow;
  private readonly dataHorario: SelecaoDataHorarioFlow;
  private readonly validacaoEmail: BookingValidacaoEmailFlow;

  constructor(private readonly page: Page) {
    this.elements = new AgendamentoPresencialElements(page);
    this.selecaoPosto = new SelecaoPostoFlow(page);
    this.dataHorario = new SelecaoDataHorarioFlow(page);
    this.validacaoEmail = new BookingValidacaoEmailFlow(page);
  }

  async executarFluxoCompleto(testInfo?: TestInfo): Promise<string | null> {
    await this.selecaoPosto.acessar();
    await this.selecaoPosto.validarTela();
    await this.selecaoPosto.buscarCidade(agendamentoPresencialData.cidade);
    await this.selecaoPosto.selecionarCidade(agendamentoPresencialData.cidade);
    await this.selecaoPosto.selecionarPosto(agendamentoPresencialData.posto);
    await resolverCaptchaSePermitido(this.page, testInfo);
    await this.selecaoPosto.prosseguir();

    await this.dataHorario.validarTela();
    await this.dataHorario.preencherRequerente(agendamentoPresencialData.requerente);
    await this.dataHorario.selecionarData(agendamentoPresencialData.dataAgendamento);
    await this.dataHorario.selecionarHorario(agendamentoPresencialData.horario);
    await this.dataHorario.prosseguir();

    await this.validarResumo();
    await this.elements.resumoProsseguirButton().click();

    if (await this.validacaoEmail.telaVisivel()) {
      await this.tratarCodigo(testInfo);
      await this.validacaoEmail.prosseguir();
    }

    if (await this.elements.protocoloText().isVisible({ timeout: 15_000 }).catch(() => false)) {
      return (await this.elements.protocoloText().innerText()).trim();
    }

    return null;
  }

  async validarResumo(): Promise<void> {
    await expect(this.elements.resumoTitle()).toBeVisible();
    await expect(this.elements.resumoProsseguirButton()).toBeVisible();
  }

  private async tratarCodigo(testInfo?: TestInfo): Promise<void> {
    try {
      await this.validacaoEmail.preencherCodigo(agendamentoPresencialData.requerente.email);
      await this.validacaoEmail.verificarCodigo();
      return;
    } catch (error) {
      testInfo?.annotations.push({
        type: 'manual',
        description: `Preencher codigo de e-mail manualmente: ${error instanceof Error ? error.message : String(error)}`,
      });
    }

    await this.page.pause();
  }
}
