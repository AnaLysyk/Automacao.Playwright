import { expect, test } from '../../../../support/fixtures/test';
import {
  cancelarAgendamento,
  type CancelarAgendamentoResultado,
} from './cancelar/cancelar.flow';
import {
  consultarAgendamento,
  type ConsultarAgendamentoResultado,
} from './consultar/consultar.flow';
import { criarAgendamento, type CriarAgendamentoResultado } from './criar/criar.flow';
import { bookingAgendamentoData, getMissingBookingConfig } from './agendamento.data';
import { buscarPostoAgendamento, type PostoAgendamento } from './posto/posto.flow';

type JsonValue = null | string | number | boolean | JsonValue[] | { [key: string]: JsonValue };

type ResultadoApiAgendamento =
  | CriarAgendamentoResultado
  | ConsultarAgendamentoResultado
  | CancelarAgendamentoResultado;

async function anexarJson(nome: string, conteudo: unknown): Promise<void> {
  await test.info().attach(nome, {
    body: JSON.stringify(conteudo, null, 2),
    contentType: 'application/json',
  });
}

async function anexarMarkdown(nome: string, conteudo: string): Promise<void> {
  await test.info().attach(nome, {
    body: conteudo,
    contentType: 'text/markdown',
  });
}

function pularSeConfigAusente(): void {
  const missingConfig = getMissingBookingConfig();

  test.skip(
    missingConfig.length > 0,
    `Configuracao ausente para API Booking Agendamento: ${missingConfig.join(', ')}`,
  );
}

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

function extrairIdentificadorAgendamento(body: unknown): string {
  return (
    findValue(body, ['id', 'appointmentId', 'agendamentoId', 'protocolo', 'protocol', 'codigo']) ?? ''
  );
}

function extrairStatusAgendamento(body: unknown): string {
  return findValue(body, ['status', 'situacao', 'state']) ?? '';
}

function bodyTemStatusAgendamento(body: unknown): boolean {
  const status = extrairStatusAgendamento(body);

  return Boolean(status) || bookingAgendamentoData.status.ativo.test(asText(body));
}

function bodyIndicaAgendamentoInativoOuCancelado(body: unknown, text: string): boolean {
  const conteudo = `${asText(body)} ${text}`;
  const status = extrairStatusAgendamento(body);

  return (
    bookingAgendamentoData.status.cancelado.test(status) ||
    bookingAgendamentoData.status.cancelado.test(conteudo) ||
    /nao encontrado|not found|invalido|invalid|indisponivel|unavailable/i.test(conteudo)
  );
}

function evidenciaApi(
  etapa: string,
  resultado: ResultadoApiAgendamento,
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    etapa,
    url: resultado.url,
    statusHttp: resultado.status,
    statusNegocio: extrairStatusAgendamento(resultado.body) || null,
    identificador: extrairIdentificadorAgendamento(resultado.body) || null,
    body: resultado.body,
    text: resultado.text,
    ...extra,
  };
}

function montarResumoCicloCompleto(params: {
  posto: PostoAgendamento;
  identificador: string;
  criacao: CriarAgendamentoResultado;
  consultaInicial?: ConsultarAgendamentoResultado;
  cancelamento?: CancelarAgendamentoResultado;
  consultaFinal?: ConsultarAgendamentoResultado;
  agendamentoFicouCancelado: boolean;
}): string {
  return [
    '## Ciclo completo - Booking Agendamento API',
    '',
    '### O que este teste executou',
    '',
    '1. Criou um agendamento/processo pela API Booking.',
    '2. Consultou o identificador retornado pela criacao.',
    '3. Cancelou o identificador criado.',
    '4. Consultou novamente para confirmar que nao permanece ativo.',
    '',
    '### Massa usada',
    '',
    `- Posto: ${params.posto.description || 'sem descricao'} (${params.posto.id})`,
    `- Cidade/UF: ${params.posto.cityName || '-'} / ${params.posto.uf || '-'}`,
    `- Identificador: \`${params.identificador || 'nao capturado'}\``,
    `- Endpoint de criacao: \`${bookingAgendamentoData.paths.criar}\``,
    `- Endpoint de consulta: \`${bookingAgendamentoData.paths.consultar}\``,
    `- Endpoint de cancelamento: \`${bookingAgendamentoData.paths.cancelar}\``,
    `- Metodo de cancelamento: \`${bookingAgendamentoData.paths.cancelarMethod}\``,
    '',
    '### Resultado tecnico',
    '',
    '| Etapa | HTTP | Status de negocio | Identificador retornado |',
    '|---|---:|---|---|',
    `| Criacao | ${params.criacao.status} | ${extrairStatusAgendamento(params.criacao.body) || '-'} | ${params.criacao.identificador || '-'} |`,
    `| Consulta inicial | ${params.consultaInicial?.status ?? '-'} | ${extrairStatusAgendamento(params.consultaInicial?.body) || '-'} | ${extrairIdentificadorAgendamento(params.consultaInicial?.body) || '-'} |`,
    `| Cancelamento | ${params.cancelamento?.status ?? '-'} | ${extrairStatusAgendamento(params.cancelamento?.body) || '-'} | ${extrairIdentificadorAgendamento(params.cancelamento?.body) || '-'} |`,
    `| Consulta final | ${params.consultaFinal?.status ?? '-'} | ${extrairStatusAgendamento(params.consultaFinal?.body) || '-'} | ${extrairIdentificadorAgendamento(params.consultaFinal?.body) || '-'} |`,
    '',
    `Agendamento/processo ficou cancelado ou indisponivel: ${params.agendamentoFicouCancelado ? 'sim' : 'nao'}.`,
    '',
    'Os bodies completos ficam nos anexos JSON de cada etapa.',
    '',
  ].join('\n');
}

