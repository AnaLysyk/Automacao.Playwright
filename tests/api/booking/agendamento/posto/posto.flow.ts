import { authApi } from '../../../../../support/api/auth.api';
import { loadEnv } from '../../../../../support/config/env';
import { postoAgendamentoData } from './posto.data';

const env = loadEnv();

export type PostoAgendamento = {
  id: number;
  description?: string;
  type?: string;
  cityName?: string;
  uf?: string;
};

type ListarPostosResponse = {
  content?: PostoAgendamento[];
};

function resumirPosto(posto: PostoAgendamento): PostoAgendamento {
  return {
    id: posto.id,
    description: posto.description,
    type: posto.type,
    cityName: posto.cityName,
    uf: posto.uf,
  };
}

export async function buscarPostoAgendamento(): Promise<PostoAgendamento> {
  const token = await authApi.gerarTokenInterno();
  const query = new URLSearchParams();

  query.set('filter', postoAgendamentoData.filtroPreferencial);
  query.set('pageNumber', String(postoAgendamentoData.pageNumber));
  query.set('pageSize', String(postoAgendamentoData.pageSize));
  query.set('types', postoAgendamentoData.types);

  const url = `${env.bookingApiBaseUrl}/api/stations/filter?${query.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'x-operator-cpf': env.xOperatorCpf,
    },
  });

  const text = await response.text();
  const body = text.trim() ? (JSON.parse(text) as ListarPostosResponse) : null;
  const postos = body?.content ?? [];
  const posto =
    postos.find((item) => item.id && item.type === 'SERVICE_PICKUP') ??
    postos.find((item) => item.id);

  if (!posto?.id) {
    throw new Error(
      [
        '[BOOKING][AGENDAMENTO][POSTO] Falhou ao buscar posto valido.',
        `URL: ${url}`,
        `Status: ${response.status}`,
        `Total retornado: ${postos.length}`,
        text ? `Resposta: ${text}` : 'Resposta: sem texto retornado',
      ].join('\n'),
    );
  }

  return resumirPosto(posto);
}
