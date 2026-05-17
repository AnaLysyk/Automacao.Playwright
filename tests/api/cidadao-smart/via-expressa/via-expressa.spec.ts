import fs from 'fs';
import path from 'path';
import { expect, test } from '../../../../support/fixtures/test';
import { buscarPostoViaExpressa, type PostoViaExpressa } from './posto/posto.flow';
import {
  emitirViaExpressa,
  type EmitirViaExpressaResultado,
} from './emitir/emitir.flow';
import {
  bodyTemStatusProcesso,
  consultarViaExpressa,
  type ConsultarViaExpressaResultado,
} from './consultar/consultar.flow';
import {
  deletarViaExpressa,
  type DeletarViaExpressaResultado,
} from './deletar/deletar.flow';
import {
  diagnosticarConsultaViaExpressa,
  type DiagnosticoResultado,
} from './diagnostico/diagnosticar-consulta.flow';

function bodyIndicaViaExpressaInativaOuDeletada(body: unknown): boolean {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const bodyComoObjeto = body as Record<string, unknown>;
  const status = String(bodyComoObjeto.status || '').toUpperCase();

  return ['ERROR', 'DELETED', 'CANCELLED', 'CANCELED', 'INVALID', 'INVALIDO'].includes(status);
}

function registrarObservacaoConhecida(conteudo: string): void {
  const caminho = path.resolve(process.cwd(), 'test-results', 'cicd-observations.md');

  fs.mkdirSync(path.dirname(caminho), { recursive: true });
  fs.writeFileSync(caminho, conteudo, 'utf-8');
}

function montarObservacaoConsultaAposDelete(): string {
  return [
    '## Observacoes conhecidas',
    '',
    '### Consulta apos delete da via expressa',
    '',
    'Apos deletar a via expressa, a API ainda permite consultar o protocolo e retorna status HTTP `200` com status tecnico `ERROR` no body.',
    '',
    'Esse comportamento foi aceito no teste automatizado porque representa o fluxo atual existente do ambiente validado.',
    '',
    'Do ponto de vista de contrato/negocio, o comportamento ideal seria a API retornar um estado explicito de processo deletado/cancelado, como `DELETED` ou `CANCELLED`, ou entao retornar uma resposta de nao encontrado/invalido, como `404`, `400` ou `422`.',
    '',
    'Portanto, o cenario passa quando o processo nao permanece ativo apos o delete, mas fica registrada esta observacao tecnica para acompanhamento futuro.',
    '',
  ].join('\n');
}

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

function evidenciaEmissao(resultado: EmitirViaExpressaResultado): Record<string, unknown> {
  return {
    url: resultado.url,
    status: resultado.status,
    protocolo: resultado.protocolo,
    payload: resultado.payload,
    body: resultado.body,
  };
}

function evidenciaConsulta(
  resultado: ConsultarViaExpressaResultado,
  protocolo: string,
): Record<string, unknown> {
  return {
    url: resultado.url,
    status: resultado.status,
    protocolo,
    body: resultado.body,
  };
}

function evidenciaDelete(
  resultado: DeletarViaExpressaResultado,
  protocolo: string,
): Record<string, unknown> {
  return {
    url: resultado.url,
    status: resultado.status,
    protocolo,
    body: resultado.body,
  };
}

function limparTextoTabelaMarkdown(valor: unknown): string {
  return String(valor ?? '')
    .replace(/\r?\n/g, ' ')
    .replace(/\|/g, '\\|');
}

function montarResumoDiagnosticoConsulta(
  protocolo: string,
  resultados: DiagnosticoResultado[],
): string {
  const variacoesQueEncontraramProcesso = resultados.filter((resultado) => resultado.encontrouProcesso);
  const variacaoRecomendada = variacoesQueEncontraramProcesso[0]?.nome ?? 'nenhuma variacao confirmou o processo';
  const linhasResultado = resultados.map((resultado) =>
    [
      limparTextoTabelaMarkdown(resultado.nome),
      limparTextoTabelaMarkdown(resultado.descricao),
      resultado.status,
      resultado.encontrouProcesso ? 'sim' : 'nao',
      limparTextoTabelaMarkdown(resultado.resumo),
    ].join(' | '),
  );

  return [
    '## Diagnostico de consulta - Via Expressa',
    '',
    '### O que este teste executou',
    '',
    '1. Buscou um posto valido para criar uma massa real.',
    '2. Emitiu uma Via Expressa nova pela API.',
    `3. Usou o protocolo gerado: \`${protocolo}\`.`,
    '4. Executou variacoes de consulta mudando token, headers e uso de birthDate.',
    '5. Registrou o resultado de cada variacao no JSON anexado.',
    '',
    '### Como ler o HTML',
    '',
    'Quando o Playwright mostra `GET "...?birthDate=..." x4`, ele esta agrupando chamadas com a mesma URL visivel.',
    'Neste diagnostico, essas chamadas nao sao iguais do ponto de vista tecnico: elas mudam token, header ou formato do parametro.',
    '',
    '### Resultado das variacoes',
    '',
    '| Variacao | O que testa | HTTP | Confirmou processo | Resumo |',
    '|---|---|---:|---|---|',
    ...linhasResultado,
    '',
    '### Leitura do resultado',
    '',
    `Variacao recomendada pela execucao: \`${variacaoRecomendada}\`.`,
    '',
    'O criterio deste diagnostico e confirmar que pelo menos uma variacao consegue consultar o protocolo emitido.',
    'O fluxo principal de regressao deve continuar usando o teste `@cicd`.',
    '',
  ].join('\n');
}

