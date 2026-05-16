import { loadEnv } from '../../../support/config/env';

const env = loadEnv();

export const viaExpressaData = {
  cpf: env.cpfComProcessoFinalizado,
  payload: {
    cpf: env.cpfComProcessoFinalizado,
    tipoSolicitacao: 'VIA_EXPRESSA',
    origem: 'automacao-ci',
  },
  cancelamentoDisponivel: Boolean(env.cidadaoSmartCancelExpressPath),
  requiredConfig: {
    SMART_API_BASE_URL: env.smartApiBaseUrl,
    SMART_FINISHED_PROCESS_BY_CPF_PATH: env.smartFinishedProcessByCpfPath,
    SMART_API_TOKEN: env.smartApiToken,
    CIDADAO_SMART_API_BASE_URL: env.cidadaoSmartApiBaseUrl,
    CIDADAO_SMART_EXPRESS_ELIGIBILITY_PATH: env.cidadaoSmartExpressEligibilityPath,
    CIDADAO_SMART_CREATE_EXPRESS_PATH: env.cidadaoSmartCreateExpressPath,
    CIDADAO_SMART_GET_PROCESS_PATH: env.cidadaoSmartGetProcessPath,
    CIDADAO_SMART_API_TOKEN: env.cidadaoSmartApiToken,
    CPF_COM_PROCESSO_FINALIZADO: env.cpfComProcessoFinalizado,
  },
};

export function getMissingViaExpressaConfig(): string[] {
  return Object.entries(viaExpressaData.requiredConfig)
    .filter(([, value]) => !value)
    .map(([name]) => name);
}
