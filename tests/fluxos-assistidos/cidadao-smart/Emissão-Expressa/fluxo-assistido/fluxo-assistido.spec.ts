import type { TestInfo } from '@playwright/test';
import { expect, test } from '../../../../../support/fixtures/test';
import { buscarPostoViaExpressa, type PostoViaExpressa } from '../../../../api/cidadao-smart/via-expressa/posto/posto.flow';
import {
  emitirViaExpressa,
  type EmitirViaExpressaResultado,
} from '../../../../api/cidadao-smart/via-expressa/emitir/emitir.flow';
import {
  bodyTemStatusProcesso,
  consultarViaExpressa,
} from '../../../../api/cidadao-smart/via-expressa/consultar/consultar.flow';
import { deletarViaExpressa } from '../../../../api/cidadao-smart/via-expressa/deletar/deletar.flow';
import { FluxoAssistidoViaExpressaFlow } from './fluxo-assistido.flow';

type MassaUiViaExpressa = {
  protocolo: string;
  cpf: string;
  dataNascimento: string;
  dataNascimentoUi: string;
  posto: PostoViaExpressa;
  emissaoStatus: number;
  payload: unknown;
};

async function anexarJson(
  testInfo: TestInfo,
  nome: string,
  conteudo: unknown,
): Promise<void> {
  await testInfo.attach(nome, {
    body: JSON.stringify(conteudo, null, 2),
    contentType: 'application/json',
  });
}

function payloadComoRegistro(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== 'object') {
    return {};
  }

  return payload as Record<string, unknown>;
}

function campoTexto(payload: unknown, campo: string): string {
  const valor = payloadComoRegistro(payload)[campo];

  return typeof valor === 'string' ? valor : '';
}

function formatarDataNascimentoParaUi(dataNascimento: string): string {
  const valor = dataNascimento.trim();
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(valor);

  if (!iso) {
    return valor;
  }

  return `${iso[3]}/${iso[2]}/${iso[1]}`;
}

function montarMassaUi(
  posto: PostoViaExpressa,
  emissao: EmitirViaExpressaResultado,
): MassaUiViaExpressa {
  const dataNascimento = campoTexto(emissao.payload, 'birthDate');

  return {
    protocolo: emissao.protocolo,
    cpf: campoTexto(emissao.payload, 'cpf'),
    dataNascimento,
    dataNascimentoUi: formatarDataNascimentoParaUi(dataNascimento),
    posto,
    emissaoStatus: emissao.status,
    payload: emissao.payload,
  };
}