function montarResumoCicloCompleto(params: {
  posto: PostoViaExpressa;
  emissao: EmitirViaExpressaResultado;
  consultaInicial?: ConsultarViaExpressaResultado;
  deleteProcesso?: DeletarViaExpressaResultado;
  consultaAposDelete?: ConsultarViaExpressaResultado;
  processoFicouInativo: boolean;
}): string {
  return [
    '## Ciclo completo - Via Expressa',
    '',
    '### O que este teste executou',
    '',
    '1. Buscou um posto disponivel para Via Expressa.',
    '2. Emitiu uma Via Expressa nova pela API.',
    '3. Consultou o protocolo emitido.',
    '4. Deletou o protocolo emitido.',
    '5. Consultou novamente para confirmar que o processo nao permaneceu ativo.',
    '',
    '### Massa usada',
    '',
    `- Posto: ${params.posto.description || 'sem descricao'} (${params.posto.id})`,
    `- Cidade/UF: ${params.posto.cityName || '-'} / ${params.posto.uf || '-'}`,
    `- Protocolo: \`${params.emissao.protocolo}\``,
    '',
    '### Resultado tecnico',
    '',
    '| Etapa | HTTP | Leitura |',
    '|---|---:|---|',
    `| Emissao | ${params.emissao.status} | protocolo retornado: ${params.emissao.protocolo || '-'} |`,
    `| Consulta inicial | ${params.consultaInicial?.status ?? '-'} | ${resumirResultadoConsulta(params.consultaInicial)} |`,
    `| Delete | ${params.deleteProcesso?.status ?? '-'} | ${params.deleteProcesso ? 'delete executado' : '-'} |`,
    `| Consulta apos delete | ${params.consultaAposDelete?.status ?? '-'} | ${resumirResultadoConsulta(params.consultaAposDelete)} |`,
    '',
    `Processo ficou inativo/indisponivel apos delete: ${params.processoFicouInativo ? 'sim' : 'nao'}.`,
    '',
  ].join('\n');
}

function resumirResultadoConsulta(resultado?: ConsultarViaExpressaResultado): string {
  if (!resultado) return '-';

  if (bodyTemStatusProcesso(resultado.body)) {
    return 'retornou status reconhecido do processo';
  }

  return 'sem status reconhecido no body';
}

