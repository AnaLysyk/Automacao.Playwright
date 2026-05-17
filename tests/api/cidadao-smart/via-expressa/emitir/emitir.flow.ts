import type { APIRequestContext } from '@playwright/test';
import { loadEnv } from '../../../../../support/config/env';
import { authApi } from '../../../../../support/api/auth.api';
import { emitirViaExpressaData } from './emitir.data';

const env = loadEnv();

type ProcessoCriadoResponse = {
  protocol?: string;
};

export type EmitirViaExpressaResultado = {
  status: number;
  body: unknown;
  text: string;
  url: string;
  protocolo: string;
  payload: unknown;
};

function parseBody(text: string): unknown {
  if (!text.trim()) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extrairProtocolo(body: unknown): string {
  if (!body || typeof body !== 'object') return '';

  return (body as ProcessoCriadoResponse).protocol ?? '';
}

export async function emitirViaExpressa(
  request: APIRequestContext,
  pickupStationId: number,
): Promise<EmitirViaExpressaResultado> {
  const token = await authApi.gerarTokenKeycloak();

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'x-operator-cpf': env.xOperatorCpf,
  };

  const payload = {
    ...emitirViaExpressaData.pessoa,
    pickupStationId,
  };

  const url = `${env.bookingApiBaseUrl}${emitirViaExpressaData.path}`;

  const response = await request.post(url, {
    headers,
    data: payload,
  });

  const status = response.status();
  const text = await response.text();
  const body = parseBody(text);
  const protocolo = extrairProtocolo(body);

  return {
    status,
    body,
    text,
    url,
    protocolo,
    payload,
  };
}
