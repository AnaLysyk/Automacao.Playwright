import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
  TestStep,
} from '@playwright/test/reporter';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { pathToFileURL } from 'url';

type ResultadoCenario = {
  titulo: string;
  status: string;
  duracaoMs: number;
  projeto?: string;
  tags: string[];
  detalhe?: string;
};

type ResultadoEtapaFluxo = {
  titulo: string;
  status: 'PASSOU' | 'FALHOU';
  duracaoMs: number;
};

class CicdConsoleReporter implements Reporter {
  private totalCenarios = 0;
  private cenariosPassaram = 0;
  private cenariosFalharam = 0;
  private cenariosPulados = 0;
  private duracaoTotalMs = 0;

  private resultadosCenarios: ResultadoCenario[] = [];
  private etapasFluxo: ResultadoEtapaFluxo[] = [];

  onBegin(_config: FullConfig, suite: Suite): void {
    this.totalCenarios = suite.allTests().length;
  }

  onStepEnd(_test: TestCase, _result: TestResult, step: TestStep): void {
    if (!this.deveContabilizarEtapaFluxo(step)) return;

    this.etapasFluxo.push({
      titulo: this.limparTituloEtapa(step.title),
      status: step.error ? 'FALHOU' : 'PASSOU',
      duracaoMs: step.duration ?? 0,
    });
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.duracaoTotalMs += result.duration;

    if (result.status === 'passed') this.cenariosPassaram += 1;
    if (result.status === 'failed' || result.status === 'timedOut') this.cenariosFalharam += 1;
    if (result.status === 'skipped') this.cenariosPulados += 1;

    this.resultadosCenarios.push({
      titulo: test.title,
      status: result.status,
      duracaoMs: result.duration,
      projeto: test.parent.project()?.name,
      tags: this.extrairTags(test.title),
      detalhe: this.extrairDetalheCenario(test, result),
    });
  }

  onEnd(result: FullResult): void {
    const contexto = this.montarContextoExecucao(result);
    const caminhos = this.montarCaminhosRelatorio();

    this.criarRelatorioMarkdown(contexto, caminhos);
    this.imprimirResumoTerminal(contexto, caminhos);
  }

  private deveContabilizarEtapaFluxo(step: TestStep): boolean {
    const titulo = step.title.trim();

    return step.category === 'test.step' && /^\d+\.\s/.test(titulo);
  }

  private limparTituloEtapa(titulo: string): string {
    return titulo.replace(/^\d+\.\s*/, '').trim();
  }

