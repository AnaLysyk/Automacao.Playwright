import { cidadaoSmartApi } from '../../../support/api/cidadao-smart.api';
import { smartApi } from '../../../support/api/smart.api';
import {
  diagnosticoViaExpressaCancelamento,
  diagnosticoViaExpressaConsulta,
  diagnosticoViaExpressaCriacao,
  diagnosticoViaExpressaElegibilidade,
} from '../../../support/utils/diagnostico';
import { expect, test } from '../../../support/fixtures/test';
import { getMissingViaExpressaConfig, viaExpressaData } from './via-expressa.data';

type JsonValue = null | string | number | boolean | JsonValue[] | { [key: string]: JsonValue };

const statusFinalizado = /finalizado|concluido|concluida|finished|completed|done/i;
const statusCancelado = /cancelado|cancelled|canceled|cancelada|cancel/i;
const statusAtivo = /ativo|active|aberto|open|criado|created|pendente|pending|em andamento/i;
const inelegivel = /inelegivel|nao elegivel|ineligible|not eligible|false/i;

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
  return findValue(body, ['id', 'processoId', 'idProcesso', 'protocolo', 'protocol', 'codigo']);
}

function extrairStatus(body: unknown): string | undefined {
  return findValue(body, ['status', 'situacao', 'state']);
}

test.describe('Cidadao Smart API - via expressa critica', () => {
  test('@api @cidadao-smart @smoke deve validar elegibilidade, criar via expressa e consultar processo', async ({}, testInfo) => {
    const missingConfig = getMissingViaExpressaConfig();
    test.skip(
      missingConfig.length > 0,
      `Configuracao ausente para smoke API Cidadao Smart: ${missingConfig.join(', ')}`,
    );

    let identificadorProcesso = '';

    await test.step('Buscar CPF com processo finalizado no SMART', async () => {
      const response = await smartApi.buscarProcessoFinalizadoPorCpf(viaExpressaData.cpf);

      expect(response.status, diagnosticoViaExpressaElegibilidade()).toBe(200);
      expect(response.body, diagnosticoViaExpressaElegibilidade()).not.toBeNull();
      expectBodyContains(response.body, viaExpressaData.cpf, diagnosticoViaExpressaElegibilidade());

      const status = extrairStatus(response.body);
      if (status) {
        expect(status, diagnosticoViaExpressaElegibilidade()).toMatch(statusFinalizado);
      } else {
        expect(asText(response.body), diagnosticoViaExpressaElegibilidade()).toMatch(statusFinalizado);
      }
    });

    await test.step('Validar elegibilidade para via expressa', async () => {
      const response = await cidadaoSmartApi.validarElegibilidadeViaExpressa(viaExpressaData.cpf);

      expect(response.status, diagnosticoViaExpressaElegibilidade()).toBe(200);
      expect(response.body, diagnosticoViaExpressaElegibilidade()).not.toBeNull();
      expect(asText(response.body), diagnosticoViaExpressaElegibilidade()).not.toMatch(inelegivel);
    });

    await test.step('Criar via expressa via API', async () => {
      const response = await cidadaoSmartApi.criarViaExpressa(viaExpressaData.payload);

      expect([200, 201], diagnosticoViaExpressaCriacao()).toContain(response.status);
      expect(response.body, diagnosticoViaExpressaCriacao()).not.toBeNull();

      identificadorProcesso = extrairIdentificador(response.body) || '';
      expect(identificadorProcesso, diagnosticoViaExpressaCriacao()).not.toBe('');
      expectBodyContains(response.body, viaExpressaData.cpf, diagnosticoViaExpressaCriacao());
    });

    await test.step('Consultar processo criado', async () => {
      const response = await cidadaoSmartApi.consultarProcesso(identificadorProcesso);

      expect(response.status, diagnosticoViaExpressaConsulta()).toBe(200);
      expect(response.body, diagnosticoViaExpressaConsulta()).not.toBeNull();
      expectBodyContains(response.body, identificadorProcesso, diagnosticoViaExpressaConsulta());
      expectBodyContains(response.body, viaExpressaData.cpf, diagnosticoViaExpressaConsulta());
    });

    await test.step('Cancelar processo quando endpoint seguro existir', async () => {
      if (!viaExpressaData.cancelamentoDisponivel) {
        testInfo.annotations.push({
          type: 'pendencia-tecnica',
          description: 'Cancelamento de via expressa nao implementado porque nao foi encontrado endpoint/regra segura para cancelamento.',
        });
        return;
      }

      const cancelamento = await cidadaoSmartApi.cancelarViaExpressa(identificadorProcesso);
      expect([200, 202, 204], diagnosticoViaExpressaCancelamento()).toContain(cancelamento.status);

      const consultaFinal = await cidadaoSmartApi.consultarProcesso(identificadorProcesso);
      expect(consultaFinal.status, diagnosticoViaExpressaCancelamento()).toBe(200);

      const statusFinal = extrairStatus(consultaFinal.body);
      if (statusFinal) {
        expect(statusFinal, diagnosticoViaExpressaCancelamento()).toMatch(statusCancelado);
        expect(statusFinal, diagnosticoViaExpressaCancelamento()).not.toMatch(statusAtivo);
      }
    });
  });
});
