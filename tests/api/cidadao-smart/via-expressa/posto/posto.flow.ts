import { bookingApi } from '../../../../../support/api/booking.api';
import { postoViaExpressaData } from './posto.data';

export type PostoViaExpressa = {
  id: number;
  description?: string;
  type?: string;
  cityName?: string;
  uf?: string;
};

type ListarPostosResponse = {
  content?: PostoViaExpressa[];
};

function resumirPosto(posto: PostoViaExpressa): PostoViaExpressa {
  return {
    id: posto.id,
    description: posto.description,
    type: posto.type,
    cityName: posto.cityName,
    uf: posto.uf,
  };
}

function obterTextoResposta(response: unknown): string {
  if (!response || typeof response !== 'object') {
    return '';
  }

  const responseComoObjeto = response as Record<string, unknown>;
  const text = responseComoObjeto.text;

  return typeof text === 'string' ? text : '';
}

export async function buscarPostoViaExpressa(): Promise<PostoViaExpressa> {
  const response = await bookingApi.listarPostosPorTipo<ListarPostosResponse>({
    filter: postoViaExpressaData.filtroPreferencial,
    pageNumber: postoViaExpressaData.pageNumber,
    pageSize: postoViaExpressaData.pageSize,
    types: postoViaExpressaData.types,
  });

  const postos = response.body?.content ?? [];

  const posto =
    postos.find((item) => item.id && item.type === 'SERVICE_PICKUP') ??
    postos.find((item) => item.id);

  if (!posto?.id) {
    const text = obterTextoResposta(response);

    throw new Error(
      [
        '[VIA_EXPRESSA][POSTO] Falhou ao buscar posto válido para via expressa.',
        '',
        `Filtro: ${postoViaExpressaData.filtroPreferencial}`,
        `Types: ${postoViaExpressaData.types}`,
        `Status: ${response.status}`,
        `Total retornado: ${postos.length}`,
        text ? `Resposta: ${text}` : 'Resposta: sem texto retornado',
      ].join('\n'),
    );
  }

  return resumirPosto(posto);
}
