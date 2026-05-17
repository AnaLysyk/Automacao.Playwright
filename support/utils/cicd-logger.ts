type StatusExecucao = 'PASSOU' | 'FALHOU' | 'INFO';

type LinhaResumo = {
  etapa: string;
  status?: number;
  detalhe?: string;
  resultado?: StatusExecucao;
};

export class CicdLogger {
  private readonly titulo: string;
  private readonly linhas: LinhaResumo[] = [];
  private readonly contexto: Record<string, string | number> = {};

  constructor(titulo: string) {
    this.titulo = titulo;
  }

  adicionarContexto(chave: string, valor: string | number | undefined | null): void {
    if (valor === undefined || valor === null || valor === '') return;

    this.contexto[chave] = valor;
  }

  passou(etapa: string, status?: number, detalhe?: string): void {
    this.linhas.push({
      etapa,
      status,
      detalhe,
      resultado: 'PASSOU',
    });
  }

  falhou(etapa: string, status?: number, detalhe?: string): void {
    this.linhas.push({
      etapa,
      status,
      detalhe,
      resultado: 'FALHOU',
    });
  }

  info(etapa: string, status?: number, detalhe?: string): void {
    this.linhas.push({
      etapa,
      status,
      detalhe,
      resultado: 'INFO',
    });
  }

  imprimirResumoFinal(): void {
    const largura = 72;
    const linha = '━'.repeat(largura);

    console.log('');
    console.log(linha);
    console.log(this.titulo.toUpperCase());
    console.log(linha);

    const entradasContexto = Object.entries(this.contexto);

    for (const [chave, valor] of entradasContexto) {
      console.log(`${chave}: ${valor}`);
    }

    if (entradasContexto.length > 0) {
      console.log('');
    }

    for (const item of this.linhas) {
      const simbolo = this.obterSimbolo(item.resultado);
      const etapa = item.etapa.padEnd(28, ' ');
      const status = item.status ? String(item.status).padEnd(4, ' ') : ''.padEnd(4, ' ');
      const detalhe = item.detalhe ? ` | ${item.detalhe}` : '';

      console.log(`${simbolo} ${etapa} ${status}${detalhe}`);
    }

    const teveFalha = this.linhas.some((linhaResumo) => linhaResumo.resultado === 'FALHOU');

    console.log('');
    console.log(`Resultado: ${teveFalha ? 'FALHOU' : 'PASSOU'}`);
    console.log(linha);
    console.log('');
  }

  private obterSimbolo(resultado: StatusExecucao | undefined): string {
    if (resultado === 'PASSOU') return '✓';
    if (resultado === 'FALHOU') return '✗';

    return '-';
  }
}

export function resumirBodyViaExpressa(body: unknown): string {
  if (!body || typeof body !== 'object') {
    return '';
  }

  const bodyComoObjeto = body as Record<string, unknown>;

  const status = bodyComoObjeto.status ? String(bodyComoObjeto.status) : '';
  const protocolo = bodyComoObjeto.protocol ? `protocol=${String(bodyComoObjeto.protocol)}` : '';
  const approved =
    typeof bodyComoObjeto.approved === 'boolean'
      ? `approved=${String(bodyComoObjeto.approved)}`
      : '';

  return [status, protocolo, approved].filter(Boolean).join(' | ');
}

export function logApiCompacto(
  contexto: string,
  metodo: string,
  url: string,
  status: number,
  detalhe?: string,
): void {
  const detalheFormatado = detalhe ? ` | ${detalhe}` : '';

  console.log(`[${contexto}] ${metodo} ${status} ${url}${detalheFormatado}`);
}