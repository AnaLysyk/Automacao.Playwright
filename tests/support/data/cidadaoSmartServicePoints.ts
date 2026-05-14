export type ServicePoint = {
  id: string;
  cidade: string;
  nome: string;
  enderecoParcial: string;
  telefone?: string;
  email?: string;
  usarNaDemo?: boolean;
};

export const cidadaoSmartServicePoints: ServicePoint[] = [
  {
    id: 'top-tower',
    cidade: 'Florianópolis',
    nome: 'PCI - FLORIANÓPOLIS - Top Tower',
    enderecoParcial: 'Rua Esteves Júnior, 50',
    telefone: '(48) 3665-9334',
    email: 'sicv.srfln@policiacientifica.sc.gov.br',
    usarNaDemo: true,
  },
  {
    id: 'aeroporto',
    cidade: 'Florianópolis',
    nome: 'PCI - FLORIANÓPOLIS - Aeroporto',
    enderecoParcial: 'Rodovia Acesso ao Aeroporto',
    usarNaDemo: false,
  },
];
