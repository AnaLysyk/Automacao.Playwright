import type { APIRequestContext } from '@playwright/test';
import { loadEnv } from '../../../../../support/config/env';
import { authApi } from '../../../../../support/api/auth.api';
import { consultarViaExpressaData } from './consultar.data';

const env = loadEnv();

export type ConsultarViaExpressaResultado = {
  status: number;
  body: unknown;
  text: string;
  url: string;
};

type ConsultaViaExpressaBody = {
  status?: string;
  approved?: boolean;
  daePaid?: boolean;
  rejectionCount?: number;
  errors?: Array<{
    type?: string;
    description?: string;
  }>;
};

function parseBody(text: string): unknown {
  if (!text.trim()) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function montarPath(path: string, protocolo: string): string {
  return path.replace('{protocolo}', protocolo).replace('{protocol}', protocolo);
}

export function resumirConsultaViaExpressa(body: unknown): string {
  if (!body || typeof body !== 'object') {
    return 'sem body';
  }

  const bodyConsulta = body as ConsultaViaExpressaBody;

  const partes: string[] = [];

  if (bodyConsulta.status) {
    partes.push(`status=${bodyConsulta.status}`);
  }

  if (typeof bodyConsulta.approved === 'boolean') {
    partes.push(`approved=${bodyConsulta.approved}`);
  }

  if (typeof bodyConsulta.daePaid === 'boolean') {
    partes.push(`daePaid=${bodyConsulta.daePaid}`);
  }

  if (typeof bodyConsulta.rejectionCount === 'number') {
    partes.push(`rejeicoes=${bodyConsulta.rejectionCount}`);
  }

  const primeiroErro = bodyConsulta.errors?.[0];

  if (primeiroErro?.type) {
    partes.push(`erroTecnico=${primeiroErro.type}`);
  }

  return partes.length > 0 ? partes.join(' | ') : 'body sem status resumivel';
}

export function textoNormalizado(valor: unknown): string {
  return String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function bodyTemValor(body: unknown, valorEsperado: string): boolean {
  const texto = textoNormalizado(JSON.stringify(body ?? {}));
  const valor = textoNormalizado(valorEsperado);

  return texto.includes(valor);
}

export function bodyTemStatusProcesso(body: unknown): boolean {
  return (
    bodyTemValor(body, 'PROCESSING') ||
    bodyTemValor(body, 'APPROVED') ||
    bodyTemValor(body, 'REJECTED') ||
    bodyTemValor(body, 'ERROR') ||
    bodyTemValor(body, 'DELETED') ||
    bodyTemValor(body, 'CANCELED') ||
    bodyTemValor(body, 'CANCELLED') ||
    bodyTemValor(body, 'PROCESSADO') ||
    bodyTemValor(body, 'CANCELADO')
  );
}

export function bodyIndicaNaoEncontrado(body: unknown, text: string): boolean {
  const conteudo = textoNormalizado(`${JSON.stringify(body ?? {})} ${text}`);

  return (
    conteudo.includes('nao encontrado') ||
    conteudo.includes('nenhum processo encontrado') ||
    conteudo.includes('not found') ||
    conteudo.includes('page_not_found') ||
    conteudo.includes('processo nao encontrado')
  );
}

export async function consultarViaExpressa(
  request: APIRequestContext,
  protocolo: string,
): Promise<ConsultarViaExpressaResultado> {
  const token = await authApi.gerarTokenKeycloak();

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'x-operator-cpf': env.xOperatorCpf,
  };

  const path = montarPath(consultarViaExpressaData.path, protocolo);

  // Diagnóstico provou que este endpoint encontra a via expressa sem birthDate.
  const url = `${env.bookingApiBaseUrl}${path}`;

  const response = await request.get(url, {
    headers,
  });

  const status = response.status();
  const text = await response.text();
  const body = parseBody(text);

  return {
    status,
    body,
    text,
    url,
  };
}