test.describe('Cidadao Smart API - via expressa', () => {
  test('@api @cidadao-smart @via-expressa @emitir deve emitir via expressa', async ({
    request,
  }) => {
    const posto = await test.step('1. Buscar posto disponivel para via expressa', async () => {
      const postoSelecionado = await buscarPostoViaExpressa();

      await anexarJson('posto-selecionado.json', postoSelecionado);

      expect(
        postoSelecionado.id,
        'Validacao: posto disponivel deve possuir identificador.',
      ).toBeTruthy();

      return postoSelecionado;
    });

    await test.step('2. Emitir via expressa', async () => {
      const resultado = await emitirViaExpressa(request, posto.id);

      await anexarJson('emissao-via-expressa.json', evidenciaEmissao(resultado));

      expect(
        [200, 201],
        'Validacao: emissao deve retornar status HTTP de sucesso.',
      ).toContain(resultado.status);

      expect(
        resultado.protocolo,
        'Validacao: emissao deve retornar numero de protocolo.',
      ).toBeTruthy();
    });
  });

  test('@api @cidadao-smart @via-expressa @consultar deve emitir e consultar via expressa', async ({
    request,
  }) => {
    const posto = await test.step('1. Buscar posto disponivel para via expressa', async () => {
      const postoSelecionado = await buscarPostoViaExpressa();

      await anexarJson('posto-selecionado-consulta.json', postoSelecionado);

      expect(
        postoSelecionado.id,
        'Validacao: posto disponivel deve possuir identificador.',
      ).toBeTruthy();

      return postoSelecionado;
    });

    const emissao = await test.step('2. Emitir via expressa para massa de consulta', async () => {
      const resultado = await emitirViaExpressa(request, posto.id);

      await anexarJson('massa-consulta-emissao.json', evidenciaEmissao(resultado));

      expect(
        [200, 201],
        'Validacao: emissao para consulta deve retornar status HTTP de sucesso.',
      ).toContain(resultado.status);

      expect(
        resultado.protocolo,
        'Validacao: emissao para consulta deve retornar numero de protocolo.',
      ).toBeTruthy();

      return resultado;
    });

    await test.step('3. Consultar protocolo emitido', async () => {
      const resultado = await consultarViaExpressa(request, emissao.protocolo);

      await anexarJson(
        'consulta-protocolo-emitido.json',
        evidenciaConsulta(resultado, emissao.protocolo),
      );

      expect(
        [200, 201],
        'Validacao: consulta do protocolo emitido deve retornar status HTTP de sucesso.',
      ).toContain(resultado.status);

      expect(
        resultado.url,
        'Validacao: consulta deve usar o protocolo emitido na URL.',
      ).toContain(emissao.protocolo);

      expect(
        bodyTemStatusProcesso(resultado.body),
        'Validacao: consulta deve retornar status reconhecido do processo.',
      ).toBeTruthy();
    });
  });

  test('@api @cidadao-smart @via-expressa @deletar deve emitir e deletar via expressa', async ({
    request,
  }) => {
    const posto = await test.step('1. Buscar posto disponivel para via expressa', async () => {
      const postoSelecionado = await buscarPostoViaExpressa();

      await anexarJson('posto-selecionado-delete.json', postoSelecionado);

      expect(
        postoSelecionado.id,
        'Validacao: posto disponivel deve possuir identificador.',
      ).toBeTruthy();

      return postoSelecionado;
    });

    const emissao = await test.step('2. Emitir via expressa para massa de delete', async () => {
      const resultado = await emitirViaExpressa(request, posto.id);

      await anexarJson('massa-delete-emissao.json', evidenciaEmissao(resultado));

      expect(
        [200, 201],
        'Validacao: emissao para delete deve retornar status HTTP de sucesso.',
      ).toContain(resultado.status);

      expect(
        resultado.protocolo,
        'Validacao: emissao para delete deve retornar numero de protocolo.',
      ).toBeTruthy();

      return resultado;
    });

    await test.step('3. Deletar via expressa emitida', async () => {
      const resultado = await deletarViaExpressa(request, emissao.protocolo);

      await anexarJson('delete-via-expressa.json', evidenciaDelete(resultado, emissao.protocolo));

      expect(
        [200, 201, 202, 204],
        'Validacao: delete deve retornar status HTTP de sucesso.',
      ).toContain(resultado.status);
    });
  });

  test('@api @cidadao-smart @via-expressa @diagnostico-consulta deve emitir e diagnosticar consulta da via expressa', async ({
    request,
  }) => {
    const posto = await test.step('1. Buscar posto disponivel para via expressa', async () => {
      const postoSelecionado = await buscarPostoViaExpressa();

      await anexarJson('posto-selecionado-diagnostico.json', postoSelecionado);

      expect(
        postoSelecionado.id,
        'Validacao: posto disponivel deve possuir identificador.',
      ).toBeTruthy();

      return postoSelecionado;
    });

    const emissao = await test.step('2. Emitir via expressa para diagnostico', async () => {
      const resultado = await emitirViaExpressa(request, posto.id);

      await anexarJson('emissao-diagnostico.json', evidenciaEmissao(resultado));

      expect(
        [200, 201],
        'Validacao: emissao para diagnostico deve retornar status HTTP de sucesso.',
      ).toContain(resultado.status);

      expect(
        resultado.protocolo,
        'Validacao: emissao para diagnostico deve retornar numero de protocolo.',
      ).toBeTruthy();

      return resultado;
    });

    await test.step('3. Executar variacoes de consulta por token, header e birthDate', async () => {
      const resultados = await diagnosticarConsultaViaExpressa(request, emissao.protocolo);

      await anexarMarkdown(
        'diagnostico-consulta-resumo.md',
        montarResumoDiagnosticoConsulta(emissao.protocolo, resultados),
      );
      await anexarJson('diagnostico-consulta.json', resultados);

      expect(
        resultados.length,
        'Validacao: diagnostico deve executar ao menos uma variacao de consulta.',
      ).toBeGreaterThan(0);

      expect(
        resultados.some((resultado) => resultado.encontrouProcesso),
        'Validacao: ao menos uma variacao deve confirmar o protocolo emitido.',
      ).toBeTruthy();
    });
  });

  test('@api @cidadao-smart @via-expressa @cicd deve validar ciclo completo da via expressa', async ({
    request,
  }) => {
    const posto = await test.step('1. Buscar posto disponivel para via expressa', async () => {
      const postoSelecionado = await buscarPostoViaExpressa();

      await anexarJson('01-posto-selecionado.json', postoSelecionado);

      expect(
        postoSelecionado.id,
        'Validacao: posto disponivel deve possuir identificador.',
      ).toBeTruthy();

      return postoSelecionado;
    });

    const emissao = await test.step('2. Emitir via expressa', async () => {
      const resultado = await emitirViaExpressa(request, posto.id);

      await anexarJson('02-emissao-via-expressa.json', evidenciaEmissao(resultado));

      expect(
        [200, 201],
        'Validacao: emissao deve retornar status HTTP de sucesso.',
      ).toContain(resultado.status);

      expect(
        resultado.protocolo,
        'Validacao: emissao deve retornar numero de protocolo.',
      ).toBeTruthy();

      return resultado;
    });

    let consultaInicial: ConsultarViaExpressaResultado | undefined;
    let deleteProcesso: DeletarViaExpressaResultado | undefined;
    let consultaAposDelete: ConsultarViaExpressaResultado | undefined;

    await test.step('3. Consultar protocolo emitido', async () => {
      const resultado = await consultarViaExpressa(request, emissao.protocolo);
      consultaInicial = resultado;

      await anexarJson(
        '03-consulta-protocolo-emitido.json',
        evidenciaConsulta(resultado, emissao.protocolo),
      );

      expect(
        [200, 201],
        'Validacao: consulta do protocolo emitido deve retornar status HTTP de sucesso.',
      ).toContain(resultado.status);

      expect(
        resultado.url,
        'Validacao: consulta deve usar o protocolo emitido na URL.',
      ).toContain(emissao.protocolo);

      expect(
        bodyTemStatusProcesso(resultado.body),
        'Validacao: consulta deve retornar status reconhecido do processo.',
      ).toBeTruthy();
    });

    await test.step('4. Deletar via expressa emitida', async () => {
      const resultado = await deletarViaExpressa(request, emissao.protocolo);
      deleteProcesso = resultado;

      await anexarJson('04-delete-via-expressa.json', evidenciaDelete(resultado, emissao.protocolo));

      expect(
        [200, 201, 202, 204],
        'Validacao: delete deve retornar status HTTP de sucesso.',
      ).toContain(resultado.status);
    });

    await test.step('5. Validar situacao apos delete', async () => {
      const resultado = await consultarViaExpressa(request, emissao.protocolo);
      consultaAposDelete = resultado;

      const retornouNaoEncontradoOuInvalido = [400, 404, 422].includes(resultado.status);
      const retornouComoIndisponivel =
        resultado.status === 200 && bodyIndicaViaExpressaInativaOuDeletada(resultado.body);
      const comportamentoAtualConhecido =
        resultado.status === 200 && bodyIndicaViaExpressaInativaOuDeletada(resultado.body);

      if (comportamentoAtualConhecido) {
        const observacao = montarObservacaoConsultaAposDelete();

        registrarObservacaoConhecida(observacao);
        await anexarMarkdown('observacao-consulta-apos-delete.md', observacao);
      }

      await anexarJson('05-consulta-apos-delete.json', {
        url: resultado.url,
        status: resultado.status,
        body: resultado.body,
        resultadoValidacao: retornouNaoEncontradoOuInvalido || retornouComoIndisponivel,
        regraAceita:
          'Apos o delete, o protocolo deve ficar inativo ou indisponivel. O teste aceita o comportamento atual conhecido: 400/404/422 ou 200 com status tecnico ERROR/DELETED/CANCELLED.',
      });

      await anexarMarkdown(
        'resumo-ciclo-completo-via-expressa.md',
        montarResumoCicloCompleto({
          posto,
          emissao,
          consultaInicial,
          deleteProcesso,
          consultaAposDelete,
          processoFicouInativo: retornouNaoEncontradoOuInvalido || retornouComoIndisponivel,
        }),
      );

      expect(
        retornouNaoEncontradoOuInvalido || retornouComoIndisponivel,
        'Validacao: apos o delete, a via expressa deve ficar inativa ou indisponivel.',
      ).toBeTruthy();
    });
  });
});
