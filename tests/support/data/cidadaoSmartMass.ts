// CPF real processado no Smart com dados da RFB
// Elegível para 2ª via expressa e com alterações
export const cidadaoSmartTestMass = {
  elegivel2ViaExpressa: {
    cpf: "03659187763",
    nome: "ILHZMV HLZIVH ERVRIZ",
    nomeMae: "NZIRZ WLH HZMGLH HLZIVH",
    dataNascimento: "19740124",
    sexo: "2",
    telefone: "+55 (31) 3511-2130",
    email: "teste@griaule.com",
    endereco: "VHG XZNKL WZ ZERZXZL",
    numero: "15",
    bairro: "VILA SANTA ALICE",
    cidade: "Rio de Janeiro",
    uf: "RJ",
    cep: "25250330",
    statusRFB: "0", // ativo
  },

  elegivel2ViaComAlteracoes: {
    cpf: "06834801707",
    nome: "OFXRVMV WZ XLMXVRXZL TLMXZOEVH XZNKLH",
    nomeMae: "NZIRZ WV ORNZ XZNKLH",
    dataNascimento: "19761208",
    sexo: "9",
    telefone: "+55 (21) 99888-6864",
    email: "lucienecampos812@gmail.com",
    endereco: "GI ZNZWVF",
    numero: "8",
    bairro: "MANGUEIRA",
    cidade: "Rio de Janeiro",
    uf: "RJ",
    cep: "20943140",
    statusRFB: "0", // ativo
  },

  menorDe16Anos: {
    cpf: "13036174630",
    nome: "HSZIZ KIRHXROZ NZIGRMH ZYIVF",
    dataNascimento: "20130516",
    statusRFB: "0",
    bloqueadoPor: "MENOR_16_ANOS",
  },

  ineligivel: {
    cpf: "00979771447",
    nome: "TRLEZMV NFMRA YZIIVGL",
    dataNascimento: "19570517",
    statusRFB: "2", // cancelado
    bloqueadoPor: "CPF_CANCELADO",
  },

  processoDuplicado: {
    cpf: "03659184829",
    nome: "ZKZIVXRWL WLMRAVGV HVOOZ",
    dataNascimento: "19610905",
    statusRFB: "0",
    bloqueadoPor: "PROCESSO_EM_ANDAMENTO",
  },
};

export const postos2ViaExpressa = [
  {
    id: 1,
    nome: "PCI - FLORIANÓPOLIS - Top Tower",
    cidade: "Florianópolis",
    endereco: "Rua Esteves Júnior, 50",
    uf: "SC",
    cep: "88015101",
    tipo: "LOCAL",
  },
  {
    id: 2,
    nome: "PCI - SÃO PAULO - Centro",
    cidade: "São Paulo",
    endereco: "Avenida Paulista, 1000",
    uf: "SP",
    cep: "01311100",
    tipo: "LOCAL",
  },
  {
    id: 999,
    nome: "Central Estadual de Retirada",
    cidade: "Brasília",
    endereco: "Esplanade dos Ministérios",
    uf: "DF",
    cep: "70057902",
    tipo: "CENTRAL",
  },
];

// Status do processo conforme documentação
export const statusProcesso2Via = {
  REVIEW: "REVIEW", // Análise de documentos
  PARTIALLY_REJECTED: "PARTIALLY_REJECTED", // Rejeição parcial
  AWAITING_PAYMENT: "AWAITING_PAYMENT", // Pagamento pendente
  PRINTING: "PRINTING", // Documento em produção
  READY: "READY", // Pronto para retirada
  FINALIZED: "FINALIZED", // Entregue
  ERROR: "ERROR", // Erro no processo
};

export const tiposRejeicao = {
  TOTAL: "TOTAL_REJECTION",
  PARCIAL: "PARTIAL_REJECTION",
};

export const tiposDocumento = {
  FACE: "FACE",
  SIGNATURE: "SIGNATURE",
  CNH: "CNH",
  CNS: "CNS",
  PIS_PASEP: "PIS_PASEP",
  ELECTORAL_TITLE: "ELECTORAL_TITLE",
  BIRTH_CERTIFICATE: "BIRTH_CERTIFICATE",
  MARRIAGE_CERTIFICATE: "MARRIAGE_CERTIFICATE",
  MILITARY_CERTIFICATE: "MILITARY_CERTIFICATE",
  PROFESSIONAL_CARD: "PROFESSIONAL_CARD",
};
