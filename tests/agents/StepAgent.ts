import { ExecutionContext, StepRecord } from '../types/ExecutionContext';
import { EvidenceAgent } from './EvidenceAgent';
import { FailureClassifierAgent } from './FailureClassifierAgent';

export type StepOptions = {
  evidenceName?: string;
  capture?: boolean;
};

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

// Eu normalizo qualquer erro para texto legível no log e no resumo.
function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error || '');
}

export class StepAgent {
  constructor(
    private readonly context: ExecutionContext,
    private readonly evidenceAgent: EvidenceAgent,
    private readonly failureClassifier: FailureClassifierAgent
  ) {}

  /**
   * Eu executo uma etapa rastreável: logo início/fim, gero evidência e classifico falha.
   */
  async executar<T>(name: string, action: () => Promise<T>, options: StepOptions = {}): Promise<T> {
    const id = this.context.steps.length + 1;
    const step: StepRecord = {
      id,
      name,
      status: 'running',
      startedAt: new Date().toISOString(),
    };

    this.context.steps.push(step);
    console.log(`[ETAPA ${pad(id)}] ${name} iniciada`);

    try {
      const result = await action();
      step.status = 'passed';
      step.finishedAt = new Date().toISOString();
      console.log(`[ETAPA ${pad(id)}] ${name} passou`);

      if (options.capture !== false) {
        await this.evidenceAgent.capture(options.evidenceName || `${pad(id)}-${name}`, {
          description: name,
          status: 'sucesso',
        });
      }

      return result;
    } catch (error) {
      const category = this.failureClassifier.classify(error);
      step.status = 'failed';
      step.finishedAt = new Date().toISOString();
      step.category = category;
      step.error = errorMessage(error);
      this.context.status = 'failed';

      console.error(`[FAILURE][${category}] ${name}: ${step.error}`);
      await this.evidenceAgent.capture(`99-falha-${pad(id)}-${name}`, {
        description: name,
        status: 'falha',
        category,
        error: step.error,
      });

      throw error;
    }
  }
}

