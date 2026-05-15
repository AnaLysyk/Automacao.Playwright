import fs from 'fs';
import path from 'path';
import { obterProtocolosGerados } from './protocolos.ts';

const destino = path.resolve('test-results/relatorio-griaule.md');
const protocolos = obterProtocolosGerados();

const linhas = [
  '# Relatorio Griaule',
  '',
  `Gerado em: ${new Date().toISOString()}`,
  '',
  '## Resumo operacional',
  '',
  `Protocolos registrados: ${protocolos.length}`,
  '',
  '## Ultimos protocolos',
  '',
  protocolos.length
    ? protocolos
        .slice(-10)
        .map((item) => `- ${item.protocolo} | ${item.fluxo} | ${item.status || 'sem-status'} | ${item.ambiente}`)
        .join('\n')
    : '- Nenhum protocolo registrado em `.runtime/protocolos-gerados.json`.',
  '',
  '## Observacoes',
  '',
  '- Fluxos assistidos dependem de QA, CAPTCHA, codigo por e-mail ou SMART manual.',
  '- Evidencias locais ficam em `test-results/` e nao devem ser versionadas.',
];

fs.mkdirSync(path.dirname(destino), { recursive: true });
fs.writeFileSync(destino, `${linhas.join('\n')}\n`, 'utf-8');

console.log(`Relatorio Griaule gerado em ${destino}`);
