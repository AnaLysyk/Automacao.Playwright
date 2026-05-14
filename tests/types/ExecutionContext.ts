import { EnvConfig } from '../config/env';
import { BookingAgendamentoData } from '../data/bookingAgendamentoData';
import { KnownIssue } from '../config/knownIssues';

export type ExecutionStatus = 'running' | 'passed' | 'failed' | 'dry-run';
export type StepStatus = 'running' | 'passed' | 'failed' | 'skipped';

export type StepRecord = {
  id: number;
  name: string;
  status: StepStatus;
  startedAt: string;
  finishedAt?: string;
  category?: string;
  error?: string;
};

export type EvidenceRecord = {
  file: string;
  name: string;
  status: string;
  description?: string;
  category?: string;
  url: string;
  timestamp: string;
};

export type KnownIssueRecord = KnownIssue & {
  detectedAt: string;
};

// Eu uso este contexto como memória compartilhada da execução entre agents, relatório e evidências.
export type ExecutionContext = {
  flowName: string;
  startedAt: string;
  finishedAt?: string;
  status: ExecutionStatus;
  env: EnvConfig;
  data: BookingAgendamentoData;
  cidade: string;
  postoPreferido: string;
  postoSelecionado: string;
  postoExibido?: string;
  dataPreferida: string;
  dataUsada?: string;
  horarioPreferido: string;
  horarioUsado?: string;
  protocolo?: string;
  captchaStatus?: 'nao-detectado' | 'manual' | 'disabled' | 'test' | 'expirado';
  captureStatus?: 'nao-iniciada' | 'manual' | 'fake-video' | 'disabled' | 'preview-detectado' | 'capturada' | 'falha';
  emailCodeStatus?: 'env' | 'manual' | 'gmail-api' | 'internal-api' | 'log' | 'validado';
  evidenceDir?: string;
  evidences: EvidenceRecord[];
  steps: StepRecord[];
  knownIssues: KnownIssueRecord[];
};
