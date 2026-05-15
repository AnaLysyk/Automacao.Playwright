const env = (key: string, fallback = ''): string => process.env[key] || fallback;
const cpfComCinFinalizada = env('CIDADAO_SMART_2VIA_FINALIZADA_CPF');
const nomePadrao = env('CIDADAO_SMART_TEST_NAME', 'Pessoa Teste Automacao');
const nascimentoPadrao = env('CIDADAO_SMART_2VIA_FINALIZADA_NASCIMENTO', env('CIDADAO_SMART_TEST_BIRTH_DATE', '01/01/1990'));
const telefonePadrao = env('CIDADAO_SMART_TEST_PHONE_RAW', '55555555555');

// Massas reais/controladas devem ficar no .env.local da máquina.
// Este arquivo mantém apenas placeholders seguros para o repositório.
export const cidadaoSmartTestMass = {
  elegivel2ViaExpressa: {
    cpf: env('CIDADAO_SMART_2VIA_EXPRESSA_CPF', cpfComCinFinalizada),
    nome: env('CIDADAO_SMART_2VIA_EXPRESSA_NOME', nomePadrao),
    nomeMae: env('CIDADAO_SMART_2VIA_EXPRESSA_NOME_MAE', 'Mae Teste 2 Via Expressa'),
    dataNascimento: env('CIDADAO_SMART_2VIA_EXPRESSA_NASCIMENTO', nascimentoPadrao),
    sexo: env('CIDADAO_SMART_2VIA_EXPRESSA_SEXO', '2'),
    telefone: env('CIDADAO_SMART_2VIA_EXPRESSA_TELEFONE', telefonePadrao),
    email: env('CIDADAO_SMART_2VIA_EXPRESSA_EMAIL', 'qa-2via-expressa@example.com'),
    endereco: env('CIDADAO_SMART_2VIA_EXPRESSA_ENDERECO', 'Endereco Teste'),
    numero: env('CIDADAO_SMART_2VIA_EXPRESSA_NUMERO', '1'),
    bairro: env('CIDADAO_SMART_2VIA_EXPRESSA_BAIRRO', 'Bairro Teste'),
    cidade: env('CIDADAO_SMART_2VIA_EXPRESSA_CIDADE', 'Florianopolis'),
    uf: env('CIDADAO_SMART_2VIA_EXPRESSA_UF', 'SC'),
    cep: env('CIDADAO_SMART_2VIA_EXPRESSA_CEP', '88000000'),
    statusRFB: env('CIDADAO_SMART_2VIA_EXPRESSA_STATUS_RFB', '0'),
  },

  elegivel2ViaComAlteracoes: {
    cpf: env('CIDADAO_SMART_2VIA_ALTERACOES_CPF', cpfComCinFinalizada),
    nome: env('CIDADAO_SMART_2VIA_ALTERACOES_NOME', nomePadrao),
    nomeMae: env('CIDADAO_SMART_2VIA_ALTERACOES_NOME_MAE', 'Mae Teste 2 Via Alteracoes'),
    dataNascimento: env('CIDADAO_SMART_2VIA_ALTERACOES_NASCIMENTO', nascimentoPadrao),
    sexo: env('CIDADAO_SMART_2VIA_ALTERACOES_SEXO', '9'),
    telefone: env('CIDADAO_SMART_2VIA_ALTERACOES_TELEFONE', telefonePadrao),
    email: env('CIDADAO_SMART_2VIA_ALTERACOES_EMAIL', 'qa-2via-alteracoes@example.com'),
    endereco: env('CIDADAO_SMART_2VIA_ALTERACOES_ENDERECO', 'Endereco Teste'),
    numero: env('CIDADAO_SMART_2VIA_ALTERACOES_NUMERO', '2'),
    bairro: env('CIDADAO_SMART_2VIA_ALTERACOES_BAIRRO', 'Bairro Teste'),
    cidade: env('CIDADAO_SMART_2VIA_ALTERACOES_CIDADE', 'Florianopolis'),
    uf: env('CIDADAO_SMART_2VIA_ALTERACOES_UF', 'SC'),
    cep: env('CIDADAO_SMART_2VIA_ALTERACOES_CEP', '88000000'),
    statusRFB: env('CIDADAO_SMART_2VIA_ALTERACOES_STATUS_RFB', '0'),
  },

  menorDe16Anos: {
    cpf: env('CIDADAO_SMART_MENOR_16_CPF'),
    nome: env('CIDADAO_SMART_MENOR_16_NOME', 'Pessoa Teste Menor 16'),
    dataNascimento: env('CIDADAO_SMART_MENOR_16_NASCIMENTO'),
    telefone: env('CIDADAO_SMART_MENOR_16_TELEFONE', '+55 (11) 97777-7777'),
    email: env('CIDADAO_SMART_MENOR_16_EMAIL', 'qa-menor-16@example.com'),
    statusRFB: env('CIDADAO_SMART_MENOR_16_STATUS_RFB', '0'),
    bloqueadoPor: 'MENOR_16_ANOS',
  },

  ineligivel: {
    cpf: env('CIDADAO_SMART_INELEGIVEL_CPF'),
    nome: env('CIDADAO_SMART_INELEGIVEL_NOME', 'Pessoa Teste Inelegivel'),
    dataNascimento: env('CIDADAO_SMART_INELEGIVEL_NASCIMENTO'),
    telefone: env('CIDADAO_SMART_INELEGIVEL_TELEFONE', '+55 (11) 96666-6666'),
    email: env('CIDADAO_SMART_INELEGIVEL_EMAIL', 'qa-inelegivel@example.com'),
    statusRFB: env('CIDADAO_SMART_INELEGIVEL_STATUS_RFB', '2'),
    bloqueadoPor: 'CPF_CANCELADO',
  },

  processoDuplicado: {
    cpf: env('CIDADAO_SMART_PROCESSO_DUPLICADO_CPF'),
    nome: env('CIDADAO_SMART_PROCESSO_DUPLICADO_NOME', 'Pessoa Teste Processo Duplicado'),
    dataNascimento: env('CIDADAO_SMART_PROCESSO_DUPLICADO_NASCIMENTO'),
    statusRFB: env('CIDADAO_SMART_PROCESSO_DUPLICADO_STATUS_RFB', '0'),
    bloqueadoPor: 'PROCESSO_EM_ANDAMENTO',
  },
};

