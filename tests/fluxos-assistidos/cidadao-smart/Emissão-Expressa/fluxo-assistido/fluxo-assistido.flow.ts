import type { Page, TestInfo } from '@playwright/test';
import {
  ConsultaPedidoFlow,
  type ResultadoConsultaProtocoloGerado,
} from '../consulta-pedido/consulta-pedido.flow';
import { EmissaoOnlineFlow } from '../emissao-online/emissao-online.flow';

export type ResultadoEntradaEmissao = {
  entradaVisivel: boolean;
  cpfConfigurado: boolean;
  cpfPreenchido: boolean;
  cpfFonte: 'api' | 'env' | 'nao-configurado';
  prosseguirAcionado: boolean;
  url: string;
};

export type ResultadoCapturaAssistida = {
  capturaVisivel: boolean;
  fotoConfigurada: boolean;
  fotoConfirmada: boolean;
  url: string;
};

export type ResultadoResumoAssistido = {
  resumoDisponivel: boolean;
  resumoVisivel: boolean;
};

export class FluxoAssistidoViaExpressaFlow {
  private readonly consulta: ConsultaPedidoFlow;
  private readonly emissao: EmissaoOnlineFlow;

  constructor(private readonly page: Page) {
    this.consulta = new ConsultaPedidoFlow(page);
    this.emissao = new EmissaoOnlineFlow(page);
  }

  async validarTelaConsulta(): Promise<boolean> {
    await this.consulta.acessar();
    return this.consulta.camposVisiveis();
  }

  async validarConsultaProtocoloInvalido(testInfo?: TestInfo) {
    return this.consulta.consultarProtocoloInvalido(testInfo);
  }

  async validarConsultaProtocoloGerado(
    protocolo: string,
    dataNascimento: string,
    testInfo?: TestInfo,
  ): Promise<ResultadoConsultaProtocoloGerado> {
    await this.consulta.acessar();
    return this.consulta.consultarProtocoloGerado(protocolo, dataNascimento, testInfo);
  }

  async validarEntradaEmissao(cpfGeradoApi?: string): Promise<ResultadoEntradaEmissao> {
    await this.emissao.acessarEntradaCpf();

    const entradaVisivel = await this.emissao.entradaCpfVisivel();
    const cpfFonte = cpfGeradoApi
      ? 'api'
      : this.emissao.cpfElegivelConfigurado()
        ? 'env'
        : 'nao-configurado';
    let cpfPreenchido = false;
    let prosseguirAcionado = false;

    if (entradaVisivel && cpfGeradoApi) {
      await this.emissao.preencherCpf(cpfGeradoApi);
      cpfPreenchido = await this.emissao.cpfPreenchidoCom(cpfGeradoApi);
      prosseguirAcionado = cpfPreenchido ? await this.emissao.prosseguirSeDisponivel() : false;
    }

    if (entradaVisivel && !cpfGeradoApi && cpfFonte === 'env') {
      await this.emissao.preencherCpfElegivel();
      cpfPreenchido = true;
    }

    return {
      entradaVisivel,
      cpfConfigurado: Boolean(cpfGeradoApi || this.emissao.cpfElegivelConfigurado()),
      cpfPreenchido,
      cpfFonte,
      prosseguirAcionado,
      url: this.page.url(),
    };
  }

  async validarCapturaAssistida(): Promise<ResultadoCapturaAssistida> {
    await this.emissao.acessarCapturaFacial();

    const capturaVisivel = await this.emissao.capturaFacialVisivel();
    const fotoConfigurada = this.emissao.fotoValidaConfigurada();

    if (!capturaVisivel || !fotoConfigurada) {
      return {
        capturaVisivel,
        fotoConfigurada,
        fotoConfirmada: false,
        url: this.page.url(),
      };
    }

    await this.emissao.enviarFotoValida();
    await this.emissao.confirmarFoto();

    return {
      capturaVisivel,
      fotoConfigurada,
      fotoConfirmada: await this.emissao.fotoConfirmadaVisivel(),
      url: this.page.url(),
    };
  }

  async validarResumoQuandoDisponivel(): Promise<ResultadoResumoAssistido> {
    await this.emissao.acessarResumo();

    const resumoDisponivel = await this.emissao.resumoDisponivel();

    return {
      resumoDisponivel,
      resumoVisivel: resumoDisponivel ? await this.emissao.resumoVisivel() : false,
    };
  }

  urlAtual(): string {
    return this.page.url();
  }
}
