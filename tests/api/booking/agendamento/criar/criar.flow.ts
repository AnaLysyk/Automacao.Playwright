import type { APIRequestContext } from '@playwright/test';
import { authApi } from '../../../../../support/api/auth.api';
import { loadEnv } from '../../../../../support/config/env';
import { criarAgendamentoData } from './criar.data';

const env = loadEnv();

type AgendamentoCriadoResponse = {
  id?: string | number;
  appointmentId?: string | number;
  agendamentoId?: string | number;
  protocolo?: string | number;
  protocol?: string | number;
  codigo?: string | number;
};

export type CriarAgendamentoResultado = {
  status: number;
  body: unknown;
  text: string;
  url: string;
  identificador: string;
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

function extrairIdentificador(body: unknown): string {
  if (!body || typeof body !== 'object') return '';

  const record = body as AgendamentoCriadoResponse;

  return String(
    record.id ??
      record.appointmentId ??
      record.agendamentoId ??
      record.protocolo ??
      record.protocol ??
      record.codigo ??
      '',
  );
}

export async function criarAgendamento(
  request: APIRequestContext,
  pickupStationId: number,
): Promise<CriarAgendamentoResultado> {
  const token = await authApi.gerarTokenKeycloak();

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'x-operator-cpf': env.xOperatorCpf,
  };

  const payload = {
    ...criarAgendamentoData.payload,
    pickupStationId,
  };
  const url = `${env.bookingApiBaseUrl}${criarAgendamentoData.path}`;

  const response = await request.post(url, {
    headers,
    data: payload,
  });

  const status = response.status();
  const text = await response.text();
  const body = parseBody(text);

  return {
    status,
    body,
    text,
    url,
    identificador: extrairIdentificador(body),
    payload,
  };
}
