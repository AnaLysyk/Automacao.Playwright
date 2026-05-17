import type { APIRequestContext } from '@playwright/test';
import { loadEnv } from '../../../../../support/config/env';
import { authApi } from '../../../../../support/api/auth.api';
import { deletarViaExpressaData } from './deletar.data';

const env = loadEnv();

export type DeletarViaExpressaResultado = {
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

function montarPath(path: string, protocolo: string): string {
  return path.replace('{protocolo}', protocolo).replace('{protocol}', protocolo);
}

export async function deletarViaExpressa(
  request: APIRequestContext,
  protocolo: string,
): Promise<DeletarViaExpressaResultado> {
  const token = await authApi.gerarTokenKeycloak();

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'x-operator-cpf': env.xOperatorCpf,
  };

  const path = montarPath(deletarViaExpressaData.path, protocolo);
  const url = `${env.bookingApiBaseUrl}${path}`;

  const response = await request.delete(url, {
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
