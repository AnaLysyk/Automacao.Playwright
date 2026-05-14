export type KnownIssue = {
  id: string;
  title: string;
  message: string;
};

export const knownIssues = {
  postoTopTowerAeroporto: {
    id: 'KNOWN-POSTO-001',
    title: 'Divergencia Top Tower / Aeroporto',
    message:
      'Aeroporto visivel apos selecao de Top Tower. Divergencia conhecida de configuracao/tipo de posto no banco. Nao bloquear E2E principal.',
  },
} satisfies Record<string, KnownIssue>;

