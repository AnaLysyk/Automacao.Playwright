import { Page } from '@playwright/test';
import { CidadaoSmartAgendamentoLocalPage } from '../pages/CidadaoSmartAgendamentoLocalPage';
import { CidadaoSmartAgendamentoDataHoraPage } from '../pages/CidadaoSmartAgendamentoDataHoraPage';
import { CidadaoSmartAgendamentoResumoPage } from '../pages/CidadaoSmartAgendamentoResumoPage';
import { CidadaoSmartAgendamentoAutenticacaoPage } from '../pages/CidadaoSmartAgendamentoAutenticacaoPage';
import { CidadaoSmartAgendamentoConfirmacaoPage } from '../pages/CidadaoSmartAgendamentoConfirmacaoPage';
import { CaptchaAgent } from './CaptchaAgent';
import { EmailCodeAgent } from './EmailCodeAgent';
import { EvidenceAgent } from './EvidenceAgent';
import { FailureClassifierAgent } from './FailureClassifierAgent';
import { StepAgent } from './StepAgent';
import { bookingAgendamentoData, BookingAgendamentoData } from '../data/bookingAgendamentoData';
import { cidadaoSmartServicePoints, ServicePoint } from '../support/data/cidadaoSmartServicePoints';
import { getServicePointForTest } from '../support/data/getServicePointForTest';
import { loadEnvConfig, validateManualAssistedEnv } from '../config/env';
import { knownIssues, KnownIssue } from '../config/knownIssues';
import { ExecutionContext } from '../types/ExecutionContext';

export class BookingAgendamentoAssistidoAgent {
  private readonly localPage: CidadaoSmartAgendamentoLocalPage;
  private readonly dataHoraPage: CidadaoSmartAgendamentoDataHoraPage;
  private readonly resumoPage: CidadaoSmartAgendamentoResumoPage;
  private readonly autenticacaoPage: CidadaoSmartAgendamentoAutenticacaoPage;
  private readonly confirmacaoPage: CidadaoSmartAgendamentoConfirmacaoPage;
  private readonly captchaAgent: CaptchaAgent;
  private readonly emailCodeAgent: EmailCodeAgent;
  private readonly evidenceAgent: EvidenceAgent;
  private readonly failureClassifier: FailureClassifierAgent;
  private readonly stepAgent: StepAgent;
  private readonly bookingData: BookingAgendamentoData;
  private readonly context: ExecutionContext;
  private servicePoint: ServicePoint;

  /**
   * Eu monto o agente principal com os Page Objects, agentes auxiliares
   * e o contexto que vai guardar evidencias, dados usados e status do fluxo.
   */
  constructor(private readonly page: Page, data: BookingAgendamentoData = bookingAgendamentoData) {
    const env = loadEnvConfig();
    this.bookingData = data;
    this.servicePoint = this.resolveServicePoint(data);

    this.context = {
      flowName: 'booking-agendamento-assistido',
      startedAt: new Date().toISOString(),
      status: 'running',
      env,
      data,
      cidade: data.cidade,
      postoPreferido: this.servicePoint.nome,
      postoSelecionado: this.servicePoint.nome,
      dataPreferida: data.dataAgendamento,
      horarioPreferido: data.horario,
      evidences: [],
      steps: [],
      knownIssues: [],
    };

    this.localPage = new CidadaoSmartAgendamentoLocalPage(page);
    this.dataHoraPage = new CidadaoSmartAgendamentoDataHoraPage(page);
    this.resumoPage = new CidadaoSmartAgendamentoResumoPage(page);
    this.autenticacaoPage = new CidadaoSmartAgendamentoAutenticacaoPage(page);
    this.confirmacaoPage = new CidadaoSmartAgendamentoConfirmacaoPage(page);
    this.captchaAgent = new CaptchaAgent(page);
    this.emailCodeAgent = new EmailCodeAgent();
    this.failureClassifier = new FailureClassifierAgent();
    this.evidenceAgent = new EvidenceAgent(page, this.context);
    this.stepAgent = new StepAgent(this.context, this.evidenceAgent, this.failureClassifier);
  }

