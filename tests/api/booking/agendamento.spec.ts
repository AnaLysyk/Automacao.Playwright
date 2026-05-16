import { bookingApi } from '../../../support/api/booking.api';
import {
  diagnosticoBookingCancelamento,
  diagnosticoBookingConsulta,
  diagnosticoBookingConsultaCancelado,
  diagnosticoBookingCriacao,
} from '../../../support/utils/diagnostico';
import { expect, test } from '../../../support/fixtures/test';
import { bookingAgendamentoData, getMissingBookingConfig } from './agendamento.data';

type JsonValue = null | string | number | boolean | JsonValue[] | { [key: string]: JsonValue };

const statusAgendamentoAtivo = /agendado|scheduled|created|ativo|active|confirmado|confirmed|pendente|pending/i;
const statusAgendamentoCancelado = /cancelado|cancelled|canceled|cancelada|cancel/i;

function asText(value: unknown): string {
  if (value === null || value === undefined) return '';
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function findValue(body: unknown, keys: string[]): string | undefined {
  if (!body || typeof body !== 'object') return undefined;

  if (Array.isArray(body)) {
    for (const item of body) {
      const value = findValue(item, keys);
      if (value) return value;
    }

    return undefined;
  }

  const record = body as Record<string, JsonValue>;

  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && typeof value !== 'object') {
      return String(value);
    }
  }

  for (const value of Object.values(record)) {
    const nestedValue = findValue(value, keys);
    if (nestedValue) return nestedValue;
  }

  return undefined;
}

function expectBodyContains(body: unknown, expected: string, message: string): void {
  if (!expected) return;
  expect(asText(body), message).toContain(expected);
}

function extrairIdentificador(body: unknown): string | undefined {
  return findValue(body, ['id', 'appointmentId', 'agendamentoId', 'protocolo', 'protocol', 'codigo']);
}

function extrairStatus(body: unknown): string | undefined {
  return findValue(body, ['status', 'situacao', 'state']);
}

test.describe('Booking API - agendamento critico', () => {
  test('@api @booking @smoke deve criar, consultar, cancelar e validar status final do agendamento', async () => {
    const missingConfig = getMissingBookingConfig();
    test.skip(
      missingConfig.length > 0,
      `Configuracao ausente para smoke API Booking: ${missingConfig.join(', ')}`,
    );

    let identificadorAgendamento = '';

    await test.step('Criar agendamento via API', async () => {
      const response = await bookingApi.criarAgendamento(bookingAgendamentoData.payload);

      expect([200, 201], diagnosticoBookingCriacao()).toContain(response.status);
      expect(response.body, diagnosticoBookingCriacao()).not.toBeNull();

      identificadorAgendamento = extrairIdentificador(response.body) || '';
      expect(identificadorAgendamento, diagnosticoBookingCriacao()).not.toBe('');

      expectBodyContains(response.body, bookingAgendamentoData.payload.cpf, diagnosticoBookingCriacao());
      expectBodyContains(response.body, bookingAgendamentoData.payload.email, diagnosticoBookingCriacao());
      expectBodyContains(response.body, bookingAgendamentoData.payload.servicePointId, diagnosticoBookingCriacao());
      expectBodyContains(response.body, bookingAgendamentoData.payload.data, diagnosticoBookingCriacao());
      expectBodyContains(response.body, bookingAgendamentoData.payload.hora, diagnosticoBookingCriacao());

      const status = extrairStatus(response.body);
      if (status) {
        expect(status, diagnosticoBookingCriacao()).not.toMatch(statusAgendamentoCancelado);
      }
    });

    await test.step('Consultar agendamento criado', async () => {
      const response = await bookingApi.consultarAgendamento(identificadorAgendamento);

      expect(response.status, diagnosticoBookingConsulta()).toBe(200);
      expect(response.body, diagnosticoBookingConsulta()).not.toBeNull();
      expectBodyContains(response.body, identificadorAgendamento, diagnosticoBookingConsulta());
      expectBodyContains(response.body, bookingAgendamentoData.payload.cpf, diagnosticoBookingConsulta());
      expectBodyContains(response.body, bookingAgendamentoData.payload.email, diagnosticoBookingConsulta());
      expectBodyContains(response.body, bookingAgendamentoData.payload.data, diagnosticoBookingConsulta());
      expectBodyContains(response.body, bookingAgendamentoData.payload.hora, diagnosticoBookingConsulta());
    });

    await test.step('Cancelar agendamento', async () => {
      const response = await bookingApi.cancelarAgendamento(identificadorAgendamento);

      expect([200, 202, 204], diagnosticoBookingCancelamento()).toContain(response.status);

      const status = extrairStatus(response.body);
      if (status) {
        expect(status, diagnosticoBookingCancelamento()).toMatch(statusAgendamentoCancelado);
      }
    });

    await test.step('Consultar agendamento apos cancelamento', async () => {
      const response = await bookingApi.consultarAgendamento(identificadorAgendamento);

      expect(response.status, diagnosticoBookingConsultaCancelado()).toBe(200);
      expect(response.body, diagnosticoBookingConsultaCancelado()).not.toBeNull();

      const status = extrairStatus(response.body);
      expect(status, diagnosticoBookingConsultaCancelado()).toBeTruthy();
      expect(status || '', diagnosticoBookingConsultaCancelado()).toMatch(statusAgendamentoCancelado);
      expect(status || '', diagnosticoBookingConsultaCancelado()).not.toMatch(statusAgendamentoAtivo);
    });
  });
});
