import fs from 'fs';
import path from 'path';
import { obterProtocolosGerados } from './protocolos.ts';

const destino = path.resolve('test-results/relatorio-testing-company.md');
const protocolos = obterProtocolosGerados();

const linhas = [
  '# Relatorio Testing Company',
  '',
  `Gerado em: ${new Date().toISOString()}`,
  '',
  '## Protocolos registrados',
  '',
  protocolos.length
    ? protocolos
        .map((item) => `- ${item.protocolo} | ${item.fluxo} | ${item.status || 'sem-status'} | ${item.dataExecucao}`)
        .join('\n')
    : '- Nenhum protocolo registrado em `.runtime/protocolos-gerados.json`.',
  '',
  '## Evidencias',
  '',
  '- Relatorio HTML: `playwright-report/`',
  '- Resultados e anexos: `test-results/`',
];

fs.mkdirSync(path.dirname(destino), { recursive: true });
fs.writeFileSync(destino, `${linhas.join('\n')}\n`, 'utf-8');

console.log(`Relatorio Testing Company gerado em ${destino}`);