  private montarContextoExecucao(result: FullResult) {
    const agora = new Date();

    const dataHora = new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'medium',
      timeZone: 'America/Sao_Paulo',
    }).format(agora);

    const executor =
      process.env.QA_EXECUTOR ||
      process.env.USERNAME ||
      process.env.USER ||
      os.userInfo().username ||
      'não informado';

    const tipoExecucao =
      process.env.QA_RUN_TYPE ||
      process.env.TEST_RUN_TYPE ||
      process.env.RUN_TYPE ||
      'CICD';

    const cliArgs = process.argv.slice(2).join(' ');
    const sistemaInferido = cliArgs.includes('tests/api/booking') ? 'Booking' : 'Cidadão Smart';
    const fluxoInferido = cliArgs.includes('tests/api/booking/agendamento')
      ? 'Agendamento'
      : 'Via Expressa';

    const sistema =
      process.env.QA_SYSTEM ||
      process.env.SYSTEM_UNDER_TEST ||
      sistemaInferido;

    const fluxo =
      process.env.QA_FLOW ||
      process.env.TEST_FLOW ||
      fluxoInferido;

    const ambiente =
      process.env.QA_ENV ||
      process.env.TEST_ENV ||
      process.env.CIDADAO_SMART_BASE_URL ||
      process.env.BOOKING_BASE_URL ||
      process.env.BOOKING_API_BASE_URL ||
      'não informado';

    const statusFinal = result.status === 'passed' ? 'PASSOU' : 'FALHOU';
    const duracaoSegundos = (this.duracaoTotalMs / 1000).toFixed(1);

    const etapasPassaram = this.etapasFluxo.filter((etapa) => etapa.status === 'PASSOU').length;
    const etapasFalharam = this.etapasFluxo.filter((etapa) => etapa.status === 'FALHOU').length;
    const totalEtapas = this.etapasFluxo.length;

    return {
      dataHora,
      executor,
      tipoExecucao,
      sistema,
      fluxo,
      ambiente,
      statusFinal,
      duracaoSegundos,
      etapasPassaram,
      etapasFalharam,
      totalEtapas,
    };
  }

  private montarCaminhosRelatorio() {
    const htmlReportPath = path.resolve(process.cwd(), 'playwright-report', 'index.html');
    const jsonReportPath = path.resolve(process.cwd(), 'test-results', 'cicd-results.json');
    const mdReportPath = path.resolve(process.cwd(), 'test-results', 'cicd-summary.md');

    return {
      htmlReportPath,
      jsonReportPath,
      mdReportPath,
      htmlReportUrl: pathToFileURL(htmlReportPath).href,
      jsonReportUrl: pathToFileURL(jsonReportPath).href,
      mdReportUrl: pathToFileURL(mdReportPath).href,
    };
  }

  private imprimirResumoTerminal(
    contexto: ReturnType<CicdConsoleReporter['montarContextoExecucao']>,
    caminhos: ReturnType<CicdConsoleReporter['montarCaminhosRelatorio']>,
  ): void {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`${contexto.tipoExecucao.toUpperCase()} | ${contexto.sistema} | ${contexto.fluxo}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Resultado: ${contexto.statusFinal}`);
    console.log(`Data: ${contexto.dataHora}`);
    console.log(`Executor: ${contexto.executor}`);
    console.log(`Ambiente: ${contexto.ambiente}`);
    console.log(`Cenários: ${this.cenariosPassaram}/${this.totalCenarios} passaram`);
    console.log(`Validações: ${contexto.etapasPassaram}/${contexto.totalEtapas} passaram`);
    console.log(`Duração: ${contexto.duracaoSegundos}s`);

    if (this.cenariosFalharam + contexto.etapasFalharam > 0) {
      console.log(`Falhas: ${this.cenariosFalharam + contexto.etapasFalharam}`);
    }

    if (this.cenariosPulados > 0) {
      console.log(`Pulados: ${this.cenariosPulados}`);
    }

    console.log('');
    console.log(`Relatório técnico: ${caminhos.htmlReportUrl}`);
    console.log(`Resumo:            ${caminhos.mdReportUrl}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
  }

  private criarRelatorioMarkdown(
    contexto: ReturnType<CicdConsoleReporter['montarContextoExecucao']>,
    caminhos: ReturnType<CicdConsoleReporter['montarCaminhosRelatorio']>,
  ): void {
    fs.mkdirSync(path.dirname(caminhos.mdReportPath), { recursive: true });

    const linhasCenarios = this.resultadosCenarios
      .map((item) => {
        const duracao = `${(item.duracaoMs / 1000).toFixed(1)}s`;
        const tags = item.tags.length > 0 ? item.tags.join(' ') : '-';
        const projeto = item.projeto || '-';

        return `| ${this.formatarStatus(item.status)} | ${item.titulo} | ${projeto} | ${tags} | ${duracao} |`;
      })
      .join('\n');

    const linhasEtapas = this.etapasFluxo
      .map((item) => {
        const duracao = `${(item.duracaoMs / 1000).toFixed(1)}s`;

        return `| ${item.status} | ${item.titulo} | ${duracao} |`;
      })
      .join('\n');

    const observacoesPath = path.resolve(process.cwd(), 'test-results', 'cicd-observations.md');

    const observacoes = fs.existsSync(observacoesPath)
      ? fs.readFileSync(observacoesPath, 'utf-8')
      : '';

    const detalhesCenarios = this.resultadosCenarios
      .filter((item) => item.detalhe)
      .map((item) =>
        `| ${this.formatarStatus(item.status)} | ${item.titulo} | ${this.escaparMarkdownTabela(item.detalhe)} |`,
      )
      .join('\n');

    const conteudo = [
      `# Relatório de execução - ${contexto.sistema}`,
      '',
      '## Resumo',
      '',
      '| Campo | Valor |',
      '|---|---|',
      `| Resultado | ${contexto.statusFinal} |`,
      `| Tipo de execução | ${contexto.tipoExecucao} |`,
      `| Sistema | ${contexto.sistema} |`,
      `| Fluxo | ${contexto.fluxo} |`,
      `| Ambiente | ${contexto.ambiente} |`,
      `| Executor | ${contexto.executor} |`,
      `| Data/Hora | ${contexto.dataHora} |`,
      `| Duração | ${contexto.duracaoSegundos}s |`,
      `| Cenários Playwright | ${this.cenariosPassaram}/${this.totalCenarios} passaram |`,
      `| Validações do fluxo | ${contexto.etapasPassaram}/${contexto.totalEtapas} passaram |`,
      `| Falhas | ${this.cenariosFalharam + contexto.etapasFalharam} |`,
      `| Pulados | ${this.cenariosPulados} |`,
      '',
      '## Fluxo validado',
      '',
      '| Status | Etapa | Duração |',
      '|---|---|---|',
      linhasEtapas || '| - | Nenhuma etapa contabilizada | - |',
      '',
      '## Cenários Playwright executados',
      '',
      '| Status | Cenário | Projeto | Tags | Duração |',
      '|---|---|---|---|---|',
      linhasCenarios || '| - | Nenhum cenário executado | - | - | - |',
      '',
      detalhesCenarios ? '## Observacoes da execucao' : '',
      detalhesCenarios ? '' : '',
      detalhesCenarios ? '| Status | Cenario | Detalhe |' : '',
      detalhesCenarios ? '|---|---|---|' : '',
      detalhesCenarios,
      detalhesCenarios ? '' : '',
      observacoes ? observacoes : '',
      '',
      '## Evidências',
      '',
      `- Relatório técnico HTML: ${caminhos.htmlReportUrl}`,
      `- Métricas JSON: ${caminhos.jsonReportUrl}`,
      '',
    ].join('\n');

    fs.writeFileSync(caminhos.mdReportPath, conteudo, 'utf-8');
  }

  private extrairTags(titulo: string): string[] {
    return titulo.match(/@\S+/g) ?? [];
  }

  private extrairDetalheCenario(test: TestCase, result: TestResult): string | undefined {
    const erros = result.errors
      .map((erro) => erro.message || erro.value || '')
      .filter(Boolean);

    if (erros.length > 0) {
      return erros.join(' | ');
    }

    const anotacoes = test.annotations
      .filter((anotacao) => anotacao.description)
      .map((anotacao) => `${anotacao.type}: ${anotacao.description}`);

    if (anotacoes.length > 0) {
      return anotacoes.join(' | ');
    }

    if (result.status === 'skipped') {
      return 'Cenario pulado sem motivo registrado pelo Playwright.';
    }

    return undefined;
  }

  private escaparMarkdownTabela(valor: unknown): string {
    return String(valor ?? '')
      .replace(/\r?\n/g, ' ')
      .replace(/\|/g, '\\|');
  }

  private formatarStatus(status: string): string {
    if (status === 'passed') return 'PASSOU';
    if (status === 'failed') return 'FALHOU';
    if (status === 'timedOut') return 'TIMEOUT';
    if (status === 'skipped') return 'PULADO';

    return status.toUpperCase();
  }
}

export default CicdConsoleReporter;