  /**
   * Eu executo o fluxo completo assistido em etapas rastreaveis.
   * Se o dry run estiver ativo, eu paro no resumo para nao confirmar uma solicitacao real.
   */
  async executarFluxoCompleto(): Promise<void> {
    validateManualAssistedEnv(this.context.env);
    this.validarMassaMinima();

    console.log('[BOOKING] Iniciando fluxo assistido de agendamento presencial');
    console.log(`[ENV] TARGET_ENV=${this.context.env.targetEnv} BASE_URL=${this.context.env.cidadaoSmartBaseUrl}`);
    await this.evidenceAgent.start();

    try {
      await this.stepAgent.executar('Localizacao', () => this.acessarLocalizacao(), {
        evidenceName: '01-localizacao',
      });
      await this.stepAgent.executar('Selecionar posto', () => this.selecionarPosto(), {
        evidenceName: '02-posto',
      });
      await this.stepAgent.executar('CAPTCHA', () => this.tratarCaptcha(), {
        evidenceName: '03-captcha',
      });
      await this.stepAgent.executar('Abrir Data e Hora', () => this.avancarParaDataHora(), {
        evidenceName: '04-data-hora',
      });
      await this.stepAgent.executar('Preencher dados do requerente', () => this.preencherDadosRequerente(), {
        evidenceName: '05-dados-requerente',
      });
      await this.stepAgent.executar('Selecionar data e horario', () => this.selecionarDataEHorario(), {
        evidenceName: '06-data-horario',
      });
      await this.stepAgent.executar('Validar resumo', () => this.avancarEValidarResumo(), {
        evidenceName: '07-resumo',
      });

      if (this.context.env.dryRun) {
        this.context.status = 'dry-run';
        console.warn('[BOOKING] CIDADAO_SMART_DRY_RUN=true. Fluxo encerrado no resumo antes de confirmar solicitacao real.');
        await this.evidenceAgent.capture('98-dry-run-resumo', {
          description: 'Dry run encerrado no resumo por seguranca',
          status: 'warning',
        });
        return;
      }

      await this.stepAgent.executar('Abrir autenticacao', () => this.avancarParaAutenticacao(), {
        evidenceName: '08-autenticacao',
      });
      await this.stepAgent.executar('Tratar codigo de seguranca', () => this.tratarCodigoDeSeguranca(), {
        evidenceName: '09-codigo',
      });
      await this.stepAgent.executar('Validar confirmacao', () => this.validarConfirmacao(), {
        evidenceName: '10-confirmacao',
      });

      this.context.status = 'passed';
      console.log(`[BOOKING] Fluxo assistido finalizado. Protocolo: ${this.context.protocolo || 'nao capturado'}`);
    } catch (error) {
      const category = this.failureClassifier.classify(error);
      this.context.status = 'failed';
      await this.evidenceAgent.capture('99-falha-final', {
        status: 'falha',
        category,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      await this.evidenceAgent.finish();
      console.log(`[EVIDENCE] Resumo: ${this.evidenceAgent.getOutputDir() || 'nao gerado'}`);
    }
  }

  /**
   * Eu valido a massa antes do fluxo comecar para falhar cedo com mensagem clara.
   */
  private validarMassaMinima(): void {
    const missing: string[] = [];
    if (!this.bookingData.cidade) missing.push('cidade');
    if (!this.bookingData.nome) missing.push('nome');
    if (!this.bookingData.dataNascimento) missing.push('dataNascimento');
    if (!this.bookingData.email) missing.push('email');
    if (!this.bookingData.telefone) missing.push('telefone');
    if (!this.bookingData.dataAgendamento) missing.push('dataAgendamento');
    if (!this.bookingData.horario) missing.push('horario');

    if (missing.length > 0) {
      throw new Error(`[BOOKING] Massa de agendamento incompleta: ${missing.join(', ')}`);
    }
  }

  /**
   * Eu resolvo qual posto usar: por id, por nome ou pelo padrao da demo.
   */
  private resolveServicePoint(data: BookingAgendamentoData): ServicePoint {
    const byId = cidadaoSmartServicePoints.find((sp) => sp.id === data.postoPreferidoId);
    if (byId) return byId;

    const byName = cidadaoSmartServicePoints.find((sp) => sp.nome === data.postoPreferido);
    if (byName) return byName;

    return getServicePointForTest();
  }

  /**
   * Eu abro a tela de localizacao e confirmo que a tela principal carregou.
   */
  private async acessarLocalizacao(): Promise<void> {
    await this.localPage.acessar();
    await this.localPage.validarTelaLocal();
  }

  /**
   * Eu busco a cidade, seleciono a cidade sugerida e escolho o posto configurado.
   */
  private async selecionarPosto(): Promise<void> {
    await this.localPage.buscarPorCidade(this.bookingData.cidade);
    await this.localPage.selecionarCidade(this.bookingData.cidade);
    await this.localPage.selecionarPosto(this.servicePoint.nome);
    this.context.postoSelecionado = this.servicePoint.nome;
  }

  /**
   * Eu entrego o CAPTCHA para o agente proprio, sem tentar burlar CAPTCHA real.
   */
  private async tratarCaptcha(): Promise<void> {
    await this.captchaAgent.detectarETratar(this.context);
  }

  /**
   * Eu avanço para Data e Hora depois do CAPTCHA e valido a nova tela.
   */
  private async avancarParaDataHora(): Promise<void> {
    await this.localPage.prosseguir();
    await this.dataHoraPage.validarTelaDataHora();
  }

  /**
   * Eu preencho os dados do requerente usando somente metodos do Page Object.
   */
  private async preencherDadosRequerente(): Promise<void> {
    await this.dataHoraPage.preencherNome(this.bookingData.nome);
    await this.dataHoraPage.preencherDataNascimento(this.bookingData.dataNascimento);
    await this.dataHoraPage.preencherEmail(this.bookingData.email);
    await this.dataHoraPage.preencherTelefone(this.bookingData.telefone);

    if (this.bookingData.cpf) {
      await this.dataHoraPage.preencherCpf(this.bookingData.cpf);
    }
  }

  /**
   * Eu seleciono data e horario pela interface e salvo no contexto o que foi usado de verdade.
   */
  private async selecionarDataEHorario(allowRetry = true): Promise<void> {
    try {
      const dataUsada = await this.dataHoraPage.selecionarData(this.bookingData.dataAgendamento);
      this.context.dataUsada = dataUsada;

      await this.dataHoraPage.abrirModalHorario();
      const horarioUsado = await this.dataHoraPage.selecionarHorario(this.bookingData.horario);
      this.context.horarioUsado = horarioUsado;
      await this.dataHoraPage.confirmarHorario();

      if (dataUsada !== this.bookingData.dataAgendamento) {
        console.warn(`[BOOKING] Data preferida indisponivel. Data usada: ${dataUsada}`);
      }
      if (horarioUsado !== this.bookingData.horario) {
        console.warn(`[BOOKING] Horario preferido indisponivel. Horario usado: ${horarioUsado}`);
      }
    } catch (error) {
      if (allowRetry && /disponibilidade|data habilitada|horario habilitado|horário habilitado/i.test(String(error))) {
        await this.tentarPostoAlternativo();
        return;
      }

      throw error;
    }
  }

  /**
   * Eu tento um posto alternativo quando o posto escolhido nao tem disponibilidade.
   */
  private async tentarPostoAlternativo(): Promise<void> {
    const outrosPostos = cidadaoSmartServicePoints.filter((sp) => sp.nome !== this.servicePoint.nome);

    if (outrosPostos.length === 0) {
      throw new Error('Nenhum posto alternativo configurado para fallback de disponibilidade.');
    }

    this.servicePoint = outrosPostos[0];
    this.context.postoSelecionado = this.servicePoint.nome;
    console.warn(`[BOOKING] Tentando posto alternativo: ${this.servicePoint.nome}`);

    await this.localPage.acessar();
    await this.localPage.validarTelaLocal();
    await this.localPage.buscarPorCidade(this.bookingData.cidade);
    await this.localPage.selecionarCidade(this.bookingData.cidade);
    await this.localPage.selecionarPosto(this.servicePoint.nome);
    await this.captchaAgent.detectarETratar(this.context);
    await this.localPage.prosseguir();
    await this.dataHoraPage.validarTelaDataHora();
    await this.preencherDadosRequerente();
    await this.selecionarDataEHorario(false);
  }

  /**
   * Eu avanço para o resumo, valido dados basicos e verifico known issues.
   */
  private async avancarEValidarResumo(): Promise<void> {
    await this.dataHoraPage.prosseguir();
    await this.resumoPage.validarTelaResumo();
    await this.resumoPage.validarDadosBasicosResumo({
      nome: this.bookingData.nome,
      email: this.bookingData.email,
      telefone: this.bookingData.telefone,
    });

    const postoExibido = await this.resumoPage.obterPostoAtendimentoVisivel();
    this.context.postoExibido = postoExibido || 'nao identificado';
    this.registrarKnownIssuePostoSeNecessario(postoExibido);
  }

  /**
   * Eu saio do resumo e confirmo que a tela de autenticacao abriu.
   */
  private async avancarParaAutenticacao(): Promise<void> {
    await this.resumoPage.prosseguir();
    await this.autenticacaoPage.validarTelaAutenticacao();
  }

  /**
   * Eu trato o codigo por variavel de ambiente ou por preenchimento manual.
   */
  private async tratarCodigoDeSeguranca(): Promise<void> {
    await this.emailCodeAgent.processarCodigo(this.page, this.autenticacaoPage, this.context);
  }

  /**
   * Eu valido a confirmacao, capturo o protocolo e tento registrar as acoes finais.
   */
  private async validarConfirmacao(): Promise<void> {
    await this.autenticacaoPage.prosseguir();
    await this.confirmacaoPage.validarTelaConfirmacao();
    await this.confirmacaoPage.validarProtocoloGerado();
    this.context.protocolo = await this.confirmacaoPage.obterProtocolo();

    const postoExibido = await this.confirmacaoPage.obterPostoAtendimentoVisivel();
    if (postoExibido) {
      this.context.postoExibido = postoExibido;
      this.registrarKnownIssuePostoSeNecessario(postoExibido);
    }

    await this.confirmacaoPage.validarAcoesFinais().catch(() => {
      console.warn('[BOOKING] Acoes finais nao estavam todas visiveis; mantendo protocolo como evidencia principal.');
    });
  }

  /**
   * Eu registro o known issue Top Tower/Aeroporto sem quebrar o E2E principal.
   */
  private registrarKnownIssuePostoSeNecessario(postoExibido?: string): void {
    if (!postoExibido) return;

    const selecionouTopTower = /top tower/i.test(this.context.postoSelecionado);
    const exibiuAeroporto = /aeroporto/i.test(postoExibido);

    if (!selecionouTopTower || !exibiuAeroporto) return;
    if (this.context.knownIssues.some((issue) => issue.id === knownIssues.postoTopTowerAeroporto.id)) return;

    this.addKnownIssue(knownIssues.postoTopTowerAeroporto);
    console.warn(`[KNOWN-ISSUE][${knownIssues.postoTopTowerAeroporto.id}] ${knownIssues.postoTopTowerAeroporto.message}`);
  }

  /**
   * Eu adiciono o known issue no contexto para aparecer no resumo da execucao.
   */
  private addKnownIssue(issue: KnownIssue): void {
    this.context.knownIssues.push({
      ...issue,
      detectedAt: new Date().toISOString(),
    });
  }
}
