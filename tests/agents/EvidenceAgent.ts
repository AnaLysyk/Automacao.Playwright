import fs from 'fs';
import path from 'path';
import { Page } from '@playwright/test';
import { ExecutionContext } from '../types/ExecutionContext';

export type EvidenceMetadata = {
  description?: string;
  status?: 'parcial' | 'sucesso' | 'falha' | 'warning';
  category?: string;
  error?: string;
  metadata?: Record<string, unknown>;
};

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

// Eu gero o nome da pasta por timestamp para cada execução ter evidências isoladas.
function timestampForDir(date = new Date()): string {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-') + `_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
}

// Eu limpo nomes de etapa para criar arquivos legíveis e seguros no Windows.
function sanitizeFileName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

export class EvidenceAgent {
  private targetDir: string | null = null;

  constructor(
    private readonly page: Page,
    private readonly context: ExecutionContext
  ) {}

  /**
   * Eu inicio a pasta da execução e já registro a primeira evidência do fluxo.
   */
  async start(): Promise<void> {
    this.targetDir = path.join(this.context.env.evidenceDir, 'booking', 'manual-assisted', timestampForDir());
    this.context.evidenceDir = this.targetDir;
    fs.mkdirSync(this.targetDir, { recursive: true });
    await this.capture('00-inicio', { description: 'Inicio do fluxo assistido', status: 'parcial' });
  }

  /**
   * Eu tiro screenshot, registro URL/timestamp e atualizo o resumo Markdown da execução.
   */
  async capture(name: string, metadata: EvidenceMetadata = {}): Promise<void> {
    if (!this.targetDir) {
      throw new Error('EvidenceAgent deve ser iniciado com start() antes de capturar evidencias.');
    }

    const timestamp = new Date().toISOString();
    const safeName = sanitizeFileName(name) || 'evidencia';
    const fileName = `${safeName}.png`;
    const filePath = path.join(this.targetDir, fileName);
    const currentUrl = this.safePageUrl();

    try {
      await this.page.screenshot({ path: filePath, fullPage: true });
      console.log(`[EVIDENCE] ${filePath}`);
    } catch (error) {
      console.warn('[EVIDENCE] Nao foi possivel capturar screenshot.', error);
    }

    this.context.evidences.push({
      file: fileName,
      name,
      status: metadata.status || 'parcial',
      description: metadata.description,
      category: metadata.category,
      url: currentUrl,
      timestamp,
    });

    await this.writeSummary();
  }

  /**
   * Eu marco o fim da execução e reescrevo o resumo final.
   */
  async finish(): Promise<void> {
    if (!this.targetDir) return;
    this.context.finishedAt = new Date().toISOString();
    await this.writeSummary();
  }

  /**
   * Eu exponho a pasta final para logs e mensagens de encerramento.
   */
  getOutputDir(): string | null {
    return this.targetDir;
  }

  // Eu protejo a captura de URL para não quebrar a evidência se a página fechar.
  private safePageUrl(): string {
    try {
      return this.page.url();
    } catch {
      return 'url indisponivel';
    }
  }

  // Eu mantenho um resumo simples em Markdown para anexar em ticket, daily ou evidência.
  private async writeSummary(): Promise<void> {
    if (!this.targetDir) return;

    const knownIssuePosto = this.context.knownIssues.some((issue) => issue.id === 'KNOWN-POSTO-001') ? 'sim' : 'nao';
    const codigoStatus = this.context.emailCodeStatus || 'pendente';
    const captchaStatus = this.context.captchaStatus || this.context.env.captchaMode;
    const captureStatus = this.context.captureStatus || this.context.env.captureMode;

    const lines = [
      '# Resumo da Execucao - Booking Agendamento Assistido',
      '',
      `Ambiente: ${this.context.env.targetEnv}`,
      `URL: ${this.context.env.cidadaoSmartBaseUrl}`,
      `Tipo: ${this.context.env.executionMode}`,
      `Status: ${this.context.status}`,
      `CAPTCHA: ${captchaStatus}`,
      `Captura: ${captureStatus}`,
      `Codigo de seguranca: ${codigoStatus}`,
      `Inicio: ${this.context.startedAt}`,
      `Fim: ${this.context.finishedAt || 'em andamento'}`,
      '',
      '## Dados usados',
      `Cidade: ${this.context.cidade}`,
      `Posto preferido: ${this.context.postoPreferido}`,
      `Posto selecionado: ${this.context.postoSelecionado}`,
      `Posto exibido: ${this.context.postoExibido || 'nao validado'}`,
      `Data preferida: ${this.context.dataPreferida}`,
      `Data usada: ${this.context.dataUsada || 'nao selecionada'}`,
      `Horario preferido: ${this.context.horarioPreferido}`,
      `Horario usado: ${this.context.horarioUsado || 'nao selecionado'}`,
      `Protocolo: ${this.context.protocolo || 'nao gerado'}`,
      '',
      '## Etapas',
    ];

    for (const step of this.context.steps) {
      const suffix = step.category ? ` (${step.category})` : '';
      lines.push(`- ${pad(step.id)} - ${step.name}: ${step.status}${suffix}`);
      if (step.error) {
        lines.push(`  - Erro: ${step.error}`);
      }
    }

    lines.push('', '## Known issues', `- KNOWN-POSTO-001 registrado: ${knownIssuePosto}`);
    for (const issue of this.context.knownIssues) {
      lines.push(`- [${issue.id}] ${issue.message}`);
    }

    lines.push('', '## Evidencias');
    for (const evidence of this.context.evidences) {
      const category = evidence.category ? ` | ${evidence.category}` : '';
      lines.push(`- ${evidence.file} | ${evidence.status}${category} | ${evidence.timestamp} | ${evidence.url}`);
    }

    fs.writeFileSync(path.join(this.targetDir, 'resumo-execucao.md'), lines.join('\n'), 'utf-8');
  }
}