test.describe('Booking API - agendamento', () => {
  test('@api @booking @agendamento @criar deve criar agendamento via API', async ({ request }) => {
    pularSeConfigAusente();

    const posto = await test.step('1. Buscar posto disponivel para agendamento', async () => {
      const postoSelecionado = await buscarPostoAgendamento();

      await anexarJson('01-posto-selecionado.json', postoSelecionado);

      expect(postoSelecionado.id, 'Validacao: posto deve possuir identificador.').toBeTruthy();

      return postoSelecionado;
    });

    await test.step('2. Criar agendamento via API', async () => {
      const resultado = await criarAgendamento(request, posto.id);

      await anexarJson(
        '02-criacao-agendamento.json',
        evidenciaApi('criacao', resultado, {
          payload: resultado.payload,
          posto,
        }),
      );

      expect([200, 201], 'Validacao: criacao deve retornar status HTTP de sucesso.').toContain(
        resultado.status,
      );

      expect(
        resultado.identificador,
        'Validacao: criacao deve retornar identificador/protocolo do agendamento.',
      ).toBeTruthy();
    });
  });

  test('@api @booking @agendamento @consultar deve criar e consultar agendamento', async ({
    request,
  }) => {
    pularSeConfigAusente();

    const posto = await test.step('1. Buscar posto disponivel para agendamento', async () => {
      const postoSelecionado = await buscarPostoAgendamento();

      await anexarJson('01-posto-selecionado-consulta.json', postoSelecionado);

      expect(postoSelecionado.id, 'Validacao: posto deve possuir identificador.').toBeTruthy();

      return postoSelecionado;
    });

    const criacao = await test.step('2. Criar agendamento para massa de consulta', async () => {
      const resultado = await criarAgendamento(request, posto.id);

      await anexarJson(
        '02-massa-consulta-agendamento.json',
        evidenciaApi('criacao para consulta', resultado, {
          payload: resultado.payload,
          posto,
        }),
      );

      expect([200, 201], 'Validacao: massa de consulta deve ser criada com sucesso.').toContain(
        resultado.status,
      );
      expect(resultado.identificador, 'Validacao: massa deve retornar identificador.').toBeTruthy();

      return resultado;
    });

    await test.step('3. Consultar agendamento criado', async () => {
      const resultado = await consultarAgendamento(request, criacao.identificador);

      await anexarJson(
        '03-consulta-agendamento-criado.json',
        evidenciaApi('consulta inicial', resultado, {
          identificadorConsultado: criacao.identificador,
        }),
      );

      expect([200, 201], 'Validacao: consulta deve retornar status HTTP de sucesso.').toContain(
        resultado.status,
      );
      expect(resultado.url, 'Validacao: consulta deve usar o identificador criado.').toContain(
        criacao.identificador,
      );
      expect(
        bodyTemStatusAgendamento(resultado.body),
        'Validacao: consulta deve retornar status/dados reconheciveis do agendamento.',
      ).toBeTruthy();
    });
  });

  test('@api @booking @agendamento @cancelar deve criar e cancelar agendamento', async ({
    request,
  }) => {
    pularSeConfigAusente();

    const posto = await test.step('1. Buscar posto disponivel para agendamento', async () => {
      const postoSelecionado = await buscarPostoAgendamento();

      await anexarJson('01-posto-selecionado-cancelamento.json', postoSelecionado);

      expect(postoSelecionado.id, 'Validacao: posto deve possuir identificador.').toBeTruthy();

      return postoSelecionado;
    });

    const criacao = await test.step('2. Criar agendamento para massa de cancelamento', async () => {
      const resultado = await criarAgendamento(request, posto.id);

      await anexarJson(
        '02-massa-cancelamento-agendamento.json',
        evidenciaApi('criacao para cancelamento', resultado, {
          payload: resultado.payload,
          posto,
        }),
      );

      expect(
        [200, 201],
        'Validacao: massa de cancelamento deve ser criada com sucesso.',
      ).toContain(resultado.status);
      expect(resultado.identificador, 'Validacao: massa deve retornar identificador.').toBeTruthy();

      return resultado;
    });

    await test.step('3. Cancelar agendamento criado', async () => {
      const resultado = await cancelarAgendamento(request, criacao.identificador);

      await anexarJson(
        '03-cancelamento-agendamento.json',
        evidenciaApi('cancelamento', resultado, {
          identificadorCancelado: criacao.identificador,
          method: resultado.method,
        }),
      );

      expect(
        [200, 201, 202, 204],
        'Validacao: cancelamento deve retornar status HTTP de sucesso.',
      ).toContain(resultado.status);
    });
  });

  test('@api @booking @agendamento @cicd deve validar ciclo completo do agendamento', async ({
    request,
  }) => {
    pularSeConfigAusente();

    const posto = await test.step('1. Buscar posto disponivel para agendamento', async () => {
      const postoSelecionado = await buscarPostoAgendamento();

      await anexarJson('01-posto-selecionado.json', postoSelecionado);

      expect(postoSelecionado.id, 'Validacao: posto deve possuir identificador.').toBeTruthy();

      return postoSelecionado;
    });

    const criacao = await test.step('2. Criar agendamento via API', async () => {
      const resultado = await criarAgendamento(request, posto.id);

      await anexarJson(
        '02-criacao-agendamento.json',
        evidenciaApi('criacao', resultado, {
          payload: resultado.payload,
          posto,
        }),
      );

      expect([200, 201], 'Validacao: criacao deve retornar status HTTP de sucesso.').toContain(
        resultado.status,
      );
      expect(resultado.identificador, 'Validacao: criacao deve retornar identificador.').toBeTruthy();

      return resultado;
    });

    let consultaInicial: ConsultarAgendamentoResultado | undefined;
    let cancelamento: CancelarAgendamentoResultado | undefined;
    let consultaFinal: ConsultarAgendamentoResultado | undefined;

    await test.step('3. Consultar agendamento criado', async () => {
      const resultado = await consultarAgendamento(request, criacao.identificador);
      consultaInicial = resultado;

      await anexarJson(
        '03-consulta-agendamento-criado.json',
        evidenciaApi('consulta inicial', resultado, {
          identificadorConsultado: criacao.identificador,
        }),
      );

      expect([200, 201], 'Validacao: consulta inicial deve retornar sucesso.').toContain(
        resultado.status,
      );
      expect(resultado.url, 'Validacao: consulta deve usar o identificador criado.').toContain(
        criacao.identificador,
      );
      expect(
        bodyTemStatusAgendamento(resultado.body),
        'Validacao: consulta inicial deve retornar status/dados reconheciveis.',
      ).toBeTruthy();
    });

    await test.step('4. Cancelar agendamento criado', async () => {
      const resultado = await cancelarAgendamento(request, criacao.identificador);
      cancelamento = resultado;

      await anexarJson(
        '04-cancelamento-agendamento.json',
        evidenciaApi('cancelamento', resultado, {
          identificadorCancelado: criacao.identificador,
          method: resultado.method,
        }),
      );

      expect([200, 201, 202, 204], 'Validacao: cancelamento deve retornar sucesso.').toContain(
        resultado.status,
      );
    });

    await test.step('5. Consultar agendamento apos cancelamento', async () => {
      const resultado = await consultarAgendamento(request, criacao.identificador);
      consultaFinal = resultado;

      const retornouNaoEncontradoOuInvalido = [400, 404, 422].includes(resultado.status);
      const retornouComoCanceladoOuIndisponivel =
        resultado.status === 200 && bodyIndicaAgendamentoInativoOuCancelado(resultado.body, resultado.text);
      const agendamentoFicouCancelado =
        retornouNaoEncontradoOuInvalido || retornouComoCanceladoOuIndisponivel;

      await anexarJson(
        '05-consulta-agendamento-apos-cancelamento.json',
        evidenciaApi('consulta final', resultado, {
          identificadorConsultado: criacao.identificador,
          resultadoValidacao: agendamentoFicouCancelado,
          regraAceita:
            'Apos o cancelamento, o agendamento deve ficar cancelado, inativo ou indisponivel. O teste aceita 400/404/422 ou 200 com status/texto de cancelamento/inatividade.',
        }),
      );

      await anexarMarkdown(
        'resumo-ciclo-completo-agendamento.md',
        montarResumoCicloCompleto({
          identificador: criacao.identificador,
          posto,
          criacao,
          consultaInicial,
          cancelamento,
          consultaFinal,
          agendamentoFicouCancelado,
        }),
      );

      expect(
        agendamentoFicouCancelado,
        'Validacao: apos o cancelamento, o agendamento deve ficar cancelado, inativo ou indisponivel.',
      ).toBeTruthy();
    });
  });
});
