import { loadEnv } from '../../../../support/config/env';
import { selecaoDataHorarioData } from '../selecao-data-horario/selecao-data-horario.data';

const env = loadEnv();

export const agendamentoPresencialData = {
  cidade: process.env.CIDADAO_SMART_DEFAULT_CITY || 'Florianópolis',
  posto: process.env.CIDADAO_SMART_DEFAULT_SERVICE_POINT || 'Top Tower',
  requerente: {
    ...selecaoDataHorarioData.requerente,
    email: env.testEmail || selecaoDataHorarioData.requerente.email,
  },
  dataAgendamento: selecaoDataHorarioData.dataAgendamento,
  horario: selecaoDataHorarioData.horario,
};