test.describe('Cidadao Smart - Via Expressa assistida', () => {
  test('@manual-assisted @integracao @cidadao-smart @via-expressa deve gerar massa pela API e validar fluxo assistido na UI', async ({
    page,
    request,
  }, testInfo) => {
    const fluxo = new FluxoAssistidoViaExpressaFlow(page);
    let protocoloGerado = '';

    try {
      const massa = await test.step('1. Gerar massa de UI pela API', async () => {
        const posto = await buscarPostoViaExpressa();
        const emissao = await emitirViaExpressa(request, posto.id);
        const massaGerada = montarMassaUi(posto, emissao);

        protocoloGerado = massaGerada.protocolo;

        await anexarJson(testInfo, '01-massa-ui-gerada-api.json', {
          massa: massaGerada,
          emissao: {
            url: emissao.url,
            status: emissao.status,
            protocolo: emissao.protocolo,
            body: emissao.body,
          },
        });

        expect(posto.id, 'Validacao: posto disponivel deve possuir identificador.').toBeTruthy();

        expect(
          [200, 201],
          'Validacao: API deve emitir a massa de UI com sucesso.',
        ).toContain(emissao.status);

        expect(
          massaGerada.protocolo,
          'Validacao: API deve retornar protocolo para uso na UI.',
        ).toBeTruthy();

        expect(
          massaGerada.cpf,
          'Validacao: payload usado pela API deve fornecer CPF para a UI.',
        ).toBeTruthy();

        expect(
          massaGerada.dataNascimentoUi,
          'Validacao: payload usado pela API deve fornecer data de nascimento para a UI.',
        ).toBeTruthy();

        return massaGerada;
      });

      await test.step('2. Confirmar protocolo gerado pela API', async () => {
        const resultado = await consultarViaExpressa(request, massa.protocolo);

        await anexarJson(testInfo, '02-consulta-api-protocolo-gerado.json', {
          url: resultado.url,
          status: resultado.status,
          protocolo: massa.protocolo,
          body: resultado.body,
        });

        expect(
          [200, 201],
          'Validacao: consulta API do protocolo gerado deve retornar sucesso.',
        ).toContain(resultado.status);

        expect(
          resultado.url,
          'Validacao: consulta API deve usar o protocolo gerado na URL.',
        ).toContain(massa.protocolo);

        expect(
          bodyTemStatusProcesso(resultado.body),
          'Validacao: consulta API deve retornar status reconhecido do processo.',
        ).toBeTruthy();
      });

      await test.step('3. Consultar protocolo gerado na UI', async () => {
        const resultado = await fluxo.validarConsultaProtocoloGerado(
          massa.protocolo,
          massa.dataNascimentoUi,
          testInfo,
        );

        await anexarJson(testInfo, '03-consulta-ui-protocolo-gerado.json', {
          ...resultado,
          origemMassa: {
            protocolo: massa.protocolo,
            dataNascimentoApi: massa.dataNascimento,
            dataNascimentoUi: massa.dataNascimentoUi,
          },
        });

        if (resultado.permaneceuNaConsulta) {
          testInfo.annotations.push({
            type: 'pendencia',
            description:
              'Comportamento visual de sucesso da consulta ainda nao esta mapeado; o teste registrou URL e dados enviados.',
          });
        }

        expect(
          resultado.protocoloPreenchido,
          'Validacao: UI deve receber o protocolo gerado pela API.',
        ).toBeTruthy();

        expect(
          resultado.dataNascimentoPreenchida,
          'Validacao: UI deve receber a data de nascimento da massa API.',
        ).toBeTruthy();

        expect(
          resultado.botaoHabilitado,
          'Validacao: consulta UI deve habilitar prosseguimento com a massa API.',
        ).toBeTruthy();

        expect(
          resultado.clicouProsseguir,
          'Validacao: consulta UI deve acionar o prosseguimento com a massa API.',
        ).toBeTruthy();
      });

      await test.step('4. Rodar entrada de emissao na UI com CPF da API', async () => {
        const resultado = await fluxo.validarEntradaEmissao(massa.cpf);

        await anexarJson(testInfo, '04-entrada-emissao-ui-cpf-api.json', {
          ...resultado,
          cpfOrigem: 'payload da emissao API',
        });

        expect(resultado.entradaVisivel, 'Validacao: entrada de emissao deve estar visivel.').toBeTruthy();

        expect(
          resultado.cpfFonte,
          'Validacao: CPF usado na UI deve vir da massa gerada pela API.',
        ).toBe('api');

        expect(
          resultado.cpfPreenchido,
          'Validacao: UI deve preencher o CPF gerado pela API.',
        ).toBeTruthy();

        expect(
          resultado.prosseguirAcionado,
          'Validacao: UI deve prosseguir a partir do CPF gerado pela API.',
        ).toBeTruthy();
      });

      await test.step('5. Validar captura facial assistida', async () => {
        const resultado = await fluxo.validarCapturaAssistida();

        await anexarJson(testInfo, '05-captura-facial-assistida.json', resultado);

        if (!resultado.fotoConfigurada) {
          testInfo.annotations.push({
            type: 'pendencia',
            description:
              'CIDADAO_SMART_VALID_PHOTO_PATH nao configurado; o teste validou apenas a tela de captura.',
          });
        }

        if (!resultado.capturaVisivel) {
          testInfo.annotations.push({
            type: 'pendencia',
            description:
              'Tela de captura nao ficou disponivel sem sessao previa; o teste registrou a precondicao assistida.',
          });
          return;
        }

        if (resultado.fotoConfigurada) {
          expect(resultado.fotoConfirmada).toBeTruthy();
        }
      });

      await test.step('6. Validar resumo quando houver sessao previa', async () => {
        const resultado = await fluxo.validarResumoQuandoDisponivel();

        await anexarJson(testInfo, '06-resumo-emissao.json', {
          ...resultado,
          url: fluxo.urlAtual(),
        });

        if (!resultado.resumoDisponivel) {
          testInfo.annotations.push({
            type: 'pendencia',
            description: 'Resumo depende de sessao/fluxo previo no ambiente.',
          });
          return;
        }

        expect(resultado.resumoVisivel).toBeTruthy();
      });
    } finally {
      if (protocoloGerado) {
        await test.step('99. Limpar massa gerada pela API', async () => {
          const resultado = await deletarViaExpressa(request, protocoloGerado);

          await anexarJson(testInfo, '99-limpeza-massa-api.json', {
            url: resultado.url,
            status: resultado.status,
            protocolo: protocoloGerado,
            body: resultado.body,
          });

          expect(
            [200, 201, 202, 204],
            'Validacao: limpeza da massa API deve retornar sucesso.',
          ).toContain(resultado.status);
        });
      }
    }
  });
});
