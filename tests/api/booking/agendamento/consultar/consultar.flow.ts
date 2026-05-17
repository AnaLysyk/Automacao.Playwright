import type { APIRequestContext } from '@playwright/test';
import { authApi } from '../../../../../support/api/auth.api';
import { loadEnv } from '../../../../../support/config/env';
import { consultarAgendamentoData } from './consultar.data';

const env = loadEnv();

export type ConsultarAgendamentoResultado = {
  status: number;
  body: unknown;
  text: string;
  url: string;
};

function parseBody(text: string): unknown {
  if (!text.trim()) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function montarPath(path: string, identificador: string): string {
  return path
    .replace('{id}', identificador)
    .replace('{agendamentoId}', identificador)
    .replace('{appointmentId}', identificador)
    .replace('{protocolo}', identificador)
    .replace('{protocol}', identificador);
}

export async function consultarAgendamento(
  request: APIRequestContext,
  identificador: string,
): Promise<ConsultarAgendamentoResultado> {
  const token = await authApi.gerarTokenKeycloak();

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'x-operator-cpf': env.xOperatorCpf,
  };

  const path = montarPath(consultarAgendamentoData.path, identificador);
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
