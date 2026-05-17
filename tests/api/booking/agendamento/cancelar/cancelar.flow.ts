import type { APIRequestContext } from '@playwright/test';
import { authApi } from '../../../../../support/api/auth.api';
import { loadEnv } from '../../../../../support/config/env';
import { cancelarAgendamentoData } from './cancelar.data';

const env = loadEnv();

export type CancelarAgendamentoResultado = {
  status: number;
  body: unknown;
  text: string;
  url: string;
  method: string;
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

export async function cancelarAgendamento(
  request: APIRequestContext,
  identificador: string,
): Promise<CancelarAgendamentoResultado> {
  const token = await authApi.gerarTokenKeycloak();
  const method = cancelarAgendamentoData.method.trim().toUpperCase();

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'x-operator-cpf': env.xOperatorCpf,
  };

  const path = montarPath(cancelarAgendamentoData.path, identificador);
  const url = `${env.bookingApiBaseUrl}${path}`;

  const response =
    method === 'POST'
      ? await request.post(url, { headers })
      : method === 'PATCH'
        ? await request.patch(url, { headers })
        : method === 'PUT'
          ? await request.put(url, { headers })
          : await request.delete(url, { headers });

  const status = response.status();
  const text = await response.text();
  const body = parseBody(text);

  return {
    status,
    body,
    text,
    url,
    method,
  };
}