export const postos2ViaExpressa = [
  {
    id: 1,
    nome: 'PCI - FLORIANÓPOLIS - Top Tower',
    cidade: 'Florianópolis',
    endereco: 'Rua Esteves Júnior, 50',
    uf: 'SC',
    cep: '88015101',
    tipo: 'LOCAL',
  },
  {
    id: 2,
    nome: 'PCI - SÃO PAULO - Centro',
    cidade: 'São Paulo',
    endereco: 'Avenida Paulista, 1000',
    uf: 'SP',
    cep: '01311100',
    tipo: 'LOCAL',
  },
  {
    id: 999,
    nome: 'Central Estadual de Retirada',
    cidade: 'Brasília',
    endereco: 'Esplanada dos Ministérios',
    uf: 'DF',
    cep: '70057902',
    tipo: 'CENTRAL',
  },
];

export const statusProcesso2Via = {
  REVIEW: 'REVIEW',
  PARTIALLY_REJECTED: 'PARTIALLY_REJECTED',
  AWAITING_PAYMENT: 'AWAITING_PAYMENT',
  PRINTING: 'PRINTING',
  READY: 'READY',
  FINALIZED: 'FINALIZED',
  ERROR: 'ERROR',
};

export const tiposRejeicao = {
  TOTAL: 'TOTAL_REJECTION',
  PARCIAL: 'PARTIAL_REJECTION',
};

export const tiposDocumento = {
  FACE: 'FACE',
  SIGNATURE: 'SIGNATURE',
  CNH: 'CNH',
  CNS: 'CNS',
  PIS_PASEP: 'PIS_PASEP',
  ELECTORAL_TITLE: 'ELECTORAL_TITLE',
  BIRTH_CERTIFICATE: 'BIRTH_CERTIFICATE',
  MARRIAGE_CERTIFICATE: 'MARRIAGE_CERTIFICATE',
  MILITARY_CERTIFICATE: 'MILITARY_CERTIFICATE',
  PROFESSIONAL_CARD: 'PROFESSIONAL_CARD',
};
