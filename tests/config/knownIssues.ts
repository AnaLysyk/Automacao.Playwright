export type KnownIssue = {
  id: string;
  title: string;
  message: string;
};

export const knownIssues = {
  postoTopTowerAeroporto: {
    id: 'KNOWN-POSTO-001',
    title: 'Divergência Top Tower / Aeroporto',
    message:
      'Aeroporto visível após seleção de Top Tower. Divergência conhecida de configuração/tipo de posto no banco. Não bloquear E2E principal.',
  },
} satisfies Record<string, KnownIssue>;

