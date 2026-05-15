import fs from 'fs';
import path from 'path';
import '@support/config/env';

export type ProtocoloGerado = {
  fluxo: string;
  ambiente: string;
  postoSelecionado: string;
  protocolo: string;
  dataExecucao: string;
  status?: string;
  cpf?: string;
  nome?: string;
  dataNascimento?: string;
  email?: string;
  telefone?: string;
  evidenceDir?: string;
  observacao?: string;
};

// Arquivo operacional de reuso entre specs. Fica fora de test-results porque
// Playwright pode limpar o outputDir no inicio de uma nova execucao.
const OUTPUT = path.resolve(process.env.PROTOCOL_REPORT_PATH || '.runtime/protocolos-gerados.json');

function lerProtocolos(): ProtocoloGerado[] {
  if (!fs.existsSync(OUTPUT)) return [];

  try {
    const texto = fs.readFileSync(OUTPUT, 'utf-8');
    const parsed = JSON.parse(texto) as ProtocoloGerado[] | ProtocoloGerado;
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
}

function escreverProtocolos(items: ProtocoloGerado[]): void {
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(items, null, 2), 'utf-8');
}

export function salvarProtocoloGerado(item: ProtocoloGerado): void {
  // Sempre acrescenta uma nova evidencia de protocolo; nao sobrescreve historico.
  const atual = lerProtocolos();
  atual.push(item);
  escreverProtocolos(atual);
}

export function obterProtocolosGerados(): ProtocoloGerado[] {
  return lerProtocolos();
}

export function obterUltimoProtocoloGerado(
  filtro: Partial<Pick<ProtocoloGerado, 'fluxo' | 'status'>> = {}
): ProtocoloGerado | undefined {
  const protocolos = lerProtocolos().filter((item) => {
    if (filtro.fluxo && item.fluxo !== filtro.fluxo) return false;
    if (filtro.status && item.status !== filtro.status) return false;
    return true;
  });

  return protocolos.at(-1);
}

export function registrarStatusProtocolo(
  protocolo: string,
  status: string,
  metadata: Partial<Omit<ProtocoloGerado, 'protocolo' | 'status'>> = {}
): ProtocoloGerado {
  // Atualiza o ultimo registro do protocolo para refletir o estado operacional atual.
  const atual = lerProtocolos();
  const index = atual.map((item) => item.protocolo).lastIndexOf(protocolo);

  const atualizado: ProtocoloGerado =
    index >= 0
      ? {
          ...atual[index],
          ...metadata,
          protocolo,
          status,
          dataExecucao: new Date().toISOString(),
        }
      : {
          fluxo: metadata.fluxo || 'status-protocolo',
          ambiente: metadata.ambiente || process.env.CIDADAO_SMART_BASE_URL || process.env.SMART_BASE_URL || 'nao-configurado',
          postoSelecionado: metadata.postoSelecionado || 'nao-informado',
          protocolo,
          status,
          dataExecucao: new Date().toISOString(),
          ...metadata,
        };

  if (index >= 0) {
    atual[index] = atualizado;
  } else {
    atual.push(atualizado);
  }

  escreverProtocolos(atual);
  return atualizado;
}
