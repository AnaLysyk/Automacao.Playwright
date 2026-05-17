import type { Page, TestInfo } from '@playwright/test';
import {
  captchaVisivel,
  resolverCaptchaSePermitido,
} from '../../../../../support/captcha/captcha.helper';
import { ConsultaPedidoElements } from './consulta-pedido.elements';
import { consultaPedidoData } from './consulta-pedido.data';

export type ResultadoObrigatoriedadeConsulta = {
  botaoDesabilitado: boolean;
  mensagemObrigatoriaVisivel: boolean;
};

export type ResultadoConsultaProtocolo = {
  url: string;
  permaneceuNaConsulta: boolean;
};

export type ResultadoConsultaProtocoloGerado = ResultadoConsultaProtocolo & {
  protocolo: string;
  dataNascimento: string;
  protocoloPreenchido: boolean;
  dataNascimentoPreenchida: boolean;
  botaoHabilitado: boolean;
  clicouProsseguir: boolean;
};

export class ConsultaPedidoFlow {
  private readonly elements: ConsultaPedidoElements;

  constructor(private readonly page: Page) {
    this.elements = new ConsultaPedidoElements(page);
  }

  async acessar(): Promise<void> {
    await this.page.goto('/consulta-protocolo');
  }

  async telaVisivel(): Promise<boolean> {
    return this.elements.protocoloInput().isVisible({ timeout: 15_000 }).catch(() => false);
  }

  async camposVisiveis(): Promise<boolean> {
    const resultados = await Promise.all([
      this.elements.protocoloInput().isVisible({ timeout: 15_000 }).catch(() => false),
      this.elements.dataNascimentoInput().isVisible({ timeout: 15_000 }).catch(() => false),
      this.elements.prosseguirButton().isVisible({ timeout: 15_000 }).catch(() => false),
    ]);

    return resultados.every(Boolean);
  }

  async acionarValidacaoObrigatoria(): Promise<ResultadoObrigatoriedadeConsulta> {
    const botao = this.elements.prosseguirButton();
    const botaoDesabilitado = await botao.isDisabled().catch(() => false);

    if (!botaoDesabilitado) {
      await botao.click();
    }

    return {
      botaoDesabilitado,
      mensagemObrigatoriaVisivel: await this.elements
        .erroObrigatorioMessage()
        .isVisible({ timeout: 3_000 })
        .catch(() => false),
    };
  }

  async consultarProtocoloInvalido(testInfo?: TestInfo): Promise<ResultadoConsultaProtocolo> {
    await this.elements.protocoloInput().fill(consultaPedidoData.protocoloInvalido);
    await this.elements.dataNascimentoInput().fill(consultaPedidoData.dataNascimento);
    await resolverCaptchaSePermitido(this.page, testInfo);

    if (await this.elements.prosseguirButton().isEnabled().catch(() => false)) {
      await this.elements.prosseguirButton().click();
    }

    const url = this.page.url();

    return {
      url,
      permaneceuNaConsulta: /\/consulta-protocolo/i.test(url),
    };
  }

  async consultarProtocoloGerado(
    protocolo: string,
    dataNascimento: string,
    testInfo?: TestInfo,
  ): Promise<ResultadoConsultaProtocoloGerado> {
    await this.elements.protocoloInput().fill(protocolo);
    await this.elements.dataNascimentoInput().fill(dataNascimento);

    const protocoloPreenchido = (await this.elements.protocoloInput().inputValue()) === protocolo;
    const dataNascimentoPreenchida =
      (await this.elements.dataNascimentoInput().inputValue()) === dataNascimento;

    await this.aguardarBotaoOuCaptcha();
    await resolverCaptchaSePermitido(this.page, testInfo);

    const botao = this.elements.prosseguirButton();
    const botaoHabilitado = await botao.isEnabled().catch(() => false);
    let clicouProsseguir = false;

    if (botaoHabilitado) {
      const urlAntes = this.page.url();
      const aguardarMudancaUrl = this.page
        .waitForFunction((urlInicial) => window.location.href !== urlInicial, urlAntes, {
          timeout: 5_000,
        })
        .catch(() => undefined);

      await botao.click();
      clicouProsseguir = true;
      await aguardarMudancaUrl;
      await this.page.waitForLoadState('domcontentloaded').catch(() => undefined);
    }

    const url = this.page.url();

    return {
      url,
      permaneceuNaConsulta: /\/consulta-protocolo/i.test(url),
      protocolo,
      dataNascimento,
      protocoloPreenchido,
      dataNascimentoPreenchida,
      botaoHabilitado,
      clicouProsseguir,
    };
  }

  private async aguardarBotaoOuCaptcha(): Promise<void> {
    const prazoFinal = Date.now() + 5_000;

    while (Date.now() < prazoFinal) {
      const botaoHabilitado = await this.elements.prosseguirButton().isEnabled().catch(() => false);
      const captchaDetectado = await captchaVisivel(this.page).catch(() => false);

      if (botaoHabilitado || captchaDetectado) {
        return;
      }

      await this.page.waitForTimeout(250);
    }
  }
}
