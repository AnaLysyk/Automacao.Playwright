import fs from 'fs';
import path from 'path';

type ProtocoloGerado = {
  fluxo: string;
  ambiente: string;
  postoSelecionado: string;
  protocolo: string;
  dataExecucao: string;
};

const OUTPUT = path.resolve('test-results/reports/protocolos-gerados.json');

/**
 * Registra protocolos gerados para anexar evidência da execução.
 */
export function salvarProtocoloGerado(item: ProtocoloGerado): void {
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });

  let atual: ProtocoloGerado[] = [];
  if (fs.existsSync(OUTPUT)) {
    try {
      const texto = fs.readFileSync(OUTPUT, 'utf-8');
      atual = JSON.parse(texto) as ProtocoloGerado[];
    } catch {
      atual = [];
    }
  }

  atual.push(item);
  fs.writeFileSync(OUTPUT, JSON.stringify(atual, null, 2), 'utf-8');
}
