import type { APIRequestContext } from '@playwright/test';
import { loadEnv } from '../../../../../support/config/env';
import { authApi } from '../../../../../support/api/auth.api';
import { diagnosticarConsultaViaExpressaData } from './diagnosticar-consulta.data';

const env = loadEnv();

export type DiagnosticoResultado = {
  nome: string;
  descricao: string;
  status: number;
  url: string;
  body: unknown;
  text: string;
  encontrouProcesso: boolean;
  resumo: string;
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

function normalizar(valor: unknown): string {
  return String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function bodyTemValor(body: unknown, valorEsperado: string): boolean {
  const texto = normalizar(JSON.stringify(body ?? {}));
  const valor = normalizar(valorEsperado);

  return texto.includes(valor);
}

function bodyTemStatusProcesso(body: unknown): boolean {
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

function resumirBody(body: unknown): string {
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

  return partes.length > 0 ? partes.join(' | ') : 'body sem resumo';
}

function encontrouProcesso(resultado: Pick<DiagnosticoResultado, 'status' | 'body' | 'text'>, protocolo: string): boolean {
  const texto = normalizar(`${JSON.stringify(resultado.body ?? {})} ${resultado.text}`);
  const respostaHttpOk = [200, 201].includes(resultado.status);

  if (!respostaHttpOk) {
    return false;
  }

  return texto.includes(normalizar(protocolo)) || bodyTemStatusProcesso(resultado.body);
}

async function executarGet(
  request: APIRequestContext,
  nome: string,
  descricao: string,
  url: string,
  headers: Record<string, string>,
  protocolo: string,
): Promise<DiagnosticoResultado> {
  try {
    const response = await request.get(url, { headers });
    const text = await response.text();
    const body = parseBody(text);
    const status = response.status();

    const resultadoBase = {
      status,
      body,
      text,
    };

    const consultaEncontrouProcesso = encontrouProcesso(resultadoBase, protocolo);

    return {
      nome,
      descricao,
      status,
      url,
      body,
      text,
      encontrouProcesso: consultaEncontrouProcesso,
      resumo: consultaEncontrouProcesso
        ? `consulta válida | ${resumirBody(body)}`
        : `consulta não confirmou processo | ${resumirBody(body)}`,
    };
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : String(error);

    return {
      nome,
      descricao,
      status: 0,
      url,
      body: null,
      text: mensagem,
      encontrouProcesso: false,
      resumo: `falha técnica na chamada: ${mensagem}`,
    };
  }
}

export async function diagnosticarConsultaViaExpressa(
  request: APIRequestContext,
  protocolo: string,
): Promise<DiagnosticoResultado[]> {
  const tokenKeycloak = await authApi.gerarTokenKeycloak();
  const tokenInterno = await authApi.gerarTokenInterno();

  const path = montarPath(diagnosticarConsultaViaExpressaData.pathOficial, protocolo);

  const urlComBirthDate = `${env.bookingApiBaseUrl}${path}?birthDate=${diagnosticarConsultaViaExpressaData.birthDate}`;

  const urlComBirthDateEncoded = `${env.bookingApiBaseUrl}${path}?birthDate=${encodeURIComponent(
    diagnosticarConsultaViaExpressaData.birthDate,
  )}`;

  const urlSemBirthDate = `${env.bookingApiBaseUrl}${path}`;

  const headersKeycloak = {
    Accept: 'application/json',
    Authorization: `Bearer ${tokenKeycloak}`,
    'x-operator-cpf': env.xOperatorCpf,
  };

  const headersKeycloakComContentType = {
    ...headersKeycloak,
    'Content-Type': 'application/json',
  };

  const headersInterno = {
    Accept: 'application/json',
    Authorization: `Bearer ${tokenInterno}`,
    'x-operator-cpf': env.xOperatorCpf,
  };

  const resultados: DiagnosticoResultado[] = [];

  resultados.push(
    await executarGet(
      request,
      'KEYCLOAK_SEM_CONTENT_TYPE_COM_BIRTHDATE',
      'Consulta usando token Keycloak, sem Content-Type e com birthDate na query.',
      urlComBirthDate,
      headersKeycloak,
      protocolo,
    ),
  );

  resultados.push(
    await executarGet(
      request,
      'KEYCLOAK_COM_CONTENT_TYPE_COM_BIRTHDATE',
      'Consulta usando token Keycloak, com Content-Type e com birthDate na query.',
      urlComBirthDate,
      headersKeycloakComContentType,
      protocolo,
    ),
  );

  resultados.push(
    await executarGet(
      request,
      'TOKEN_INTERNO_COM_BIRTHDATE',
      'Consulta usando token interno, sem Content-Type e com birthDate na query.',
      urlComBirthDate,
      headersInterno,
      protocolo,
    ),
  );

  resultados.push(
    await executarGet(
      request,
      'KEYCLOAK_BIRTHDATE_ENCODED',
      'Consulta usando token Keycloak e birthDate aplicado com encodeURIComponent.',
      urlComBirthDateEncoded,
      headersKeycloak,
      protocolo,
    ),
  );

  resultados.push(
    await executarGet(
      request,
      'KEYCLOAK_SEM_BIRTHDATE',
      'Consulta usando token Keycloak, sem Content-Type e sem birthDate na query.',
      urlSemBirthDate,
      headersKeycloak,
      protocolo,
    ),
  );

  return resultados;
}
